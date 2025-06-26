import organizerModel from "../models/organizerModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//  Token creation function
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//  Register Organizer
export const registerOrganizer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      organization,
      website,
      planName,
      billingCycle,
      amount,
      bio,
      instagram,
      facebook,
      twitter,
      linkedin,
      city,
      state,
    } = req.body;


    if (!name || !email || !password || !organization || !phone) {
      console.log("❌ Missing required fields");
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const existing = await organizerModel.findOne({ email });
    if (existing) {
      console.log("❌ Email already exists:", email);
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOrganizer = new organizerModel({
      name,
      email,
      password: hashedPassword,
      phone,
      organization,
      profileImage: req.file
        ? { url: req.file.path, public_id: req.file.filename }
        : null,
      bio,
      socialLinks: {
        instagram,
        facebook,
        twitter,
        linkedin,
        website,
      },
      address: {
        city,
        state,
        country: "India",
      },
      role: "host",
      plan: {
        name: planName,
        billingCycle,
        amountPaid: amount,
      },
    });

    console.log("🧾 Organizer about to be saved:", newOrganizer);

    await newOrganizer.save();

    console.log("✅ Organizer saved successfully:", newOrganizer.email);

    res.status(201).json({
      success: true,
      message: "Organizer registered",
      userId: newOrganizer._id,
    });
  } catch (error) {
    console.error("🔥 Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Organizer By Email
export const getOrganizerByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const organizer = await organizerModel.findOne({ email });

    if (!organizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    res.status(200).json({
      success: true,
      organizer: {
        name: organizer.name,
        email: organizer.email,
        profileImage: organizer.profileImage,
        role: organizer.role,
        phone: organizer.phone,
        organization: organizer.organization,
        socialLinks: organizer.socialLinks,
        address: organizer.address,
        plan: organizer.plan,
        bio: organizer.bio,
      },
    });
  } catch (error) {
    console.error("Get Organizer Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Login Organizer
export const loginOrganizer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const organizer = await organizerModel.findOne({ email });
    if (!organizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    const isMatch = await bcrypt.compare(password, organizer.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = createToken(organizer._id);

    res.status(200).json({
      success: true,
      token,
      email: organizer.email,
      role: organizer.role,
      name: organizer.name,
      profileImage: organizer.profileImage,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrganizerProfile = async (req, res) => {
  try {
    const organizer = await organizerModel.findById(req.body.userId);
    if (!organizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    res.json({ success: true, organizer });
  } catch (error) {
    console.error(" Get Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// 🔄 Update Organizer Profile (name, phone, profileImage, etc.)
export const updateOrganizerProfile = async (req, res) => {
  try {
    const organizerId = req.body.userId; // from authMiddleware

    const updateFields = {
      name: req.body.name,
      phone: req.body.phone,
      organization: req.body.organizationName,
      // bio: req.body.bio,
      address: req.body.address,
      // "socialLinks.website": req.body.website,
    };

    if (req.file) {
      updateFields.profileImage = req.file.filename;
    }

    const updatedOrganizer = await organizerModel.findByIdAndUpdate(
      organizerId,
      updateFields,
      { new: true }
    );

    if (!updatedOrganizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      organizer: updatedOrganizer,
    });
  } catch (error) {
    console.error(" Profile Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
