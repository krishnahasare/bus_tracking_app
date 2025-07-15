import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './backend/models/Buses.js';

dotenv.config();

const MONGO_URI = "mongodb+srv://karanpatil82005:karan123@cluster1.kmees1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

// Sample buses with dummy stream URLs (You can replace these with actual live ones later)
const sampleBuses = [
  {
    busId: 'bus_201',
    name: 'Tarabai Express',
    route: 'Tarabai Park to DY Patil College',
    driverName: 'Ramesh Patil',
    status: 'active',
    streamUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    busId: 'bus_202',
    name: 'Rankala Shuttle',
    route: 'Rankala Lake to DY Patil College',
    driverName: 'Suresh Deshmukh',
    status: 'active',
    streamUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4'
  },
  {
    busId: 'bus_203',
    name: 'University Connector',
    route: 'Shivaji University to DY Patil College',
    driverName: 'Mahesh Jadhav',
    status: 'inactive',
    streamUrl: 'https://www.w3schools.com/html/movie.mp4'
  },
  {
    busId: 'bus_204',
    name: 'Kasaba Rapid',
    route: 'Kasaba Bawada to DY Patil College',
    driverName: 'Vikas Pawar',
    status: 'active',
    streamUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
  },
  {
    busId: 'bus_205',
    name: 'Shahupuri Runner',
    route: 'Shahupuri to DY Patil College',
    driverName: 'Arun Pawar',
    status: 'active',
    streamUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4'
  },
];

const seedBuses = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Bus.deleteMany();
    console.log('🗑️ Existing buses cleared');

    await Bus.insertMany(sampleBuses);
    console.log('🚌 Sample buses inserted successfully!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error inserting sample buses:', err);
    process.exit(1);
  }
};

seedBuses();
