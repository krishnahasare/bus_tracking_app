// seedNotifications.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './backend/models/Notifcation.js'; // Adjust the path as necessary

dotenv.config();

const MONGO_URI ="mongodb+srv://karanpatil82005:karan123@cluster1.kmees1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1" // Or paste your MongoDB URI here directly

const sampleNotifications = [
  {
    busId: 'bus_101',
    type: 'SpeedViolation',
    message: 'Bus 101 is overspeeding near Kolhapur Bypass',
    location: { latitude: 16.705, longitude: 74.243 },
    audience: ['admin'],
    severity: 'danger',
  },
  {
    busId: 'bus_102',
    type: 'Delay',
    message: 'Bus 102 is delayed by 10 minutes',
    location: { latitude: 16.701, longitude: 74.247 },
    audience: ['admin', 'parent'],
    severity: 'warning',
  },
  {
    busId: 'bus_103',
    type: 'GeoFence',
    message: 'Bus 103 has entered school zone',
    location: { latitude: 16.708, longitude: 74.240 },
    audience: ['admin', 'parent', 'student'],
    severity: 'info',
  },
  {
    busId: 'bus_104',
    type: 'Emergency',
    message: 'SOS triggered by driver on Bus 104',
    location: { latitude: 16.700, longitude: 74.239 },
    audience: ['admin'],
    severity: 'danger',
  },
  {
    busId: 'bus_105',
    type: 'Idle',
    message: 'Bus 105 has been idle for 15 minutes',
    location: { latitude: 16.709, longitude: 74.245 },
    audience: ['admin'],
    severity: 'warning',
  },
];

const seedNotifications = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Notification.deleteMany();
    console.log('🗑️ Existing notifications cleared');

    await Notification.insertMany(sampleNotifications);
    console.log('🔔 Sample notifications inserted!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error inserting sample notifications:', err);
    process.exit(1);
  }
};

seedNotifications();
