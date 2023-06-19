import Blogs from '../models/Blogs.js';
import Comment from '../models/Comments.js';
import User from '../models/Users.js';

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

    // Update the user's myPosts array with the new blog post's ID
    await User.findByIdAndUpdate(createdBy, { $push: { myPosts: savedBlog._id } });

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

    // Remove the post ID from the user's myPosts array
    await User.findByIdAndUpdate(userId, { $pull: { myPosts: postId } });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          createdBy: { $arrayElemAt: ["$createdBy", 0] },
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          likesCount: 1,
          createdBy: {
            _id: 1,
            username: 1, // Add the desired properties, e.g., username
            imageUrl: 1,
          },
          createdAt: 1,
          likes: 1,
          comments: 1,
          imageUrl: 1,
        },
      },
      {
        $sort: { likesCount: -1 },
      },
    ]);

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBlogsByDate = async (req, res) => {
  try {
    const blogs = await Blogs.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          createdBy: { $arrayElemAt: ["$createdBy", 0] },
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          likesCount: 1,
          createdBy: {
            _id: 1,
            username: 1, // Add the desired properties, e.g., username
            imageUrl: 1,
          },
          createdAt: 1,
          likes: 1,
          comments: 1,
          imageUrl: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // Get the user ID from req.user

    // Find the blog post by ID
    const blog = await Blogs.findById(postId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Check if the user has already liked the post
    const isLiked = blog.likes.includes(userId);
    if (isLiked) {
      // User has already liked the post, remove the like
      blog.likes.pull(userId);

      // Remove the post ID from the user's savedBlogs
      req.user.savedBlogs.pull(postId);
    } else {
      // User hasn't liked the post, add the like
      blog.likes.push(userId);

      // Add the post ID to the user's savedBlogs
      req.user.savedBlogs.push(postId);
    }

    // Save the updated blog post and user
    await blog.save();
    await req.user.save();

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Get the user ID from req.user

    // Find the blog post by ID
    const blog = await Blogs.findById(postId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Create a new comment
    const newComment = new Comment({
      content,
      userId,
    });

    // Save the comment
    const savedComment = await newComment.save();

    // Add the comment ID to the blog post's comments array
    blog.comments.push(savedComment._id);

    // Save the updated blog post
    await blog.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Blogs.findById(postId)
      .populate('createdBy', 'username')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'username',
        },
      });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the post' });
  }
};







