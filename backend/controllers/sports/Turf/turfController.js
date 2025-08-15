// backend/controllers/turfController.js
import { Turf } from "../../../models/sports/Turf/turfModel.js";
import jwt from "jsonwebtoken";
import { TurfOwner } from "../../../models/sports/Turf/turfownerModel.js";
import authMiddleware from "../../../middleware/auth.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerTurfOwner = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await TurfOwner.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newOwner = new TurfOwner({ name, email, password });
    await newOwner.save();

    res.status(201).json({
      success: true,
      message: "Turf owner registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginTurfOwner = async (req, res) => {
  const { email, password } = req.body;
  try {
    const owner = await TurfOwner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await owner.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(owner._id);
    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};



export const createTurf = async (req, res) => {
  try {
    const formData = req.body.data ? JSON.parse(req.body.data) : {};

    const {
      name,
      description,
      pricePerHour,
      turfType,
      features,
      address,
      city,
      state,
      latitude,
      longitude,
    } = formData;

    // multer + Cloudinary files
    const coverImageFile = req.files?.coverImage?.[0]; // single file
    const galleryFiles = req.files?.galleryImages || []; // multiple files

    if (!name || !coverImageFile) {
      return res.status(400).json({ message: "Name and cover image are required" });
    }

    // Cloudinary URLs are in file.path
    const image = coverImageFile.path;
    const galleryImages = galleryFiles.map((file) => file.path);

    const turf = new Turf({
      name,
      description,
      pricePerHour,
      turfType,
      features,
      address,
      city,
      state,
      latitude,
      longitude,
      image,
      galleryImages,
      createdBy: req.user.id,
    });

    await turf.save();

    res.status(201).json({ success: true, turf });
  } catch (error) {
    console.error("Create Turf error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Will use this when I will give acess to superAdmin Panel
// export const getAllTurfs = async (req, res) => {
//   try {
//     const turfs = await Turf.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, turfs });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getTurfs = async (req, res) => {
  try {
    const ownerId = req.user.id; // coming from your authMiddleware

    const turfs = await Turf.find({ createdBy: ownerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: turfs,
    });
  } catch (error) {
    console.error("Error fetching turfs:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching turfs",
    });
  }
};


export const getTurfById = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    res.status(200).json({ success: true, turf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    if (turf.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const formData = req.body.data ? JSON.parse(req.body.data) : req.body;

    const {
      name,
      description,
      pricePerHour,
      turfType,
      features,
      address,
      city,
      state,
      latitude,
      longitude,
    } = formData;

    const coverImageFile = req.files?.coverImage?.[0];
    const galleryFiles = req.files?.galleryImages || [];

    turf.name = name || turf.name;
    turf.description = description || turf.description;
    turf.pricePerHour = pricePerHour || turf.pricePerHour;
    turf.turfType = turfType || turf.turfType;
    turf.features = features || turf.features;
    turf.address = address || turf.address;
    turf.city = city || turf.city;
    turf.state = state || turf.state;
    turf.latitude = latitude || turf.latitude;
    turf.longitude = longitude || turf.longitude;

    if (coverImageFile) turf.image = coverImageFile.path;
    if (galleryFiles.length > 0) {
      // Append new gallery images to existing ones (optional: or replace)
      turf.galleryImages = turf.galleryImages.concat(galleryFiles.map((f) => f.path));
    }

    const updatedTurf = await turf.save();
    res.status(200).json({ success: true, turf: updatedTurf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    if (turf.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await turf.deleteOne();
    res.status(200).json({ success: true, message: "Turf deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};