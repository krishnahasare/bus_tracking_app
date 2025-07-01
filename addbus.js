import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './backend/models/Buses.js';

dotenv.config(); // If using a .env file

const MONGO_URI ="mongodb+srv://karanpatil82005:karan123@cluster1.kmees1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

const sampleBuses = [
  {
    busId: 'bus_201',
    name: 'Tarabai Express',
    route: 'Tarabai Park to DY Patil College',
    driverName: 'Ramesh Patil',
    status: 'active',
  },
  {
    busId: 'bus_202',
    name: 'Rankala Shuttle',
    route: 'Rankala Lake to DY Patil College',
    driverName: 'Suresh Deshmukh',
    status: 'active',
  },
  {
    busId: 'bus_203',
    name: 'University Connector',
    route: 'Shivaji University to DY Patil College',
    driverName: 'Mahesh Jadhav',
    status: 'inactive',
  },
  {
    busId: 'bus_204',
    name: 'Kasaba Rapid',
    route: 'Kasaba Bawada to DY Patil College',
    driverName: 'Vikas Pawar',
    status: 'active',
  },
  {
    busId: 'bus_205',
    name: 'Shahupuri Runner',
    route: 'Shahupuri to DY Patil College',
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
