import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "turfs",
      required: true,
    },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    timeSlot: { type: String, required: true }, // "6:00 PM - 8:00 PM"
    duration: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Refunded"],
      default: "Pending",
    },
    bookingTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("turfbookings", bookingSchema);
