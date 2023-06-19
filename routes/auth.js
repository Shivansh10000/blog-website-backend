import express from 'express';
import { login, register, getLoggedInUserId, getUserById } from '../controllers/auth.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/userid', verifyToken, getLoggedInUserId);
router.get('/allinfobyuid/:userId', verifyToken, getUserById); // Add the /allinfobyuid route with userId parameter

export default router;
