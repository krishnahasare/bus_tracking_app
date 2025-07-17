import express from 'express';
import Attendance from '../models/Attendance.js';
import BusLocation from '../models/busLocation.js';
import { getDistanceInKm } from '../utils/haversine.js';

const router = express.Router();

/**
 * 📊 Weekly Attendance Summary
 * Returns: [{ date, checkIn, checkOut, total }]
 */
router.get('/attendance/weekly-summary', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 30); // last 30 days

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

    const result = {};
    summary.forEach(({ _id, count }) => {
      const { day, status } = _id;
      if (!result[day]) result[day] = { date: day, checkIn: 0, checkOut: 0, total: 0 };
      if (status === 'Check In') result[day].checkIn += count;
      if (status === 'Check Out') result[day].checkOut += count;
      result[day].total += count;
    });

    const data = Object.values(result).sort((a, b) => new Date(a.date) - new Date(b.date));

    if (!data.length) {
      return res.status(200).json([]); // No data fallback
    }

    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching attendance summary:', error.message);
    res.status(500).json({ message: 'Error fetching weekly attendance summary' });
  }
});

/**
 * 📊 Weekly Distance Summary for a specific bus
 * Params: :busId
 * Returns: [{ date, distance }]
 */
router.get('/distance/weekly-summary/:busId', async (req, res) => {
  const { busId } = req.params;

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 30); // last 30 days

    const locations = await BusLocation.find({
      busId,
      timestamp: { $gte: oneWeekAgo }
    }).sort({ timestamp: 1 });

    if (locations.length < 2) return res.json([]);

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
    console.error('❌ Error fetching distance summary:', error.message);
    res.status(500).json({ message: 'Error fetching weekly distance summary' });
  }
});

export default router;
