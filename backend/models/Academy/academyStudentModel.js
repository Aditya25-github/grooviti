import mongoose from "mongoose";

const academyStudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  guardianName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  address: { type: String, required: true },
  preferredSport: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  preferredTimeSlot: { type: String, required: true },
  availableDays: [{ type: String }],
  medicalConditions: { type: String },
  emergencyContact: { type: String, required: true },
  selectedBatch: { type: String },
  academyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyOwner", required: true },
}, { timestamps: true });

export default mongoose.model("AcademyStudents", academyStudentSchema);
