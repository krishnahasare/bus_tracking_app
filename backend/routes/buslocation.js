
import express from 'express';
import BusLocation from '../models/busLocation.js';
import Bus from '../models/Buses.js';

const router = express.Router();

router.get('/buslocation', async (req, res) => {
  try {
    const allLocations = await BusLocation.find().sort({ timestamp: -1 });

    const busMap = {};

    for (const loc of allLocations) {
      const busId = loc.busId;

      // Only fetch bus meta once per bus
      if (!busMap[busId]) {
  const busMeta = await Bus.findOne({ busId });
  console.log(`Found meta for ${busId}:`, busMeta); // ✅ log it

  busMap[busId] = {
    busId,
    name: busMeta?.name || 'Not Found',
    route: busMeta?.route || 'Not Found',
    driverName: busMeta?.driverName || 'Not Found',
    status: busMeta?.status || '',
    stops: busMeta?.stops || [],
    latest: {
      latitude: loc.latitude,
      longitude: loc.longitude,
      timestamp: loc.timestamp,
    },
    path: [],
  };
}


      busMap[busId].path.push({
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.timestamp,
      });
    }

    res.json(Object.values(busMap));
  } catch (error) {
    console.error('Error in GET /buslocation:', error);
    res.status(500).json({ message: 'Failed to fetch bus data' });
  }
});


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

router.post('/addbus', async (req, res) => {
  try {
    const { busId, name, route, driverName, status, stops } = req.body;

    const newBus = new Bus({
      busId,
      name,
      route,
      driverName,
      status,
      stops,
      streamurl: '', 
    });

    await newBus.save();
    res.status(201).json({ message: 'Bus added successfully' });
  } catch (err) {
    console.error('Error adding bus:', err);
    res.status(500).json({ message: 'Failed to add bus', error: err.message });
  }
});

router.get('/allbusstreams', async (req, res) => {
  try {
    const buses = await Bus.find({}, 'busId name streamUrl');
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bus stream data' });
  }
});

export default router;
