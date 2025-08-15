// backend/models/Academy/academyBatchModel.js
import mongoose from "mongoose";

const academyBatchSchema = new mongoose.Schema(
  {
    sport: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    coach: {
      type: String,
      required: true,
    },
    days: {
      type: [String], // e.g., ["Mon", "Wed"]
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    students: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    academyOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const AcademyBatch = mongoose.model("AcademyBatch", academyBatchSchema);
export default AcademyBatch;
