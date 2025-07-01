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


router.post('/', async (req, res) => {
  try {
    const { busId, type, message, latitude, longitude, severity } = req.body;

    const newNotification = new Notification({
      busId,
      type,
      message,
      location: {
        latitude,
        longitude
      },
      severity,
      audience: ['admin'], // you can add more like parent/student based on type
    });

    await newNotification.save();
    res.status(201).json({ success: true, message: 'Notification saved' });
  } catch (err) {
    console.error('❌ Error saving notification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
