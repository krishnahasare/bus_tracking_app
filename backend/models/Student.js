const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  rfidUid: { type: String, unique: true },
});

module.exports = mongoose.model('Student', studentSchema);
