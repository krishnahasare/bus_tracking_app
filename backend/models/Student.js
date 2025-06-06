import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  // your schema here
  name: String,
  rfidUid: String,
  studentId: String,
  // ...
});

module.exports = mongoose.model('Student', studentSchema);
