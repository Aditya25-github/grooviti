import AcademyOwner from "../../models/Academy/academyOwnerModel.js";
import jwt from "jsonwebtoken";

// Utility to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @route   POST /api/academy/login
// @access  Public
export const loginAcademyOwner = async (req, res) => {
  const { email, password } = req.body;

  try {
    const owner = await AcademyOwner.findOne({ email });

    if (owner && (await owner.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(owner._id),
        user: {
          id: owner._id,
          name: owner.name,
          email: owner.email,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   POST /api/academy/register
// @access  Public
export const registerAcademyOwner = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await AcademyOwner.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const newOwner = await AcademyOwner.create({ name, email, password });

    if (newOwner) {
      res.status(201).json({
        success: true,
        message: "Registration successful",
        user: {
          id: newOwner._id,
          name: newOwner.name,
          email: newOwner.email,
        },
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid owner data provided" });
    }
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
