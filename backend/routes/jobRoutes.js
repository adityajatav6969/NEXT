import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getJobs, getJobById, applyToJob } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', protect, getJobs);
router.get('/:id', protect, getJobById);
router.post('/:id/apply', protect, applyToJob);

export default router;
