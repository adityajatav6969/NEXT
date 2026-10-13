import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getJobs, getJobById, applyToJob, createJob } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', protect, getJobs);
router.post('/', protect, createJob);
router.get('/:id', protect, getJobById);
router.post('/:id/apply', protect, applyToJob);

export default router;
