import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, getCurrentUser);
router.post('/logout', logoutUser);
router.put('/password', protect, changePassword);

export default router;
