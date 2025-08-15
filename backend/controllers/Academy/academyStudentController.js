import AcademyStudent from "../../models/Academy/academyStudentModel.js";
import asyncHandler from "express-async-handler";

// @desc    Add a new student
// @route   POST /api/academy/students
// @access  Private
export const addStudent = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    email,
    phone,
    guardianName,
    guardianPhone,
    address,
    preferredSport,
    experienceLevel,
    preferredTimeSlot,
    availableDays,
    medicalConditions,
    emergencyContact,
    selectedBatch,
  } = req.body;

  if (!firstName || !email || !phone) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const academyOwnerId = req.user.id;

  const student = new AcademyStudent({
    firstName,
    lastName,
    dateOfBirth,
    gender,
    email,
    phone,
    guardianName,
    guardianPhone,
    address,
    preferredSport,
    experienceLevel,
    preferredTimeSlot,
    availableDays,
    medicalConditions,
    emergencyContact,
    selectedBatch,
    academyOwner: academyOwnerId,
  });

  const createdStudent = await student.save();
  res.status(201).json(createdStudent);
});

// @desc    Get all students created by the logged-in academy owner
// @route   GET /api/academy/students
// @access  Private
export const getAllStudentsByOwner = asyncHandler(async (req, res) => {
  const academyOwnerId = req.user.id;
  const students = await AcademyStudent.find({ academyOwner: academyOwnerId });
  res.status(200).json(students);
});

// @desc    Delete a student
// @route   DELETE /api/academy/students/:id
// @access  Private
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await AcademyStudent.findOne({
    _id: req.params.id,
    academyOwner: req.user.id,
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  await student.remove();
  res.json({ message: "Student removed successfully" });
});
