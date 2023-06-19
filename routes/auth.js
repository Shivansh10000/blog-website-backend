import express from 'express';
import { login, register, getLoggedInUserId } from '../controllers/auth.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/userid', verifyToken, getLoggedInUserId); // Apply the verifyToken middleware to the /userid route

export default router;
