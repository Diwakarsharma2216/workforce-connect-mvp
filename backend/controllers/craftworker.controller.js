const Craftworker = require('../models/craftworker.model');

// GET /api/craftworker/profile - get craftworker profile for logged-in user
const getProfile = async (req, res) => {
  try {
    const profile = await Craftworker.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Craftworker profile not found' });
    }
    return res.json({ success: true, data: profile });
  } catch (err) {
    console.error('Get craftworker profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch craftworker profile' });
  }
};

// PUT /api/craftworker/profile - update craftworker profile for logged-in user
const updateProfile = async (req, res) => {
  try {
    const allowed = [
      'fullName',
      'phone',
      'location',
      'skills',
      'experience',
      'certifications',
      'bio',
      'profilePicture',
    ];
    const updates = {};
    
    // Handle location object separately
    if (req.body.location) {
      if (req.body.location.city) updates['location.city'] = req.body.location.city;
      if (req.body.location.state) updates['location.state'] = req.body.location.state;
    }
    
    // Handle other allowed fields
    for (const key of allowed) {
      if (key !== 'location' && key in req.body) {
        updates[key] = req.body[key];
      }
    }

    const profile = await Craftworker.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Craftworker profile not found' });
    }

    return res.json({ success: true, message: 'Profile updated', data: profile });
  } catch (err) {
    console.error('Update craftworker profile error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Invalid data' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};

