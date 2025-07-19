import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    community: { type: mongoose.Schema.Types.ObjectId, ref: "community" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    text: { type: String, required: true },
    image: {
      url: String,
      public_id: String,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("posts", postSchema);
