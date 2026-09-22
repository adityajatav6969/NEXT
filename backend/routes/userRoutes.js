import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getUserProfile, 
  updateUserProfile, 
  toggleFollow, 
  getNetwork, 
  getExploreUsers 
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile/:id', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/:id/follow', protect, toggleFollow);
router.get('/network', protect, getNetwork);
router.get('/explore', protect, getExploreUsers);


export default router;
