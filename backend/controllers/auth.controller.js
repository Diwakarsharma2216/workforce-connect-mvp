const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Company = require('../models/company.model');
const CraftProvider = require('../models/craftProvider.model');
const Craftworker = require('../models/craftworker.model');
const { generateTokens } = require('../utils/jwt.utils');
const { validationResult } = require('express-validator');

// Register new user
const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, role, ...roleData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      role
    });

    await user.save();

    // Create role-specific profile
    let profile = null;
    switch (role) {
      case 'company':
        profile = new Company({
          userId: user._id,
          companyName: roleData.companyName,
          industry: roleData.industry,
          location: roleData.location,
          contactPerson: roleData.contactPerson,
          phone: roleData.phone,
          description: roleData.description
        });
        break;

      case 'provider':
        profile = new CraftProvider({
          userId: user._id,
          companyName: roleData.companyName,
          location: roleData.location,
          contactPerson: roleData.contactPerson,
          phone: roleData.phone,
          description: roleData.description
        });
        break;

      case 'craftworker':
        profile = new Craftworker({
          userId: user._id,
          fullName: roleData.fullName,
          phone: roleData.phone,
          location: {
            city: roleData.city,
            state: roleData.state
          },
          skills: roleData.skills || [],
          experience: roleData.experience,
          certifications: roleData.certifications || [],
          bio: roleData.bio
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
    }

    await profile.save();

    // Generate tokens
    const tokens = generateTokens(user);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        },
        profile,
        ...tokens
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Get role-specific profile
    let profile = null;
    switch (user.role) {
      case 'company':
        profile = await Company.findOne({ userId: user._id });
        break;
      case 'provider':
        profile = await CraftProvider.findOne({ userId: user._id });
        break;
      case 'craftworker':
        profile = await Craftworker.findOne({ userId: user._id });
        break;
    }

    // Generate tokens
    const tokens = generateTokens(user);

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin
        },
        profile,
        ...tokens
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      ...tokens
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get role-specific profile
    let profile = null;
    switch (user.role) {
      case 'company':
        profile = await Company.findOne({ userId: user._id });
        break;
      case 'provider':
        profile = await CraftProvider.findOne({ userId: user._id });
        break;
      case 'craftworker':
        profile = await Craftworker.findOne({ userId: user._id });
        break;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        },
        profile
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Logout (client-side token removal)
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  getMe,
  logout
};
