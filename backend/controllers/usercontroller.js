import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Create Token Function
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User with Default Role ("attendee")
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "attendee", // Default role
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Registration error" });
  }
};

// Login User and Check Role
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Login error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // valid for 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Create reset link
    const resetUrl = `http://localhost:5174/reset-password/${resetToken}`;

    // Send email (basic nodemailer setup)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // your email
        pass: process.env.MAIL_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: "grooviti@gmail.com",
      to: user.email,
      subject: "Password Reset - Grooviti",
      html: `
        <p>Hello ${user.name},</p>
        <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    res.json({ success: true, message: "Reset link sent to your email." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error sending reset link." });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // ensure token is still valid
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error resetting password" });
  }
};

const googleLogin = async (req, res) => {
  const { email, name, googleId } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: googleId,
        role: "attendee",
      });
    }

    const token = createToken(user._id);
    res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Google login failed" });
  }
};


export { loginUser, registerUser, forgotPassword, resetPassword, googleLogin };