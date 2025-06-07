// routes/attendance.js
import express from 'express';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

const router = express.Router();

// Route to log attendance (Check In / Check Out)
router.post('/log', async (req, res) => {
  try {
    const { uid, student_id, name, status } = req.body;

    // Validate required fields
    if (!uid || !student_id || !name || !status) {
      return res.status(400).json({ message: 'uid, student_id, name, and status are required' });
    }

    // Find student by RFID UID
    let student = await Student.findOne({ rfidUid: uid.trim() });

    // If not found, create student record
    if (!student) {
      student = new Student({
        studentId: student_id.trim(),
        name: name.trim(),
        rfidUid: uid.trim(),
      });
      await student.save();
    }

    // Create attendance log
    const attendance = new Attendance({
      studentId: student._id,
      status,
      timestamp: new Date(),
    });

    await attendance.save();

    res.json({ message: 'Attendance logged successfully', attendance });
  } catch (error) {
    console.error('Error logging attendance:', error);
    res.status(500).json({ message: 'Server error logging attendance' });
  }
});

// Route to get all attendance logs for admin dashboard
router.get('/logs', async (req, res) => {
  try {
    const logs = await Attendance.find()
      .populate('studentId') // This populates full student details
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching attendance logs:', error);
    res.status(500).json({ message: 'Server error fetching attendance logs' });
  }
});

// Route to get attendance logs by RFID UID
router.get('/student/:rfidUid', async (req, res) => {
  try {
    const { rfidUid } = req.params;

    const student = await Student.findOne({ rfidUid });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const logs = await Attendance.find({ studentId: student._id }).sort({ timestamp: -1 });

    res.json({ student, logs });
  } catch (error) {
    console.error('Error fetching student logs:', error);
    res.status(500).json({ message: 'Server error fetching student logs' });
  }
});

// TEMP: Route to clear all attendance logs
router.delete('/clear', async (req, res) => {
  try {
    await Attendance.deleteMany({});
    res.json({ message: 'All attendance logs cleared' });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({ message: 'Failed to clear logs' });
  }
});

export default router;
