import mongoose from "mongoose";

const fresherVoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FresherCandidate",
    required: true,
  },
  category: {
    type: String,
    enum: ["Mr", "Mrs"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Allow one vote per user per category
fresherVoteSchema.index({ user: 1, category: 1 }, { unique: true });

export default mongoose.model("FresherVote", fresherVoteSchema);
