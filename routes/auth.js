import express from 'express';
import {
  login,
  register,
  getLoggedInUserId,
  getUserById,
  getClickedUserById,
  updateProfile, // Import the updateProfile controller
} from '../controllers/auth.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/userid', verifyToken, getLoggedInUserId);
router.get('/allinfobyuid/:userId', verifyToken, getUserById);
router.get('/user/:userId', verifyToken, getClickedUserById);
router.put('/update-profile/:userId', verifyToken, updateProfile); // Add the update-profile route with userId parameter and the updateProfile controller

export default router;
