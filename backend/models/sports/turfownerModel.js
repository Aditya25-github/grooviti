import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const turfOwnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash password
turfOwnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("Password hashed before saving:", this.password);
  next();
});

// Compare password
turfOwnerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const TurfOwner = mongoose.model("TurfOwners", turfOwnerSchema);
