import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  // your schema here
  name: String,
  rfidUid: String,
  studentId: String,
  // ...
});

const Student = mongoose.model('Student', studentSchema);

export default Student;  // <--- Make sure you have this default export
