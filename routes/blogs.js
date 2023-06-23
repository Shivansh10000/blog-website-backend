import express from 'express';
import { createPost, updatePost, deletePost, getAllBlogs, getAllBlogsByDate, likePost, createComment, getPostById} from '../controllers/blogs.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/post', verifyToken, createPost);
router.put('/posts/:postId', verifyToken, updatePost);
router.delete('/posts/:postId', verifyToken, deletePost);
router.get('/posts', getAllBlogs);
router.get('/posts/bydate', getAllBlogsByDate);
router.post('/posts/like/:postId', verifyToken, likePost);
router.post('/posts/comments/:postId', verifyToken, createComment);
router.get('/post/:postId', getPostById);

export default router;
