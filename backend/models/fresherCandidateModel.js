import mongoose from "mongoose";

const fresherCandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  department: { type: String, required: true },
  category: { type: String, enum: ["Mr", "Mrs"], required: true },
  votes: { type: Number, default: 0 },
});

export default mongoose.model("FresherCandidate", fresherCandidateSchema);
