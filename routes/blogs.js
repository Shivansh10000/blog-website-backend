import express from 'express';
import { createPost, updatePost, deletePost, getAllBlogs, getAllBlogsByDate, likePost, createComment } from '../controllers/blogs.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/post', verifyToken, createPost);
router.put('/posts/:postId', verifyToken, updatePost);
router.delete('/posts/:postId', verifyToken, deletePost);
router.get('/posts', getAllBlogs); // Route for getting blogs by dislikes
router.get('/posts/bydate', getAllBlogsByDate); // Route for getting blogs by date
router.post('/posts/like/:postId', verifyToken, likePost); // Route for liking a blog post
router.post('/posts/comments/:postId', verifyToken, createComment); // Route for creating a comment on a blog post

export default router;
