// backend/controllers/Academy/studentAttendanceController.js
import asyncHandler from "express-async-handler";
import AttendanceRecord from "../../models/Academy/academyStudentAttendance.js";
import AcademyStudent from "../../models/Academy/academyStudentModel.js";

// @desc    Save attendance
// @route   POST /api/attendance
// @access  Private
export const saveAttendance = asyncHandler(async (req, res) => {
  const { date, batch, coach, students } = req.body;

  if (!date || !batch || !coach || !students || !Array.isArray(students)) {
    res.status(400);
    throw new Error("Missing or invalid fields.");
  }

  const academyOwner = req.user.id || req.user._id;

  const formattedStudents = students.map((s) => ({
    student: s.studentId,
    isPresent: s.isPresent,
  }));

  const existing = await AttendanceRecord.findOne({
    date: new Date(date),
    batch,
    academyOwner
  });

  if (existing) {
    existing.students = formattedStudents;
    existing.coach = coach;
    const updated = await existing.save();
    return res.status(200).json(updated);
  }

  const attendance = new AttendanceRecord({
    date: new Date(date),
    batch,
    coach,
    students: formattedStudents,
    academyOwner,
  });

  const saved = await attendance.save();
  res.status(201).json(saved);
});

// @desc    Get students for attendance (with existing attendance if available)
// @route   GET /api/attendance/students
// @access  Private
// In your studentAttendanceController.js
export const getStudentsForAttendance = asyncHandler(async (req, res) => {
  const { date, batch } = req.query;
  const academyOwnerId = req.user.id || req.user._id;

  if (!date) {
    res.status(400);
    throw new Error("Date is required");
  }

  // If batch is provided and not "All Batches", filter by specific batch
  const query = { academyOwner: academyOwnerId };
  if (batch && batch !== "All Batches") {
    query.selectedBatch = batch;
  }

  // Get all students (filtered by batch if specified)
  const students = await AcademyStudent.find(query);

  // Format response for new attendance
  const formatted = students.map((student) => ({
    studentId: student._id,
    name: `${student.firstName} ${student.lastName}`,
    avatar: student.avatar || "",
    timeSlot: student.preferredTimeSlot || "N/A",
    batch: student.selectedBatch || "N/A",
    isPresent: false, // default to absent for new records
  }));

  res.json({
    students: formatted,
    coach: null // No coach assigned yet for new records
  });
});


// @desc    Get attendance record for a given date & batch
// @route   GET /api/attendance/record
// @access  Private
export const getAttendance = asyncHandler(async (req, res) => {
  const { date, batch } = req.query;
  const academyOwner = req.user.id || req.user._id;

  if (!date || !batch) {
    res.status(400);
    throw new Error("Date and batch are required");
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    res.status(400);
    throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
  }

  const record = await AttendanceRecord.findOne({
    date: parsedDate,
    batch,
    academyOwner,
  }).populate('students.student');

  if (!record) {
    return res.status(404).json({
      message: "No attendance record found for the given date and batch."
    });
  }

  res.status(200).json(record);
});

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats
// @access  Private
export const getAttendanceStats = asyncHandler(async (req, res) => {
  const { startDate, endDate, batch } = req.query;
  const academyOwner = req.user.id || req.user._id;

  const matchQuery = { academyOwner };

  if (startDate && endDate) {
    matchQuery.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  if (batch) {
    matchQuery.batch = batch;
  }

  const stats = await AttendanceRecord.aggregate([
    { $match: matchQuery },
    { $unwind: "$students" },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalPresent: {
          $sum: { $cond: ["$students.isPresent", 1, 0] }
        },
        totalAbsent: {
          $sum: { $cond: ["$students.isPresent", 0, 1] }
        }
      }
    }
  ]);

  const result = stats[0] || {
    totalSessions: 0,
    totalPresent: 0,
    totalAbsent: 0
  };

  result.attendanceRate = result.totalSessions > 0
    ? Math.round((result.totalPresent / result.totalSessions) * 100)
    : 0;

  res.json(result);
});
