// routes/analytics.js
import express from 'express';
import Attendance from '../models/Attendance.js';
import BusLocation from '../models/busLocation.js';
import { getDistanceInKm } from '../utils/haversine.js';

const router = express.Router();

// 🟢 Weekly Attendance Summary API
router.get('/attendance/weekly-summary', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // past 7 days

    const summary = await Attendance.aggregate([
      { $match: { timestamp: { $gte: oneWeekAgo } } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format the result
    const result = {};
    summary.forEach(({ _id, count }) => {
      const { day, status } = _id;
      if (!result[day]) result[day] = { date: day, checkIn: 0, checkOut: 0 };
      if (status === 'Check In') result[day].checkIn += count;
      if (status === 'Check Out') result[day].checkOut += count;
    });

    const data = Object.values(result).sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(data);
  } catch (error) {
    console.error('Error in attendance summary:', error);
    res.status(500).json({ message: 'Error fetching weekly attendance summary' });
  }
});

// 🟢 Weekly Distance Summary API (per day)
router.get('/distance/weekly-summary/:busId', async (req, res) => {
  const { busId } = req.params;
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

    const locations = await BusLocation.find({
      busId,
      timestamp: { $gte: oneWeekAgo }
    }).sort({ timestamp: 1 });

    if (locations.length < 2) {
      return res.json([]);
    }

    const dayWiseDistance = {};
    let prev = locations[0];

    for (let i = 1; i < locations.length; i++) {
      const curr = locations[i];
      const dateKey = new Date(curr.timestamp).toISOString().slice(0, 10);

      const dist = getDistanceInKm(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
      if (!dayWiseDistance[dateKey]) dayWiseDistance[dateKey] = 0;
      if (dist > 0.01) {
        dayWiseDistance[dateKey] += dist;
        prev = curr;
      }
    }

    const result = Object.entries(dayWiseDistance).map(([date, distance]) => ({
      date,
      distance: parseFloat(distance.toFixed(2))
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(result);
  } catch (error) {
    console.error('Error in distance summary:', error);
    res.status(500).json({ message: 'Error fetching distance summary' });
  }
});

export default router;
