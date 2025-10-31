const Application = require('../models/application.model');
const Job = require('../models/job.model');
const Craftworker = require('../models/craftworker.model');

// Ensure the current user has a craftworker profile and return its _id
async function getCraftworkerIdForUser(userId) {
  const craftworker = await Craftworker.findOne({ userId });
  return craftworker ? craftworker._id : null;
}

// POST /api/craftworker/applications - create application for a job
const createApplication = async (req, res) => {
  try {
    const craftworkerId = await getCraftworkerIdForUser(req.user.id);
    if (!craftworkerId) {
      return res.status(404).json({ success: false, message: 'Craftworker profile not found' });
    }

    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    // Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Job is not open for applications' });
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({ jobId, craftworkerId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'Application already exists for this job' });
    }

    const payload = {
      jobId,
      craftworkerId,
      submittedBy: req.body.submittedBy || 'self',
      providerId: req.body.providerId || null,
    };

    const application = await Application.create(payload);
    
    // Populate job and craftworker details for response
    await application.populate('jobId', 'title companyId');
    await application.populate('craftworkerId', 'fullName');
    
    return res.status(201).json({ success: true, message: 'Application submitted', data: application });
  } catch (err) {
    console.error('Create application error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Invalid data' });
  }
};

// GET /api/craftworker/applications - list my applications
const listApplications = async (req, res) => {
  try {
    const craftworkerId = await getCraftworkerIdForUser(req.user.id);
    if (!craftworkerId) {
      return res.status(404).json({ success: false, message: 'Craftworker profile not found' });
    }

    const { status } = req.query;
    const filter = { craftworkerId };
    if (status) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate('jobId', 'title description location startDate endDate numberOfPositions status companyId')
      .populate('jobId', null, 'Job')
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'companyName',
          model: 'Company'
        }
      })
      .sort({ appliedAt: -1 });

    return res.json({ success: true, data: applications });
  } catch (err) {
    console.error('List applications error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
};

// GET /api/craftworker/applications/:id - get single application
const getApplication = async (req, res) => {
  try {
    const craftworkerId = await getCraftworkerIdForUser(req.user.id);
    if (!craftworkerId) {
      return res.status(404).json({ success: false, message: 'Craftworker profile not found' });
    }

    const application = await Application.findOne({ _id: req.params.id, craftworkerId })
      .populate('jobId')
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'companyName industry location contactPerson phone',
          model: 'Company'
        }
      })
      .populate('craftworkerId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    return res.json({ success: true, data: application });
  } catch (err) {
    console.error('Get application error:', err);
    return res.status(400).json({ success: false, message: 'Invalid application id' });
  }
};

// DELETE /api/craftworker/applications/:id - delete/withdraw application
const deleteApplication = async (req, res) => {
  try {
    const craftworkerId = await getCraftworkerIdForUser(req.user.id);
    if (!craftworkerId) {
      return res.status(404).json({ success: false, message: 'Craftworker profile not found' });
    }

    const application = await Application.findOne({ _id: req.params.id, craftworkerId });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Only allow deletion if status is pending
    if (application.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot withdraw application that has been reviewed' 
      });
    }

    await Application.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Application withdrawn' });
  } catch (err) {
    console.error('Delete application error:', err);
    return res.status(400).json({ success: false, message: 'Invalid application id' });
  }
};

module.exports = {
  createApplication,
  listApplications,
  getApplication,
  deleteApplication,
};

