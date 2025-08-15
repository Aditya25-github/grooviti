import express from "express";
import {
  addStudent,
  getAllStudentsByOwner,
  deleteStudent,
} from "../../controllers/Academy/academyStudentController.js";
import authMiddleware from "../../middleware/auth.js";

const router = express.Router();

// POST /api/academy/students
router.post("/", authMiddleware, addStudent);

// GET /api/academy/students
router.get("/", authMiddleware, getAllStudentsByOwner);

// DELETE /api/academy/students/:id
router.delete("/:id", authMiddleware, deleteStudent);

export default router;
