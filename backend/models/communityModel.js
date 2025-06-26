import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("community", communitySchema);
