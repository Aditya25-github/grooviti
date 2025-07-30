import { Slot } from "../../../models/sports/Turf/turfModel.js";
import mongoose from "mongoose";

export const getSlotsByDateTurf = async (req, res) => {
  const { turfId, date } = req.query;
  if (!turfId || !date) return res.status(400).json({ message: "turfId and date required" });

  const dateObj = new Date(date);
  const nextDay = new Date(dateObj);
  nextDay.setDate(dateObj.getDate() + 1);

  const slots = await Slot.find({
    turf: turfId,
    date: { $gte: dateObj, $lt: nextDay },
  }).sort("startTime");

  res.json(slots);
};

export const createOrUpdateSlots = async (req, res) => {
  const { turfId, date, slots } = req.body;
  if (!turfId || !date || !Array.isArray(slots)) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const createdOrUpdated = [];
  for (const slotItem of slots) {
    const filter = {
      turf: turfId,
      date: new Date(date),
      startTime: slotItem.startTime,
    };
    const update = {
      ...slotItem,
      turf: turfId,
      date: new Date(date),
    };
    const slotDoc = await Slot.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
    createdOrUpdated.push(slotDoc);
  }

  res.status(200).json({ success: true, slots: createdOrUpdated });
};

export const deleteSlot = async (req, res) => {
  const { slotId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(slotId)) {
    return res.status(400).json({ message: "Invalid slotId" });
  }

  await Slot.findByIdAndDelete(slotId);
  res.json({ success: true });
};

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
