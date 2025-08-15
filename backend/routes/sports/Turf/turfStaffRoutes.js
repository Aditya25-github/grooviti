import express from "express";
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../../controllers/sports/Turf/staffController.js";
import authMiddleware from "../../../middleware/auth.js";

const router = express.Router();

// Routes with auth middleware
router.get("/", authMiddleware, getAllStaff);
router.get("/:id", authMiddleware, getStaffById);
router.post("/", authMiddleware, createStaff);
router.put("/:id", authMiddleware, updateStaff);
router.delete("/:id", authMiddleware, deleteStaff);

export default router;
