import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './backend/models/Buses.js';

dotenv.config(); // If using a .env file

const MONGO_URI ="mongodb+srv://karanpatil82005:karan123@cluster1.kmees1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

const sampleBuses = [
  {
    busId: 'bus_101',
    name: 'Pune Express',
    route: 'Pune to Mumbai',
    driverName: 'Ramesh Patil',
    status: 'active',
  },
  {
    busId: 'bus_102',
    name: 'Nagpur Shuttle',
    route: 'Nagpur to Amravati',
    driverName: 'Suresh Deshmukh',
    status: 'active',
  },
  {
    busId: 'bus_103',
    name: 'Nashik Connect',
    route: 'Nashik to Ahmednagar',
    driverName: 'Mahesh Jadhav',
    status: 'inactive',
  },
  {
    busId: 'bus_104',
    name: 'Aurangabad Rapid',
    route: 'Aurangabad to Pune',
    driverName: 'Vikas Pawar',
    status: 'active',
  },
   {
    busId: 'bus_105',
    name: 'Kolhapur Rapid',
    route: 'Kolhapur to Pune',
    driverName: 'Arun Pawar',
    status: 'active',
  },
];

const seedBuses = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing buses (optional)
    await Bus.deleteMany();
    console.log('🗑️ Existing buses cleared');

    // Insert sample buses
    await Bus.insertMany(sampleBuses);
    console.log('🚌 Sample buses inserted successfully!');

    process.exit(0); // Exit success
  } catch (err) {
    console.error('❌ Error inserting sample buses:', err);
    process.exit(1); // Exit with error
  }
};

seedBuses();
