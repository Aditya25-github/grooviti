import { Slot } from "../../../models/sports/Turf/turfModel.js";
import mongoose from "mongoose";
import moment from "moment-timezone";

// --- Config ---
const SLOT_CONFIG = {
  morning: { start: 6, end: 12 },     // 6 AM - 12 PM
  afternoon: { start: 12, end: 17 },  // 12 PM - 5 PM
  evening: { start: 17, end: 22 },    // 5 PM - 10 PM
};

const TIMEZONE = "Asia/Kolkata"; // IST

// --- Book a slot ---
export const bookSlot = async (req, res) => {
  const { slotId } = req.params;
  const { customerName, source = "web" } = req.body;

  if (!mongoose.Types.ObjectId.isValid(slotId)) {
    return res.status(400).json({ success: false, message: "Invalid slotId" });
  }

  const updated = await Slot.findOneAndUpdate(
    {
      _id: slotId,
      status: "available",
      $expr: { $lt: ["$bookedTickets", "$totalTickets"] },
    },
    {
      $inc: { bookedTickets: 1 },
      $set: { status: "booked", customerName: customerName ?? null, source },
    },
    { new: true }
  );

  if (!updated) {
    return res.status(409).json({ success: false, message: "Slot no longer available" });
  }

  return res.json({ success: true, slot: updated });
};

// --- Get slots by Turf & Date (IST) ---
export const getSlotsByDateTurf = async (req, res) => {
  try {
    const { turfId, date } = req.query; // date = "YYYY-MM-DD"
    if (!turfId || !date) {
      return res.status(400).json({ message: "turfId and date required" });
    }
    if (!mongoose.Types.ObjectId.isValid(turfId)) {
      return res.status(400).json({ message: "Invalid turfId" });
    }

    // Query by date field directly (no UTC math)
    const slots = await Slot.find({ turf: turfId, date })
      .sort({ startTime: 1 })
      .lean();

    return res.json(slots);
  } catch (err) {
    console.error("getSlotsByDateTurf error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- Create or Update slots manually ---
export const createOrUpdateSlots = async (req, res) => {
  const { turfId, date, slots } = req.body;
  if (!turfId || !date || !Array.isArray(slots)) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const createdOrUpdated = [];
  for (const slotItem of slots) {
    const filter = { turf: turfId, date, startTime: slotItem.startTime };
    const update = { ...slotItem, turf: turfId, date };
    const slotDoc = await Slot.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
    createdOrUpdated.push(slotDoc);
  }

  res.status(200).json({ success: true, slots: createdOrUpdated });
};

// --- Delete slot ---
export const deleteSlot = async (req, res) => {
  const { slotId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(slotId)) {
    return res.status(400).json({ message: "Invalid slotId" });
  }

  await Slot.findByIdAndDelete(slotId);
  res.json({ success: true });
};

// --- Cancel booking ---
export const cancelBooking = async (req, res) => {
  const { slotId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(slotId)) {
    return res.status(400).json({ message: "Invalid slotId" });
  }

  const slot = await Slot.findById(slotId);
  if (!slot) return res.status(404).json({ message: "Slot not found" });

  slot.status = "available";
  slot.source = null;
  slot.customerName = null;
  slot.bookedTickets = 0;
  await slot.save();

  res.json({ success: true, slot });
};

// --- Auto-generate slots for 7 days (IST) ---
export const generateSlotsForTurf = async (req, res) => {
  try {
    const { turfId, startDate } = req.body;
    if (!turfId) return res.status(400).json({ message: "turfId required" });

    const start = startDate
      ? moment.tz(startDate, TIMEZONE).startOf("day")
      : moment.tz(TIMEZONE).startOf("day");

    const slotsToCreate = [];

    for (let d = 0; d < 7; d++) {
      const day = start.clone().add(d, "days");

      for (const [period, range] of Object.entries(SLOT_CONFIG)) {
        for (let h = range.start; h < range.end; h++) {
          const startTime = day.clone().hour(h).minute(0).second(0).toDate();
          const endTime = day.clone().hour(h + 1).minute(0).second(0).toDate();

          slotsToCreate.push({
            turf: turfId,
            date: day.format("YYYY-MM-DD"), // plain IST date
            startTime,
            endTime,
            period,
            status: "available",
            bookedTickets: 0,
            totalTickets: 1,
          });
        }
      }
    }

    const bulkOps = slotsToCreate.map(slot => ({
      updateOne: {
        filter: { turf: turfId, startTime: slot.startTime },
        update: { $setOnInsert: slot },
        upsert: true,
      },
    }));

    const result = await Slot.bulkWrite(bulkOps);

    res.json({ success: true, inserted: result.upsertedCount });
  } catch (err) {
    console.error("Error generating slots:", err);
    res.status(500).json({ success: false, message: "Error generating slots", error: err.message });
  }
};

export const getSlotById = async (req, res) => {
  try {
    const { slotId } = req.params;
    
    // Safety: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(slotId)) {
      return res.status(400).json({ success: false, message: "Invalid slot ID" });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }

    res.json({ success: true, slot }); // Consistent with your API
  } catch (err) {
    console.error("Error fetching slot:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};