import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['Check In', 'Check Out'], required: true },
  timestamp: { type: Date, default: Date.now },
});

// ✅ Prevent OverwriteModelError on re-import
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
export default Attendance;
