import { matchedData } from 'express-validator';
import Post from '../models/Post.js';
import ImageKit from 'imagekit';
import multer from 'multer';

let imagekitInstance = null;
const getImageKit = () => {
  if (!imagekitInstance) {
    imagekitInstance = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'missing_public_key',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'missing_private_key',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'missing_url_endpoint'
    });
  }
  return imagekitInstance;
};

// Multer memory storage (file stays in RAM, never hits disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

export const uploadMiddleware = upload.single('image');

// @desc    Upload image to ImageKit (server-side)
// @route   POST /api/posts/upload-image
// @access  Private
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const ik = getImageKit();
    const result = await ik.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: '/nextdevs_posts',
    });

    return res.json({ url: result.url, fileId: result.fileId });
  } catch (error) {
    console.error('ImageKit Upload Error:', error);
    return res.status(500).json({ message: 'Image upload failed: ' + error.message });
  }
};

// @desc    Get posts with cursor-based pagination
// @route   GET /api/posts?cursor=<id>&limit=20
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const cursor = req.query.cursor;
    const currentUserId = req.user._id.toString();

    const query = cursor ? { _id: { $lt: cursor } } : {};

    const posts = await Post.find(query)
      .populate('user', 'name avatar title company')
      .populate('comments.user', 'name avatar')
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = posts.length > limit;
    const results = (hasMore ? posts.slice(0, limit) : posts).map((post) => ({
      ...post,
      isLiked: post.likes.some((id) => id.toString() === currentUserId),
    }));
    const nextCursor = hasMore ? results[results.length - 1]._id : null;

    return res.json({
      posts: results,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {


    const { content, image } = req.body; // Use req.body directly as matchedData requires validation middlewares

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post text content is required' });
    }

    const post = new Post({
      user: req.user._id,
      content,
      image: image || undefined,
    });

    const createdPost = await post.save();
    await createdPost.populate('user', 'name avatar title company');



    return res.status(201).json(createdPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {


    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const index = post.likes.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      post.likes.addToSet(req.user._id);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();



    return res.json({
      likes: post.likes,
      isLiked: index === -1,
      likesCount: post.likes.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/posts/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {


    const { text } = matchedData(req, {
      includeOptionals: true,
      onlyValidData: true,
      locations: ['body'],
    });

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      text,
    });

    await post.save();
    await post.populate('comments.user', 'name avatar');



    return res.status(201).json(post.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
