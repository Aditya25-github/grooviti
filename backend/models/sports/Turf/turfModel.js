import mongoose from "mongoose";

const turfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    pricePerHour: { type: String },
    turfType: { type: String },
    features: { type: [String], default: [] },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    status: {
      type: String,
      enum: ["active", "maintenance"],
      default: "active",
    },
    latitude: { type: String },
    longitude: { type: String },
    image: { type: String, required: true }, // cover image path
    galleryImages: [{ type: String }],       // array of gallery image paths
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "TurfOwners", required: true },
  },
  { timestamps: true }
);

const slotSchema = new mongoose.Schema({
  turf: { type: mongoose.Schema.Types.ObjectId, ref: 'turfs' },
  date: Date,
  startTime: String,
  endTime: String,
  totalTickets: Number,
  bookedTickets: { type: Number, default: 0 },
  price: Number,
});

export const Turf = mongoose.model("turfs", turfSchema);
export const Slot = mongoose.model("slots", slotSchema);

export default { Turf, Slot };
