import { Slot } from "../../../models/sports/Turf/turfModel.js";
import mongoose from "mongoose";
import moment from "moment-timezone";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

// Pricing per slot period
const SESSION_PRICES = {
  morning: 1,    // 6 AM – 12 PM
  afternoon: 1,  // 12 PM – 5 PM
  evening: 1    // 5 PM – 10 PM
};

const SLOT_CONFIG = {
  morning: { start: 6, end: 12 },     // 6 AM - 12 PM
  afternoon: { start: 12, end: 17 },  // 12 PM - 5 PM
  evening: { start: 17, end: 22 },    // 5 PM - 10 PM
};

const TIMEZONE = "Asia/Kolkata"; // IST

export const holdSlotForPayment = async (req, res) => {

  const { slotId } = req.params;
  const userId = req.user.id;
  const Razorpay = (await import('razorpay')).default;
  const razorpay = new Razorpay({
    key_id: "rzp_live_46Ch3IQvMWEQnp",
    key_secret: "8gXnkzb8FUOmRtlKNkNHXC67",
  });
console.log("Filtering for slotId and status:", slotId, "available");
console.log("Type of slotId:", typeof slotId);
const slotBeforeUpdate = await Slot.findOne({ _id: slotId, status: "available" });
console.log("Pre-update slot found:", slotBeforeUpdate);
  if (!mongoose.Types.ObjectId.isValid(slotId)) {
    return res.status(400).json({ success: false, message: "Invalid slot ID" });
  }

  try {
    // Only transition "available" to "confirming"
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, status: "available" },
      {
        $set: {
          status: "confirming",
          userId,
          paymentExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // now + 10 min
          confirmingStartedAt: new Date()
        }
      },
      { new: true }
    );
    if (!slot) return res.status(409).json({ success: false, message: 'Slot not available' });

    // Check slot price exists and is valid
    if (!slot.price || typeof slot.price !== "number" || slot.price <= 0) {
      return res.status(400).json({ success: false, message: "Slot price not found or invalid" });
    }

    // Safe, short receipt field
    const receiptStr = `slot_${slotId.slice(-8)}_${Date.now()}`.slice(0, 40);

    // Generate Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(slot.price * 100), // in paise
      currency: "INR",
      receipt: receiptStr,
      payment_capture: 1,
      notes: { slotId }
    });

    slot.paymentOrderId = order.id;
    await slot.save();

    // Return order info (for Razorpay checkout) and slot info
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      slot
    });
  } catch (err) {
    console.error("holdSlotForPayment error:", err);
    res.status(500).json({ success: false, message: "Could not create payment order." });
  }
};

export const confirmPayment = async (req, res) => {
  const { slotId } = req.params;
  const { paymentId, orderId, signature, customerName, phone } = req.body;

  if (!mongoose.Types.ObjectId.isValid(slotId)) {
    return res.status(400).json({ success: false, message: "Invalid slotId" });
  }

  // Optionally verify Razorpay signature here for extra security (can add later)

  // Only update if in confirming status and payment order matches
  const slot = await Slot.findOneAndUpdate(
    { _id: slotId, status: "confirming", paymentOrderId: orderId },
    {
      $set: {
        status: "booked",
        paymentId,
        paymentConfirmedAt: new Date(),
        customerName,
        phone
      }
    },
    { new: true }
  );

  if (!slot) {
    return res.status(409).json({
      success: false,
      message: "Slot not found or not pending payment."
    });
  }

  res.json({ success: true, slot });
};

// --- Book a slot ---
export const bookSlot = async (req, res) => {
  const { slotId } = req.params;
  const userId = req.user?.id;
  const { customerName, source = "web", phone } = req.body;

  if (!mongoose.Types.ObjectId.isValid(slotId)) {
    return res.status(400).json({ success: false, message: "Invalid slotId" });
  }
  if (!userId) {
    return res.status(401).json({ success: false, message: "User is not authenticated" });
  }
  if (!customerName) {
    return res.status(400).json({ success: false, message: "customerName is required" });
  }

  try {
    const updated = await Slot.findOneAndUpdate(
      {
        _id: slotId,
        status: "available",
        $expr: { $lt: ["$bookedTickets", "$totalTickets"] },
      },
      {
        $inc: { bookedTickets: 1 },
        $set: {
          status: "booked",
          customerName: customerName ?? null,
          source,
          userId,
          phone: phone ?? null,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(409).json({ success: false, message: "Slot no longer available" });
    }

    return res.json({ success: true, slot: updated });
  } catch (err) {
    console.error("bookSlot error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
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
    // If no price in slotItem, assign one based on period
    if (!slotItem.price) {
      slotItem.price = SESSION_PRICES[slotItem.period] ?? 600;
    }
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
  slot.userId = null;
  slot.paymentOrderId = null;
  slot.paymentExpiresAt = null;
  slot.confirmingStartedAt = null;
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

          // Set the price according to the session
          const price = SESSION_PRICES[period] ?? 600;

          slotsToCreate.push({
            turf: turfId,
            date: day.format("YYYY-MM-DD"), // plain IST date
            startTime,
            endTime,
            period,
            status: "available",
            bookedTickets: 0,
            totalTickets: 1,
            price // correct price per session!
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
