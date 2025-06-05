import express from 'express';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

const router = express.Router();

// Route to log attendance (check-in/check-out)
router.post('/log', async (req, res) => {
  try {
    const { rfidUid, status } = req.body; // status: "Check In" or "Check Out"
    if (!rfidUid || !status) {
      return res.status(400).json({ message: 'rfidUid and status are required' });
    }

    // Find student by RFID UID
    const student = await Student.findOne({ rfidUid });
    if (!student) {
      return res.status(404).json({ message: 'Student not found for given RFID UID' });
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
    // Get all logs, newest first, with student details populated
    const logs = await Attendance.find()
  .populate('studentId') // This populates the full student document instead of just ID
  .sort({ timestamp: -1 });


    res.json(logs);
  } catch (error) {
    console.error('Error fetching attendance logs:', error);
    res.status(500).json({ message: 'Server error fetching attendance logs' });
  }
});

// Route to get attendance logs by RFID UID (for individual student)
router.get('/student/:rfidUid', async (req, res) => {
  try {
    const { rfidUid } = req.params;

    // Find student by RFID UID
    const student = await Student.findOne({ rfidUid });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find all attendance logs for this student
    const logs = await Attendance.find({ studentId: student._id }).sort({ timestamp: -1 });

    res.json({ student, logs });
  } catch (error) {
    console.error('Error fetching student attendance logs:', error);
    res.status(500).json({ message: 'Server error fetching student attendance logs' });
  }
});

// TEMPORARY: Clear all attendance logs
router.delete('/clear', async (req, res) => {
  try {
    await Attendance.deleteMany({});
    res.json({ message: 'All attendance logs cleared' });
  } catch (error) {
    console.error('Error clearing attendance logs:', error);
    res.status(500).json({ message: 'Failed to clear logs' });
  }
});

export default router;
