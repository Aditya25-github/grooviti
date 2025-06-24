import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  organization: { type: String },
  profileImage: { type: String },
  bio: { type: String },
  plan: {
    name: { type: String, required: true },
    billingCycle: { type: String, required: true },
    amountPaid: { type: Number, required: true },
  },
  socialLinks: {
    instagram: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    website: { type: String },
  },
  address: {
    city: { type: String },
    state: { type: String },
    country: { type: String, default: "India" },
  },
  role: { type: String, default: "host" },
  createdAt: { type: Date, default: Date.now },
});

const organizerModel =
  mongoose.models.Organizer || mongoose.model("Organizer", organizerSchema);

export default organizerModel;
