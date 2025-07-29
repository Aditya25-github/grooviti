// backend/controllers/turfController.js
import { Turf } from "../../models/sports/turfModel.js";

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


export const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, turfs });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // Parse JSON form data again (if sent as string)
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

    await turf.remove();
    res.status(200).json({ success: true, message: "Turf deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};