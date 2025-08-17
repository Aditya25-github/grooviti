import express from "express";
import authMiddleware from "../../../middleware/auth.js";
import {
  getSlotsByDateTurf,
  createOrUpdateSlots,
  deleteSlot,
  cancelBooking,
  bookSlot,
  generateSlotsForTurf,
  getSlotById,
} from "../../../controllers/sports/Turf/slotController.js";

const router = express.Router();

// ✅ Protect routes if needed
// router.use(authMiddleware);

// ✅ Get all slots for a turf on a given date
// Example: GET /api/slots/by-date?turfId=...&date=2025-08-17
router.get("/by-date", getSlotsByDateTurf);

// ✅ Generate slots for next 7 days (hourly IST slots for morning/afternoon/evening)
router.post("/generate-slots", generateSlotsForTurf);

// ✅ Create or Update custom slots (manual override)
router.post("/upsert", createOrUpdateSlots);

router.get("/:slotId", getSlotById);

// ✅ Book a slot
router.post("/:slotId/book", bookSlot);



// ✅ Cancel booking
router.patch("/:slotId/cancel", cancelBooking);

// ✅ Delete slot completely
router.delete("/:slotId", deleteSlot);

export default router;
