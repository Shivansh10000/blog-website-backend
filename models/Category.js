import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }, // Added field for image link
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }], // Reference to Blog model
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Category', CategorySchema);
