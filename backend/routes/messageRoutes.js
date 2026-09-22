import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getConversations, getMessages, sendMessage, markMessagesRead } from '../controllers/messageController.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.post('/:userId', protect, sendMessage);
router.put('/:userId/read', protect, markMessagesRead);

export default router;
