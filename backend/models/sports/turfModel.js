import mongoose from "mongoose";

const turfSchema = new mongoose.Schema({
  name: String,
  location: String,
  images: { type: [String], maxCount: 5 },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const slotSchema = new mongoose.Schema({
  turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf' },
  date: Date,
  startTime: String,
  endTime: String,
  totalTickets: Number,
  bookedTickets: { type: Number, default: 0 },
  price: Number,
});

export const Turf = mongoose.model('Turf', turfSchema);
export const Slot = mongoose.model('Slot', slotSchema);
