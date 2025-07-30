import express from "express";
import authMiddleware from "../../../middleware/auth.js";
import {
  getSlotsByDateTurf,
  createOrUpdateSlots,
  deleteSlot,
  cancelBooking,
} from "../../../controllers/sports/Turf/slotController.js";

const router = express.Router();

router.use(authMiddleware);

// GET /api/slots?turfId=...&date=YYYY-MM-DD
router.get("/", getSlotsByDateTurf);

// POST /api/slots (for creating/updating multiple slots)
router.post("/", createOrUpdateSlots);

// DELETE /api/slots/:slotId
router.delete("/:slotId", deleteSlot);

// PATCH /api/slots/:slotId/cancel
router.patch("/:slotId/cancel", cancelBooking);

export default router;
