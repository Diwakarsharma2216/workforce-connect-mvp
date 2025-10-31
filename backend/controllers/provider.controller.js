const mongoose = require('mongoose');
const CraftProvider = require('../models/craftProvider.model');
const Craftworker = require('../models/craftworker.model');

// GET /api/provider/profile - get provider profile for logged-in user
const getProfile = async (req, res) => {
  try {
    const profile = await CraftProvider.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    return res.json({ success: true, data: profile });
  } catch (err) {
    console.error('Get provider profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch provider profile' });
  }
};

// PUT /api/provider/profile - update provider profile for logged-in user
const updateProfile = async (req, res) => {
  try {
    const allowed = ['companyName', 'location', 'contactPerson', 'phone', 'description'];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }

    const profile = await CraftProvider.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    return res.json({ success: true, message: 'Profile updated', data: profile });
  } catch (err) {
    console.error('Update provider profile error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Invalid data' });
  }
};

// GET /api/provider/roster - get roster with craftworker details
const getRoster = async (req, res) => {
  try {
    const provider = await CraftProvider.findOne({ userId: req.user.id })
      .populate('roster.craftsmanId', 'fullName phone location skills experience certifications bio')
      .lean();

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    return res.json({ success: true, data: provider.roster || [] });
  } catch (err) {
    console.error('Get roster error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch roster' });
  }
};

// GET /api/provider/craftworkers/search - search for craftworkers to add to roster
const searchCraftworkers = async (req, res) => {
  try {
    const { search, location, skills, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build search filter
    const filter = {};

    // Search by name
    if (search) {
      filter.fullName = new RegExp(search, 'i'); // Case-insensitive search
    }

    // Filter by location
    if (location) {
      filter.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') }
      ];
    }

    // Filter by skills
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      filter.skills = { $in: skillsArray.map(skill => new RegExp(skill, 'i')) };
    }

    // Get provider to exclude craftworkers already in roster
    const provider = await CraftProvider.findOne({ userId: req.user.id });
    if (provider && provider.roster && provider.roster.length > 0) {
      const rosterIds = provider.roster.map(r => r.craftsmanId);
      filter._id = { $nin: rosterIds }; // Exclude already added craftworkers
    }

    // Find craftworkers
    const craftworkers = await Craftworker.find(filter)
      .select('fullName phone location skills experience certifications bio')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ fullName: 1 })
      .lean();

    // Get total count for pagination
    const total = await Craftworker.countDocuments(filter);

    return res.json({
      success: true,
      data: craftworkers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Search craftworkers error:', err);
    return res.status(500).json({ success: false, message: 'Failed to search craftworkers' });
  }
};

// POST /api/provider/roster - add craftworker to roster
const addToRoster = async (req, res) => {
  try {
    const { craftsmanId } = req.body;
    if (!craftsmanId) {
      return res.status(400).json({ success: false, message: 'Craftworker ID is required' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(craftsmanId)) {
      return res.status(400).json({ success: false, message: 'Invalid craftworker ID format' });
    }

    // Check if craftworker exists
    const craftworker = await Craftworker.findById(craftsmanId);
    if (!craftworker) {
      return res.status(404).json({ success: false, message: 'Craftworker not found' });
    }

    // Get provider
    const provider = await CraftProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    // Check if craftworker is already in roster
    const existing = provider.roster.find(
      (r) => r.craftsmanId.toString() === craftsmanId.toString()
    );
    if (existing) {
      return res.status(400).json({ success: false, message: 'Craftworker already in roster' });
    }

    // Add to roster
    provider.roster.push({
      craftsmanId,
      addedAt: new Date(),
      status: 'active',
    });

    // Update craftworker's providerId
    craftworker.providerId = provider._id;
    craftworker.isIndependent = false;
    await craftworker.save();

    await provider.save();

    // Populate and return updated roster
    await provider.populate('roster.craftsmanId', 'fullName phone location skills experience certifications bio');

    return res.json({ success: true, message: 'Craftworker added to roster', data: provider.roster });
  } catch (err) {
    console.error('Add to roster error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Invalid data' });
  }
};

// DELETE /api/provider/roster/:craftsmanId - remove craftworker from roster
const removeFromRoster = async (req, res) => {
  try {
    const { craftsmanId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(craftsmanId)) {
      return res.status(400).json({ success: false, message: 'Invalid craftworker ID format' });
    }

    const provider = await CraftProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    // Find and remove from roster
    const rosterItem = provider.roster.find(
      (r) => r.craftsmanId.toString() === craftsmanId.toString()
    );
    if (!rosterItem) {
      return res.status(404).json({ success: false, message: 'Craftworker not found in roster' });
    }

    provider.roster = provider.roster.filter(
      (r) => r.craftsmanId.toString() !== craftsmanId.toString()
    );

    // Update craftworker's providerId
    const craftworker = await Craftworker.findById(craftsmanId);
    if (craftworker && craftworker.providerId?.toString() === provider._id.toString()) {
      craftworker.providerId = null;
      craftworker.isIndependent = true;
      await craftworker.save();
    }

    await provider.save();

    return res.json({ success: true, message: 'Craftworker removed from roster' });
  } catch (err) {
    console.error('Remove from roster error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Invalid data' });
  }
};

// PUT /api/provider/roster/:craftsmanId/status - update roster status (active/inactive)
const updateRosterStatus = async (req, res) => {
  try {
    const { craftsmanId } = req.params;
    const { status } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(craftsmanId)) {
      return res.status(400).json({ success: false, message: 'Invalid craftworker ID format' });
    }

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be active or inactive' });
    }

    const provider = await CraftProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    const rosterItem = provider.roster.find(
      (r) => r.craftsmanId.toString() === craftsmanId.toString()
    );
    if (!rosterItem) {
      return res.status(404).json({ success: false, message: 'Craftworker not found in roster' });
    }

    rosterItem.status = status;
    await provider.save();

    return res.json({ success: true, message: `Roster status updated to ${status}`, data: rosterItem });
  } catch (err) {
    console.error('Update roster status error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Invalid data' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getRoster,
  searchCraftworkers,
  addToRoster,
  removeFromRoster,
  updateRosterStatus,
};

