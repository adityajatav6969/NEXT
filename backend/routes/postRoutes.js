import express from 'express';
import { getPosts, createPost, toggleLike, addComment, uploadImage, uploadMiddleware } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/upload-image')
  .post(protect, uploadMiddleware, uploadImage);

router.route('/')
  .get(protect, getPosts)
  .post(protect, createPost);

router.route('/:id/like')
  .put(protect, toggleLike);

router.route('/:id/comment')
  .post(protect, addComment);

export default router;
