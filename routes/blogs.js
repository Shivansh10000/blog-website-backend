import express from 'express';
import { createPost, updatePost, deletePost } from '../controllers/blogs.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/post', verifyToken, createPost);
router.put('/posts/:postId', verifyToken, updatePost);
router.delete('/posts/:postId', verifyToken, deletePost); // Add the delete route

export default router;
