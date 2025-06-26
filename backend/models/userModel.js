import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    cartData: { type: Object, default: {} },
    resetToken: String,
    resetTokenExpiry: Date,
    profileImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" }, // uploaded at cloudinary 
    },
    phone: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
    dob: { type: Date },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { minimize: false, timestamps: true }
);

const userModel = mongoose.model.user || mongoose.model("user", userSchema);
export default userModel;
