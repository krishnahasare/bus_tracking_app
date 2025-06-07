import mongoose from 'mongoose';
import Student from './backend/models/Student.js';

const students = [
  { name: 'Shreyash Mane', studentId: '2023025089', rfidUid: '95E1AE02' },
  { name: 'Alice Smith', studentId: '2023025090', rfidUid: 'B5C6D7E8' },
  { name: 'Rahul Kumar', studentId: '2023025091', rfidUid: 'C9D0E1F2' },
  { name: 'Test Student', studentId: '2023025092', rfidUid: 'AB1B2C3D4' },
];

mongoose
  .connect("mongodb+srv://karanpatil82005:karan123@cluster1.kmees1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Connected to MongoDB.');

    // Clean previous data to avoid duplicates
    await Student.deleteMany({});
    console.log('Old students removed.');

    // Insert fresh data
    await Student.insertMany(students);
    console.log('Student data seeded successfully.');

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
