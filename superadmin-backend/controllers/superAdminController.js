import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import SuperAdmin from "../models/SuperAdmin.js";

export const loginSuperAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await SuperAdmin.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Optional - only run once to register a SuperAdmin manually
export const registerSuperAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await SuperAdmin.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = new SuperAdmin({ email, password: hashed });
    await admin.save();

    res.status(201).json({ success: true, message: "SuperAdmin registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating SuperAdmin" });
  }
};
