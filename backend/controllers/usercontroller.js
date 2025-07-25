import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";
import cloudinary from "cloudinary";


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
    const resetUrl = `https://grooviti.com/reset-password/${resetToken}`;

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

// GET: Fetch user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // comes from authMiddleware
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error fetching user profile" });
  }
};


// PUT: Update user profile (name and profileImage)
const updateUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, email, phone, gender, dob, location, bio } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender.toLowerCase();
    if (dob) user.dob = dob;
    if (location) user.location = location;
    if (bio) user.bio = bio;

    // If a new image is uploaded
    if (req.file && req.file.path && req.file.filename) {
      if (user.profileImage?.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }

      user.profileImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updated = await user.save();
    res.json({ success: true, user: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

// GET: Public User Profile
const fetchUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId).select("-password").populate("followers", "name profileImage")
      .populate("following", "name profileImage");

    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST: Follow a user
const followUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ success: false, message: "You cannot follow yourself." });
    }

    const currentUser = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });


    if (!currentUser.following.includes(targetUserId)) {
      currentUser.following.push(targetUserId);
      await currentUser.save();
    }

    if (!targetUser.followers.includes(currentUserId)) {
      targetUser.followers.push(currentUserId);
      await targetUser.save();
    }

    res.json({ success: true, message: "Followed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error following user" });
  }
};

// POST: Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    const currentUser = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.json({ success: true, message: "Unfollowed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error unfollowing user" });
  }
};

// Get Followers List
const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId).populate("followers", "name profileImage");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, followers: user.followers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching followers", error });
  }
};

// Get Following List
const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId).populate("following", "name profileImage");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, following: user.following });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching following", error });
  }
};

export {
  loginUser, registerUser, forgotPassword, resetPassword, googleLogin, getUserProfile,
  updateUserProfile, fetchUserProfile, followUser, unfollowUser, getFollowers, getFollowing
};