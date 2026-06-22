import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import feedbackRoutes from './routes/FeedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedbackhub';

mongoose.connect(mongoUri)
  .then(() => console.log(`MongoDB connected to ${mongoUri.startsWith('mongodb+srv://') ? 'Atlas cluster' : 'local MongoDB'}`))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

app.listen(process.env.PORT || 5000, () => console.log(` Backend on port ${process.env.PORT || 5000}`));