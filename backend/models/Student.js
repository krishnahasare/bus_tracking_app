import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  // your schema here
  name: String,
  rfidUid: String,
  studentId: String,
  // ...
});

export default mongoose.model('Student', studentSchema);
