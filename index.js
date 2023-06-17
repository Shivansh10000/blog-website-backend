import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import blogRouter from './routes/blogs.js'

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/blogs", blogRouter);

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@techinfo.jqsc9b9.mongodb.net/?retryWrites=true&w=majority`;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectToDatabase();

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
