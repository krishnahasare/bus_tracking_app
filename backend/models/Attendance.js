// models/Attendance.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['Check In', 'Check Out'], required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Attendance', attendanceSchema);
