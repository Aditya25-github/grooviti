import { Booking } from "../../../models/sports/Turf/turfbookingModel.js";
import { Turf } from "../../../models/sports/Turf/turfModel.js"; // For checking turf existence

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
    const bookings = await Booking.find().populate("turf", "name");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
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
