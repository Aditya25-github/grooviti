// models/CommunityMessage.js
import mongoose from "mongoose";

const communityMessageSchema = new mongoose.Schema(
  {
    community: { type: mongoose.Schema.Types.ObjectId, ref: "community", required: true, index: true },
    sender:    { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
    text:      { type: String, trim: true, maxlength: 4000 },
    editedAt:  { type: Date },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

communityMessageSchema.index({ community: 1, createdAt: -1 });

export default mongoose.model("CommunityMessage", communityMessageSchema);
