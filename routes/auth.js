import express from 'express';
import {
  login,
  register,
  getLoggedInUserId,
  getUserById,
  getClickedUserById,
  updateProfile,
  logout, // Import the logout controller
} from '../controllers/auth.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/userid', verifyToken, getLoggedInUserId);
router.get('/allinfobyuid/:userId', verifyToken, getUserById);
router.get('/user/:userId', verifyToken, getClickedUserById);
router.put('/update-profile/:userId', verifyToken, updateProfile);
router.post('/logout', verifyToken, logout); // Add the logout route

export default router;
