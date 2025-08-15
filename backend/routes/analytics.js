// routes/analytics.js
import express from 'express';
import Bus from '../models/busLocation.js';
import Attendance from '../models/Attendance.js';

const router = express.Router();

/**
 * GET /api/analytics/bus-locations
 * Returns last known location of all buses
 */
router.get('/bus-locations', async (req, res) => {
  try {
    const buses = await Bus.find({}, { _id: 1, lastLocation: 1, busNumber: 1 });
    res.json(buses);
  } catch (err) {
    console.error('Error fetching bus locations:', err);
    res.status(500).json({ error: 'Error fetching bus locations' });
  }
});

/**
 * GET /api/analytics/attendance
 * Returns attendance stats (present vs absent) grouped by date
 */
router.get('/attendance', async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      {
        $group: {
          _id: "$date",
          presentCount: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] }
          },
          absentCount: {
            $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(stats);
  } catch (err) {
    console.error('Error fetching attendance stats:', err);
    res.status(500).json({ error: 'Error fetching attendance stats' });
  }
});

export default router;
