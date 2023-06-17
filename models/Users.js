import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imageUrl: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
  myPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }], // Added field for user's own blog posts
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema);
