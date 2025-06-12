import express from 'express';
import BusLocation from '../models/busLocation.js';

const router = express.Router();

// GET: Fetch all bus locations or filter by busId
router.get('/api/buslocation', async (req, res) => {
  try {
    const { busId } = req.query;

    const filter = busId ? { busId } : {};

    const locations = await BusLocation.find(filter).sort({ timestamp: -1 }); // newest first
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Save new bus location
router.post('/api/buslocation', async (req, res) => {
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
