const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireProvider } = require('../middleware/role.middleware');
const { getProfile, updateProfile, getRoster, searchCraftworkers, addToRoster, removeFromRoster, updateRosterStatus } = require('../controllers/provider.controller');
const { listPublicJobs, getPublicJob } = require('../controllers/job.controller');
const { createApplication, listApplications } = require('../controllers/providerApplication.controller');

const router = express.Router();

// Provider profile
router.get('/profile', authenticateToken, requireProvider, getProfile);
router.put('/profile', authenticateToken, requireProvider, updateProfile);

// Provider roster management
router.get('/roster', authenticateToken, requireProvider, getRoster);
router.get('/craftworkers/search', authenticateToken, requireProvider, searchCraftworkers);
router.post('/roster', authenticateToken, requireProvider, addToRoster);
router.delete('/roster/:craftsmanId', authenticateToken, requireProvider, removeFromRoster);
router.put('/roster/:craftsmanId/status', authenticateToken, requireProvider, updateRosterStatus);

// Browse jobs (for providers to find jobs for their craftworkers)
router.get('/jobs', authenticateToken, requireProvider, listPublicJobs);
router.get('/jobs/:id', authenticateToken, requireProvider, getPublicJob);

// Applications (providers can apply on behalf of craftworkers)
router.post('/applications', authenticateToken, requireProvider, createApplication);
router.get('/applications', authenticateToken, requireProvider, listApplications);

module.exports = router;

