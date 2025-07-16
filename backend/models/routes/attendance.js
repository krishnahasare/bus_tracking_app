import express from 'express';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

const router = express.Router();

/**
 * POST /api/attendance/log
 * Logs attendance for a student using RFID UID
 * Request body: { rfidUid, status }
 */
router.post('/log', async (req, res) => {
  try {
    const { rfidUid, status } = req.body;

    if (!rfidUid || !status) {
      return res.status(400).json({ message: 'rfidUid and status are required' });
    }

    const student = await Student.findOne({ rfidUid });
    if (!student) {
      return res.status(404).json({ message: 'Student not found for given RFID UID' });
    }

    const attendance = new Attendance({
      studentId: student._id,
      status,
      timestamp: new Date(),
    });

    await attendance.save();

    res.status(201).json({ message: 'Attendance logged successfully', attendance });
  } catch (error) {
    console.error('Error logging attendance:', error);
    res.status(500).json({ message: 'Server error logging attendance' });
  }
});

/**
 * GET /api/attendance/logs
 * Returns all attendance logs with student details (for admin view)
 */
router.get('/logs', async (req, res) => {
  try {
    const logs = await Attendance.find()
      .populate('studentId')
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching attendance logs:', error);
    res.status(500).json({ message: 'Server error fetching logs' });
  }
});

/**
 * GET /api/attendance/student/:rfidUid
 * Returns attendance logs of a specific student using RFID UID
 */
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

/**
 * DELETE /api/attendance/clear
 * Deletes all attendance logs (admin only)
 */
router.delete('/clear', async (req, res) => {
  try {
    await Attendance.deleteMany({});
    res.json({ message: 'All attendance logs cleared' });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({ message: 'Failed to clear attendance logs' });
  }
});

export default router;
