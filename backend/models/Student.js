import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  rfidUid: String,
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
