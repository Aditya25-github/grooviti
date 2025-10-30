// controllers/EventController.js
import cloudinary from "../utils/cloudinary.js";
import ticketModel from "../models/ticketModel.js";
import mongoose from "mongoose";
import OrganizerModel from "../models/organizerModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ---------------- Organizer Auth ----------------

export const organizerRegister = async (req, res) => {
  try {
    const { name, email, password, role = "host" } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email and password are required" });
    }

    const exists = await OrganizerModel.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await OrganizerModel.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      role, // "host" by default
    });

    return res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    console.error("organizerRegister error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const organizerLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const organizer = await OrganizerModel.findOne({ email: email.toLowerCase() });
    if (!organizer) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, organizer.password);
    if (!ok) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Issue JWT
    const token = jwt.sign(
      { id: organizer._id, role: organizer.role, email: organizer.email },
      process.env.JWT_SECRET || "dev_secret_change_me",
      { expiresIn: "7d" }
    );

    // Match frontend expectations exactly
    return res.json({
      success: true,
      role: organizer.role, // "host"
      token,
      email: organizer.email,
    });
  } catch (err) {
    console.error("organizerLogin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- Events (your existing code) ----------------

const addEvent = async (req, res) => {
  try {
    let parsedLocation = {};
    try {
      parsedLocation = JSON.parse(req.body.location);
      if (
        !parsedLocation ||
        !parsedLocation.city ||
        !parsedLocation.latitude ||
        !parsedLocation.longitude
      ) {
        throw new Error("Incomplete location data");
      }
    } catch (err) {
      console.log("Location parsing error:", req.body.location);
      return res.json({ success: false, message: "Invalid location format" });
    }

    const coverImageFile = req.files?.coverImage?.[0];
    const otherImageFiles = req.files?.otherImages || [];
    if (!coverImageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Cover image is required" });
    }

    const coverImage = {
      public_id: coverImageFile.filename,
      url: coverImageFile.path,
    };
    const otherImages = otherImageFiles.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));

    const allowedHighlights = [
      "Live Music",
      "Seating Available",
      "Washrooms",
      "Parking",
      "Food Stalls",
    ];

    let highlights = [];
    try {
      const parsedHighlights = JSON.parse(req.body.highlights || "[]");
      highlights = parsedHighlights.filter((h) =>
        allowedHighlights.includes(h)
      );
    } catch (err) {
      console.log("Invalid highlights format");
    }

    const organizer = await OrganizerModel.findOne({
      email: req.body.organizerEmail,
    });
    if (!organizer) {
      return res
        .status(400)
        .json({ success: false, message: "Organizer not found" });
    }

    const event = new ticketModel({
      name: req.body.name,
      description: req.body.description,
      organizerEmail: req.body.organizerEmail,
      organizer: organizer._id,
      price: req.body.price,
      category: req.body.category,
      coverImage,
      otherImages,
      totalTickets: req.body.totalTickets,
      ticketsSold: 0,
      location: parsedLocation,
      highlights,
    });

    await event.save();
    res.json({ success: true, message: "Event Added" });
  } catch (error) {
    console.log("Error in addEvent:", error);
    res.status(500).json({ success: false, message: "Error adding event" });
  }
};

export const getEventsByOrganizer = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const events = await ticketModel.find({ organizerEmail: email });
    return res.json({ success: true, events });
  } catch (error) {
    console.error("Error fetching organizer's events:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const listEvent = async (req, res) => {
  try {
    const events = await ticketModel.find({});
    const updatedEvents = events.map((event) => {
      const availableTickets = event.totalTickets - event.ticketsSold;
      return {
        ...event._doc,
        availableTickets,
      };
    });
    res.json({ success: true, data: updatedEvents });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// const RemoveEvent = async (req, res) => {
//   try {
//     const event = await ticketModel.findById(req.body.id);
//     if (!event) {
//       return res.json({ success: false, message: "Event not found" });
//     }
//     await ticketModel.findByIdAndDelete(req.body.id);

//     // Helper to extract public_id from URL if needed
//     const getPublicId = (url) => {
//       const match = url?.url
//         ? url.url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/)
//         : String(url).match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/);
//       return match ? match[1] : null;
//     };

//     if (event.coverImage) {
//       try {
//         const publicId = getPublicId(event.coverImage);
//         if (publicId) await cloudinary.uploader.destroy(publicId);
//       } catch (err) {
//         console.error("Cloudinary cover image delete error:", err);
//       }
//     }

//     if (event.otherImages && event.otherImages.length > 0) {
//       for (const img of event.otherImages) {
//         try {
//           const publicId = getPublicId(img);
//           if (publicId) await cloudinary.uploader.destroy(publicId);
//         } catch (err) {
//           console.error("Cloudinary image delete error:", err);
//         }
//       }
//     }

//     res.json({ success: true, message: "Event Removed" });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: "Error while deleting event" });
//   }
// };

const RemoveEvent = async (req, res) => {
  try {
    const event = await ticketModel.findById(req.body.id);
    if (!event) {
      return res.json({ success: false, message: "Event not found" });
    }

    // Helper to extract public_id from Cloudinary URL
    const getPublicId = (url) => {
      const match = typeof url === "string"
        ? url.match(/\/upload\/(?:v\d+\/)?([^/.]+(?:\/[^/.]+)*)\.[a-z]+$/)
        : url?.url?.match(/\/upload\/(?:v\d+\/)?([^/.]+(?:\/[^/.]+)*)\.[a-z]+$/);
      return match ? match[1] : null;
    };

    // Delete cover image
    if (event.coverImage) {
      try {
        const publicId = getPublicId(event.coverImage);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Cloudinary cover image delete error:", err);
      }
    }

    // Delete other images (parallel deletion)
    if (event.otherImages?.length > 0) {
      const deletePromises = event.otherImages.map(async (img) => {
        try {
          const publicId = getPublicId(img);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Cloudinary image delete error:", err);
        }
      });
      await Promise.all(deletePromises);
    }

    // Now delete the event from DB
    await ticketModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Event and images deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error while deleting event" });
  }
};


const getEventById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid event ID" });
  }
  try {
    const event = await ticketModel.findById(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addEvent, listEvent, RemoveEvent, getEventById };
