import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  rfidUid: { type: String, unique: true },
});

export default mongoose.model('Student', studentSchema);
