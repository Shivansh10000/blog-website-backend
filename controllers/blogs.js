import Blogs from '../models/Blogs.js';

export const createPost = async (req, res) => {
  try {
    const { title, content, tags, imageUrl } = req.body;
    const createdBy = req.user.id; // Get the user ID from req.user

    const existingBlog = await Blogs.findOne({ title });
    if (existingBlog) {
      return res.status(400).json({ error: 'A blog with the same title already exists' });
    }

    const newBlog = new Blogs({
      title,
      content,
      tags,
      imageUrl,
      createdBy, // Assign the createdBy field with the user ID
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, tags, imageUrl } = req.body;
    const userId = req.user.id; // Get the user ID from req.user

    // Check if the post exists and belongs to the user
    const post = await Blogs.findOne({ _id: postId, createdBy: userId });
    if (!post) {
      return res.status(404).json({ error: 'Post not found or user is not the owner' });
    }

    // Update the post
    post.title = title;
    post.content = content;
    post.tags = tags;
    post.imageUrl = imageUrl;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // Get the user ID from req.user

    // Find the post and check if it exists
    const post = await Blogs.findOne({ _id: postId, createdBy: userId });
    if (!post) {
      return res.status(404).json({ error: 'Post not found or user is not the owner' });
    }

    // Delete the post
    await Blogs.deleteOne({ _id: postId });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
