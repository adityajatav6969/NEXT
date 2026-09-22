import Job from '../models/Job.js';

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Private
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate('company', 'name logo location industry')
      .sort({ createdAt: -1 });
    
    // Attach hasApplied for current user
    const result = jobs.map(job => ({
      ...job.toObject(),
      hasApplied: job.applicants.some((id) => id.toString() === req.user._id.toString()),
      applicantsCount: job.applicants.length,
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json({
      ...job.toObject(),
      hasApplied: job.applicants.some((id) => id.toString() === req.user._id.toString()),
      applicantsCount: job.applicants.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply to job
// @route   POST /api/jobs/:id/apply
// @access  Private
export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (!job.isActive) {
      return res.status(400).json({ message: 'This job is no longer active.' });
    }

    const hasApplied = job.applicants.some((id) => id.toString() === req.user._id.toString());

    if (hasApplied) {
      return res.status(400).json({ message: 'You have already applied to this job.' });
    }

    job.applicants.addToSet(req.user._id);
    await job.save();

    res.json({
      success: true,
      message: 'Successfully applied to job',
      hasApplied: true,
      applicantsCount: job.applicants.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
