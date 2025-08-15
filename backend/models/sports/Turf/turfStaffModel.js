import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  position: String,
  department: String,
  joinDate: { type: Date, default: Date.now },
  status: { type: String, default: "Active" },
  salary: Number,
  avatar: String,
  workSchedule: String,
  lastActive: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "TurfOwners", required: true },
});

export default mongoose.model("TurfStaffs", staffSchema);
