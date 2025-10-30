const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, authenticateRefreshToken } = require('../middleware/auth.middleware');
const { register, login, refreshToken, getMe, logout } = require('../controllers/auth.controller');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['company', 'provider', 'craftworker'])
    .withMessage('Role must be company, provider, or craftworker'),
  // Company validation
  body('companyName')
    .if(body('role').equals('company'))
    .notEmpty()
    .withMessage('Company name is required for company role'),
  body('location')
    .if(body('role').isIn(['company', 'provider']))
    .notEmpty()
    .withMessage('Location is required for company and provider roles'),
  body('contactPerson')
    .if(body('role').isIn(['company', 'provider']))
    .notEmpty()
    .withMessage('Contact person is required for company and provider roles'),
  body('phone')
    .if(body('role').isIn(['company', 'provider', 'craftworker']))
    .notEmpty()
    .withMessage('Phone is required'),
  // Craftworker validation
  body('fullName')
    .if(body('role').equals('craftworker'))
    .notEmpty()
    .withMessage('Full name is required for craftworker role'),
  body('city')
    .if(body('role').equals('craftworker'))
    .notEmpty()
    .withMessage('City is required for craftworker role'),
  body('state')
    .if(body('role').equals('craftworker'))
    .notEmpty()
    .withMessage('State is required for craftworker role'),
  body('experience')
    .if(body('role').equals('craftworker'))
    .notEmpty()
    .withMessage('Experience is required for craftworker role')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshTokenValidation, authenticateRefreshToken, refreshToken);
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);

module.exports = router;
