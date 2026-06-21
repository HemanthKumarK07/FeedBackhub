import express from 'express';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();
router.use(protect, admin);

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false });
  if (user._id.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: 'Cannot change own role' });
  user.role = role;
  await user.save();
  res.json({ success: true, data: { id: user._id, name: user.name, role } });
});

router.delete('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false });
  if (user._id.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: 'Cannot delete self' });
  await Feedback.deleteMany({ user: user._id });
  await user.deleteOne();
  res.json({ success: true, message: 'User and feedbacks deleted' });
});

router.get('/feedbacks', async (req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.json({ success: true, data: feedbacks });
});

router.delete('/feedbacks/:id', async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

router.get('/stats', async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalFeedbacks = await Feedback.countDocuments();
  const avgRating = await Feedback.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]);
  const ratingDistribution = await Feedback.aggregate([{ $group: { _id: '$rating', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
  res.json({ success: true, data: { totalUsers, totalFeedbacks, averageRating: avgRating[0]?.avg || 0, ratingDistribution } });
});

export default router;