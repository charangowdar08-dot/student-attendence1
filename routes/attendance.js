const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Mark attendance for a student
router.post('/', async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({ 
      studentId, 
      date: new Date(date).setHours(0, 0, 0, 0) 
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.remarks = remarks;
      const updatedAttendance = await existingAttendance.save();
      return res.json(updatedAttendance);
    }

    // Create new attendance record
    const attendance = new Attendance({
      studentId,
      date: new Date(date).setHours(0, 0, 0, 0),
      status,
      remarks
    });

    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get attendance for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const targetDate = new Date(req.params.date).setHours(0, 0, 0, 0);
    const attendanceRecords = await Attendance.find({ date: targetDate })
      .populate('studentId', 'name rollNumber class');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ studentId: req.params.studentId })
      .sort({ date: -1 });
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate monthly attendance report
router.get('/report/:year/:month', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month) - 1; // JavaScript months are 0-indexed
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const students = await Student.find().sort({ rollNumber: 1 });
    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const report = students.map(student => {
      const studentAttendance = attendanceRecords.filter(
        record => record.studentId.toString() === student._id.toString()
      );

      const presentCount = studentAttendance.filter(a => a.status === 'present').length;
      const absentCount = studentAttendance.filter(a => a.status === 'absent').length;
      const totalDays = studentAttendance.length;
      const attendancePercentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(2) : 0;

      return {
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        class: student.class,
        presentCount,
        absentCount,
        totalDays,
        attendancePercentage
      };
    });

    res.json({
      year,
      month: month + 1,
      monthName: new Date(year, month).toLocaleString('default', { month: 'long' }),
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all attendance records (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const attendanceRecords = await Attendance.find()
      .populate('studentId', 'name rollNumber class')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Attendance.countDocuments();

    res.json({
      records: attendanceRecords,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
