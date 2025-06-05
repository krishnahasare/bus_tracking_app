import mongoose from 'mongoose';
import Student from './backend/models/Student.js';  // <-- updated path

const MONGO_URI = 'mongodb://localhost:27017/bus-tracker';

const students = [
  { name: 'John Doe', studentId: 'S001', rfidUid: 'A1B2C3D4' },
  { name: 'Alice Smith', studentId: 'S002', rfidUid: 'B5C6D7E8' },
  { name: 'Rahul Kumar', studentId: 'S003', rfidUid: 'C9D0E1F2' },
  { name: 'Test Student', studentId: 'S004', rfidUid: 'AB1B2C3D4' },
];

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB.');
  await Student.deleteMany({});
  console.log('Old students removed.');
  await Student.insertMany(students);
  console.log('Student data seeded successfully.');
  mongoose.disconnect();
})
.catch(err => {
  console.error('Database connection error:', err);
});
