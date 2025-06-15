import express from 'express';
import BusLocation from '../models/busLocation.js';

const router = express.Router();

// ✅ GET: Fetch locations filtered by busId or date (via query params)
router.get('/buslocation', async (req, res) => {
  try {
    const { busId, date } = req.query;
    const filter = {};

    if (busId) {
      filter.busId = busId;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.timestamp = { $gte: start, $lt: end };
    }

    const locations = await BusLocation.find(filter).sort({ timestamp: -1 });
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST: Save new bus location
router.post('/buslocation', async (req, res) => {
  try {
    const { latitude, longitude, busId } = req.body;

    if (!latitude || !longitude || !busId) {
      return res.status(400).json({ message: 'Latitude, longitude, and busId are required' });
    }

    const newLocation = new BusLocation({ latitude, longitude, busId });
    await newLocation.save();

    res.status(201).json({ message: 'Bus location saved successfully' });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ message: 'Error saving location', error });
  }
});

export default router;
