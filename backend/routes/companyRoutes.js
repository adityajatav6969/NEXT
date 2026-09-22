import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getCompanies, getCompanyById, toggleFollowCompany } from '../controllers/companyController.js';

const router = express.Router();

router.get('/', protect, getCompanies);
router.get('/:id', protect, getCompanyById);
router.post('/:id/follow', protect, toggleFollowCompany);

export default router;
