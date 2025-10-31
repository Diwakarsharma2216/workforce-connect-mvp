const Application = require('../models/application.model');
const Job = require('../models/job.model');
const CraftProvider = require('../models/craftProvider.model');
const Craftworker = require('../models/craftworker.model');

// Ensure the current user has a provider profile and return its _id
async function getProviderIdForUser(userId) {
  const provider = await CraftProvider.findOne({ userId });
  return provider ? provider._id : null;
}

// POST /api/provider/applications - create application for a job on behalf of a craftworker
const createApplication = async (req, res) => {
  try {
    const providerId = await getProviderIdForUser(req.user.id);
    if (!providerId) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    const { jobId, craftsmanId } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }
    if (!craftsmanId) {
      return res.status(400).json({ success: false, message: 'Craftworker ID is required' });
    }

    // Verify craftworker is in provider's roster
    const provider = await CraftProvider.findById(providerId);
    const rosterItem = provider.roster.find(
      (r) => r.craftsmanId.toString() === craftsmanId.toString() && r.status === 'active'
    );
    if (!rosterItem) {
      return res.status(403).json({ 
        success: false, 
        message: 'Craftworker must be in your active roster' 
      });
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
    const existingApplication = await Application.findOne({ jobId, craftworkerId: craftsmanId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'Application already exists for this job' });
    }

    const payload = {
      jobId,
      craftworkerId: craftsmanId,
      submittedBy: 'provider',
      providerId,
    };

    const application = await Application.create(payload);
    
    // Populate job and craftworker details for response
    await application.populate('jobId', 'title companyId');
    await application.populate('craftworkerId', 'fullName');
    
    return res.status(201).json({ success: true, message: 'Application submitted', data: application });
  } catch (err) {
    console.error('Create provider application error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Invalid data' });
  }
};

// GET /api/provider/applications - list applications submitted by this provider
const listApplications = async (req, res) => {
  try {
    const providerId = await getProviderIdForUser(req.user.id);
    if (!providerId) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    const { status } = req.query;
    const filter = { providerId };
    if (status) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate('jobId', 'title description location startDate endDate numberOfPositions status companyId')
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'companyName',
          model: 'Company'
        }
      })
      .populate('craftworkerId', 'fullName phone location skills experience certifications')
      .sort({ appliedAt: -1 });

    return res.json({ success: true, data: applications });
  } catch (err) {
    console.error('List provider applications error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
};

module.exports = {
  createApplication,
  listApplications,
};

