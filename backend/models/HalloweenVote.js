// models/HalloweenVote.js
import mongoose from "mongoose";

const halloweenVoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "HalloweenCandidate", required: true },
  category: {
    type: String,
    enum: ["bestDressed", "famousCharacter", "bestDuo"],
    required: true
  },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// One vote per user per category
halloweenVoteSchema.index({ user: 1, category: 1 }, { unique: true });

export default mongoose.model("HalloweenVote", halloweenVoteSchema);
