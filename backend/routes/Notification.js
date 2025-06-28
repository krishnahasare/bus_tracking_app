import express from 'express';
import Notification from '../models/Notifcation.js';

const router = express.Router();

/**
 * @route   GET /alerts
 * @desc    Fetch all notifications/alerts
 * @access  Public (or add auth if needed)
 */
router.get('/', async (req, res) => {
  try {
    const alerts = await Notification.find().sort({ timestamp: -1 }); // Latest first
    res.json(alerts);
  } catch (err) {
    console.error('❌ Error fetching alerts:', err.message);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

export default router;
