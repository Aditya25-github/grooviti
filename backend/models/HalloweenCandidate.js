// models/HalloweenCandidate.js
import mongoose from "mongoose";

const halloweenCandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // store /uploads/filename or cloud URL
  department: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  category: {
    type: String,
    enum: ["bestDressed", "famousCharacter", "bestDuo"],
    required: true
  },
  votes: { type: Number, default: 0 },
}, { timestamps: true });

// Avoid duplicate candidate entries within same category/department
halloweenCandidateSchema.index({ name: 1, department: 1, category: 1 }, { unique: true });

export default mongoose.model("HalloweenCandidate", halloweenCandidateSchema);
