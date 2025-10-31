const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireCraftworker } = require('../middleware/role.middleware');
const { getProfile, updateProfile } = require('../controllers/craftworker.controller');
const { createApplication, listApplications, getApplication, deleteApplication } = require('../controllers/application.controller');
const { listPublicJobs, getPublicJob } = require('../controllers/job.controller');

const router = express.Router();

// Craftworker profile
router.get('/profile', authenticateToken, requireCraftworker, getProfile);
router.put('/profile', authenticateToken, requireCraftworker, updateProfile);

// Browse jobs (public, but authenticated)
router.get('/jobs', authenticateToken, requireCraftworker, listPublicJobs);
router.get('/jobs/:id', authenticateToken, requireCraftworker, getPublicJob);

// Craftworker applications CRUD
router.post('/applications', authenticateToken, requireCraftworker, createApplication);
router.get('/applications', authenticateToken, requireCraftworker, listApplications);
router.get('/applications/:id', authenticateToken, requireCraftworker, getApplication);
router.delete('/applications/:id', authenticateToken, requireCraftworker, deleteApplication);

module.exports = router;

