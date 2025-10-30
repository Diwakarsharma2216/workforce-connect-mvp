const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { verifyAccessToken, verifyRefreshToken } = require('../utils/jwt.utils');

// Verify JWT access token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Add user info to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.message === 'Invalid access token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Verify refresh token
const authenticateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Add user info to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.message === 'Invalid refresh token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    console.error('Refresh token middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Refresh token error'
    });
  }
};

module.exports = {
  authenticateToken,
  authenticateRefreshToken
};
