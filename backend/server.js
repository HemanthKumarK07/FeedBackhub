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

const atlasUsername = process.env.MONGODB_USERNAME;
const atlasPassword = process.env.MONGODB_PASSWORD;
const atlasUri = process.env.MONGODB_URI;
const mongoUri = atlasUri || (atlasUsername && atlasPassword
  ? `mongodb+srv://${encodeURIComponent(atlasUsername)}:${encodeURIComponent(atlasPassword)}@feedbackhub.lfxyqjh.mongodb.net/feedbackhub?retryWrites=true&w=majority`
  : 'mongodb://127.0.0.1:27017/feedbackhub');

mongoose.connect(mongoUri, {
  autoIndex: true,
  serverSelectionTimeoutMS: 10000,
})
  .then(() => console.log(`MongoDB connected to ${mongoUri.startsWith('mongodb+srv://') ? 'Atlas cluster' : 'local MongoDB'}`))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    if (mongoUri.startsWith('mongodb+srv://')) {
      console.error('Check that your MONGODB_URI is a valid Atlas connection string and that DNS lookup is available.');
      console.error('Example format: mongodb+srv://<user>:<pass>@cluster0.abcde.mongodb.net/<dbname>?retryWrites=true&w=majority');
    }
    process.exit(1);
  });

app.listen(process.env.PORT || 5000, () => console.log(` Backend on port ${process.env.PORT || 5000}`));