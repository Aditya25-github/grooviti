import { Booking } from "../../../models/sports/Turf/turfbookingModel.js";
import { Turf } from "../../../models/sports/Turf/turfModel.js"; // For checking turf existence

const ownerBookingFilter = async (ownerId) => {
  // Get all turfs owned by this owner
  const turfs = await Turf.find({ createdBy: ownerId }).select("_id");
  return turfs.map((t) => t._id);
};

export const createBooking = async (req, res) => {
  try {
    const { customerName, customerPhone, turf, date, timeSlot, duration, amount } = req.body;

    const turfExists = await Turf.findById(turf);
    if (!turfExists) return res.status(404).json({ message: "Turf not found" });

    const newBooking = await Booking.create({
      customerName,
      customerPhone,
      turf,
      date,
      timeSlot,
      duration,
      amount,
    });

    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ message: "Failed to create booking", error: err.message });
  }
};


export const getAllBookings = async (req, res) => {
  try {
    const ownerId = req.user.id; // Turf owner's ID from token

    // Step 1: Find all turf IDs owned by this owner
    const turfs = await Turf.find({ createdBy: ownerId }).select("_id");

    const turfIds = turfs.map(turf => turf._id);

    // Step 2: Find bookings for those turf IDs
    const bookings = await Booking.find({ turf: { $in: turfIds } })
      .populate("turf", "name address image") // get basic turf info in booking
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching bookings",
      error: error.message,
    });
  }
};

export const getTodaysBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const turfIds = await Turf.find({ createdBy: ownerId }).distinct("_id");
    const today = new Date().toISOString().slice(0, 10);

    const bookings = await Booking.find({
      turf: { $in: turfIds },
      date: today,
    }).populate("turf", "name");


    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("Error in getTodaysBookings:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBookingsByDate = async (req, res) => {
  try {
    const { date } = req.params; // expect YYYY-MM-DD in URL
    const turfIds = await ownerBookingFilter(req.user.id);
    if (!turfIds.length) {
      return res.status(200).json({ success: true, bookings: [] });
    }

    const bookings = await Booking.find({
      turf: { $in: turfIds },
      date,
    })
      .populate("turf", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Error in getBookingsByDate:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBookingsInRange = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { start, end } = req.query;
    const turfIds = await ownerBookingFilter(req.user.id);

    const bookings = await Booking.find({
      turf: { $in: turfIds },
      date: {
        $gte: start,  // strings
        $lte: end,
      },
    }).populate("turf", "name").sort({ date: 1 });
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("Error in getBookingsInRange:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("turf", "name");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking", error: err.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update booking", error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete booking", error: err.message });
  }
};
