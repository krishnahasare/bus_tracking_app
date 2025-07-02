import express from 'express';
import BusLocation from '../models/busLocation.js';

const router = express.Router();

// ✅ GET: Fetch latest + path for all buses
router.get('/buslocation', async (req, res) => {
  try {
    const allLocations = await BusLocation.find();

    const busMap = {};

    for (const loc of allLocations) {
      const busId = loc.busId;
      if (!busMap[busId]) {
        busMap[busId] = {
          busId,
          latest: {
            latitude: loc.latitude,
            longitude: loc.longitude,
          },
          path: [],
        };
      }

      busMap[busId].path.push({
        latitude: loc.latitude,
        longitude: loc.longitude,
      });
    }

    res.json(Object.values(busMap)); // ⬅️ All buses with latest + path
  } catch (error) {
    console.error('Error in GET /buslocation:', error);
    res.status(500).json({ message: 'Failed to fetch bus data' });
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
