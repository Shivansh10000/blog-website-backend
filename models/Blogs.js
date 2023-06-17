import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  imageUrl: { type: String }, // Added field for image link
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the blog
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Blog', BlogSchema);
