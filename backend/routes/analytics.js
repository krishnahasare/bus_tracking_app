import express from 'express';
import Attendance from '../models/Attendance.js';
import Notification from '../models/Notification.js';
import BusLocation from '../models/busLocation.js';

const router = express.Router();

// GET analytics summary
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 
    const totalAttendance = await Attendance.countDocuments({
      date: { $gte: today }
    });

    // 2. Total alerts today
    const totalAlerts = await Notification.countDocuments({
      createdAt: { $gte: today }
    });

    // 3. Active buses today
    const activeBuses = await BusLocation.distinct('busId');

    // 4. Attendance grouped by bus (aggregation)
    const attendanceByBus = await Attendance.aggregate([
      { $group: { _id: "$busId", total: { $sum: 1 } } }
    ]);

    res.json({
      date: today,
      totalAttendance,
      totalAlerts,
      activeBuses: activeBuses.length,
      attendanceByBus
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET latest location of all buses
router.get('/bus-locations', async (req, res) => {
  try {
    const latestLocations = await BusLocation.aggregate([
      {
        $sort: { timestamp: -1 } // Sort newest first
      },
      {
        $group: {
          _id: "$busId",
          lastLocation: { $first: "$location" },
          lastUpdate: { $first: "$timestamp" }
        }
      }
    ]);

    res.json(latestLocations);
  } catch (error) {
    console.error("Error fetching bus locations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
