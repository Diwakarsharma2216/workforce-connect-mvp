const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireCompany } = require('../middleware/role.middleware');
const { getProfile, updateProfile } = require('../controllers/company.controller');
const { createJob, listJobs, getJob, updateJob, deleteJob, listApplicants, updateApplicationStatus } = require('../controllers/job.controller');

const router = express.Router();

// Company profile
router.get('/profile', authenticateToken, requireCompany, getProfile);
router.put('/profile', authenticateToken, requireCompany, updateProfile);

// Company job CRUD
router.post('/jobs', authenticateToken, requireCompany, createJob);
router.get('/jobs', authenticateToken, requireCompany, listJobs);
router.get('/jobs/:id', authenticateToken, requireCompany, getJob);
router.put('/jobs/:id', authenticateToken, requireCompany, updateJob);
router.delete('/jobs/:id', authenticateToken, requireCompany, deleteJob);
router.get('/jobs/:id/applicants', authenticateToken, requireCompany, listApplicants);
router.put('/applications/:id/status', authenticateToken, requireCompany, updateApplicationStatus);

module.exports = router;
