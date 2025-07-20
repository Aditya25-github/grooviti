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

    // ✅ Gallery field added here
        gallery: [
          {
            url: String,
            public_id: String,
            comment: String,
            uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            createdAt: { type: Date, default: Date.now }
          }
        ]
  },
  { timestamps: true }
);

export default mongoose.model("community", communitySchema);
