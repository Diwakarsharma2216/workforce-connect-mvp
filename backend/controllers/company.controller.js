const Company = require('../models/company.model');

// GET /api/company/profile - get company profile for logged-in user
const getProfile = async (req, res) => {
  try {
    const profile = await Company.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }
    return res.json({ success: true, data: profile });
  } catch (err) {
    console.error('Get company profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch company profile' });
  }
};

// PUT /api/company/profile - update company profile for logged-in user
const updateProfile = async (req, res) => {
  try {
    const allowed = ['companyName', 'industry', 'location', 'contactPerson', 'phone', 'description'];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }

    const profile = await Company.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    return res.json({ success: true, message: 'Profile updated', data: profile });
  } catch (err) {
    console.error('Update company profile error:', err);
    // Handle duplicate key or validation generically
    return res.status(400).json({ success: false, message: err.message || 'Invalid data' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
