// models/Student.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate student IDs
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  rfidUid: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate RFID cards
    trim: true
  }
});

export default mongoose.models.Student || mongoose.model('Student', studentSchema);
