// backend/routes/Academy/studentAttendanceRoute.js
import express from "express";
import {
  saveAttendance,
  getAttendance,
  getStudentsForAttendance,
  getAttendanceStats
} from "../../controllers/Academy/studentAttendanceController.js";
import authMiddleware from "../../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, saveAttendance);
router.get("/record", authMiddleware, getAttendance);
router.get("/students", authMiddleware, getStudentsForAttendance);
router.get("/stats", authMiddleware, getAttendanceStats);

export default router;
