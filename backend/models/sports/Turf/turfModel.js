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
  turf: { type: mongoose.Schema.Types.ObjectId, ref: "turfs", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false }, // NOT required for open slots!
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  totalTickets: { type: Number, default: 1 },
  bookedTickets: { type: Number, default: 0 },
  price: { type: Number, required: true },
  status: { type: String, default: "available" },
  source: { type: String, default: null },
  customerName: { type: String, default: null },
  phone: { type: String, default: null }, // add this if desired
}, { timestamps: true });
slotSchema.index({ turf: 1, date: 1, startTime: 1 }, { unique: true });

  export const Turf = mongoose.model("turfs", turfSchema);
  export const Slot = mongoose.model("slots", slotSchema);

export default { Turf, Slot };
