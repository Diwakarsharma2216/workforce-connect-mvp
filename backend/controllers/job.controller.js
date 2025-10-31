const Job = require('../models/job.model');
const Company = require('../models/company.model');
const Application = require('../models/application.model');
const Craftworker = require('../models/craftworker.model');

// Ensure the current user has a company profile and return its _id
async function getCompanyIdForUser(userId) {
  const company = await Company.findOne({ userId });
  return company ? company._id : null;
}

// POST /api/company/jobs - create job
const createJob = async (req, res) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);
    if (!companyId) return res.status(404).json({ success: false, message: 'Company profile not found' });

    const payload = {
      companyId,
      title: req.body.title,
      description: req.body.description,
      skillsRequired: req.body.skillsRequired || [],
      location: req.body.location,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      numberOfPositions: req.body.numberOfPositions,
      certificationsRequired: req.body.certificationsRequired || [],
      status: req.body.status || 'open',
      documentsRequired: req.body.documentsRequired || [],
    };

    const job = await Job.create(payload);
    return res.status(201).json({ success: true, message: 'Job created', data: job });
  } catch (err) {
    console.error('Create job error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Invalid data' });
  }
};

// GET /api/company/jobs - list my company jobs
const listJobs = async (req, res) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);
    if (!companyId) return res.status(404).json({ success: false, message: 'Company profile not found' });

    const { status } = req.query;
    const filter = { companyId };
    if (status) filter.status = status;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, data: jobs });
  } catch (err) {
    console.error('List jobs error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
};

// GET /api/company/jobs/:id - get single job (owned by company)
const getJob = async (req, res) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);
    if (!companyId) return res.status(404).json({ success: false, message: 'Company profile not found' });

    const job = await Job.findOne({ _id: req.params.id, companyId });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    return res.json({ success: true, data: job });
  } catch (err) {
    console.error('Get job error:', err);
    return res.status(400).json({ success: false, message: 'Invalid job id' });
  }
};

// PUT /api/company/jobs/:id - update job
const updateJob = async (req, res) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);
    if (!companyId) return res.status(404).json({ success: false, message: 'Company profile not found' });

    const allowed = ['title','description','skillsRequired','location','startDate','endDate','numberOfPositions','certificationsRequired','status','documentsRequired'];
    const updates = {};
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, companyId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    return res.json({ success: true, message: 'Job updated', data: job });
  } catch (err) {
    console.error('Update job error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Invalid data' });
  }
};

// DELETE /api/company/jobs/:id - delete job
const deleteJob = async (req, res) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);
    if (!companyId) return res.status(404).json({ success: false, message: 'Company profile not found' });

    const result = await Job.findOneAndDelete({ _id: req.params.id, companyId });
    if (!result) return res.status(404).json({ success: false, message: 'Job not found' });

    return res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    console.error('Delete job error:', err);
    return res.status(400).json({ success: false, message: 'Invalid job id' });
  }
};

// GET /api/company/jobs/:id/applicants
const listApplicants = async (req, res) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);
    if (!companyId) return res.status(404).json({ success: false, message: 'Company profile not found' });

    // Ensure job belongs to this company
    const job = await Job.findOne({ _id: req.params.id, companyId });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const apps = await Application.find({ jobId: job._id })
      .populate('craftworkerId', 'fullName skills experience certifications location providerId')
      .populate('providerId', 'companyName');
    return res.json({ success: true, data: apps });
  } catch (err) {
    console.error('List applicants error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch applicants' });
  }
};

// PUT /api/company/applications/:id/status (body: status, notes?)
const updateApplicationStatus = async (req, res) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);
    if (!companyId) return res.status(404).json({ success: false, message: 'Company profile not found' });

    const { id } = req.params;
    const { status, notes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    // Find application and make sure it belongs to their job
    const app = await Application.findById(id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

    // Confirm job belongs to this company
    const job = await Job.findOne({ _id: app.jobId, companyId });
    if (!job) return res.status(403).json({ success: false, message: 'Not authorized for this job/application' });

    app.status = status;
    app.reviewedAt = new Date();
    app.reviewedBy = companyId;
    if (notes) app.notes = notes;
    await app.save();
    return res.json({ success: true, message: `Application ${status}`, data: app });
  } catch (err) {
    console.error('Update application status error:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/jobs/public - list all open jobs (public endpoint for craftworkers)
const listPublicJobs = async (req, res) => {
  try {
    const { location, skills, status } = req.query;
    const filter = { status: status || 'open' }; // Only show open jobs by default

    // Optional filters
    if (location) {
      filter.location = new RegExp(location, 'i'); // Case-insensitive search
    }
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      filter.skillsRequired = { $in: skillsArray };
    }

    const jobs = await Job.find(filter)
      .populate('companyId', 'companyName industry location contactPerson')
      .sort({ createdAt: -1 })
      .limit(100); // Limit to prevent overload

    return res.json({ success: true, data: jobs });
  } catch (err) {
    console.error('List public jobs error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
};

// GET /api/jobs/:id/public - get single job (public endpoint for craftworkers)
const getPublicJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'companyName industry location contactPerson phone description');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    return res.json({ success: true, data: job });
  } catch (err) {
    console.error('Get public job error:', err);
    return res.status(400).json({ success: false, message: 'Invalid job id' });
  }
};

module.exports = {
  createJob,
  listJobs,
  getJob,
  updateJob,
  deleteJob,
  listApplicants,
  updateApplicationStatus,
  listPublicJobs,
  getPublicJob
};
