import express from 'express';
import BusLocation from '../models/busLocation.js';

const router = express.Router();

router.get('/api/buslocation', async (req, res) => {
  try {
    const locations = await BusLocation.find().sort({ createdAt: -1 }); // newest first
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// POST /api/bus-location
router.post('/searchlocation', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    const newLocation = new BusLocation({ latitude, longitude });
    await newLocation.save();

    res.status(201).json({ message: 'Bus location saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving location', error });
  }
});

export default router;
