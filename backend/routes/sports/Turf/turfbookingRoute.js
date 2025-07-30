import express from "express";
import {
  createBooking,
  getAllBookings,
  getTodaysBookings,
  getBookingsByDate,
  getBookingsInRange,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../../../controllers/sports/Turf/turfbookingController.js";
import authMiddleware from "../../../middleware/auth.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", authMiddleware, getAllBookings);
router.get("/today", authMiddleware, getTodaysBookings);
router.get("/date/:date", authMiddleware, getBookingsByDate);
router.get("/range", authMiddleware, getBookingsInRange);
router.get("/:id", getBookingById);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
