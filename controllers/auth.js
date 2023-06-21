import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const { username, email, password, imageUrl } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      imageUrl,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: 'User does not exist.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET LOGGED-IN USER ID */
export const getLoggedInUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    res.status(200).json({ userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from request parameters
    const user = await User.findById(userId).populate('savedBlogs'); // Fetch user by userId and populate savedBlogs field

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user information
    const { imageUrl, username, email, friends, savedBlogs, myPosts, createdAt } = user;
    res.status(200).json({
      imageUrl,
      username,
      email,
      friends,
      savedBlogs,
      myPosts,
      createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add this controller to fetch user information by ID
export const getClickedUserById = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from request parameters
    const user = await User.findById(userId).populate('savedBlogs'); // Fetch user by userId and populate savedBlogs field

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user information
    const { imageUrl, username, email, friends, savedBlogs, myPosts, createdAt } = user;
    res.status(200).json({
      imageUrl,
      username,
      email,
      friends,
      savedBlogs,
      myPosts,
      createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, password, imageUrl } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's profile fields
    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    if (imageUrl) {
      user.imageUrl = imageUrl;
    }

    if (password) {
      // Hash the new password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Other imports...

export const logout = async (req, res) => {
  try {
    // Clear the user token by setting it to an empty string or null
    req.user.token = '';
    await req.user.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Other controllers...
