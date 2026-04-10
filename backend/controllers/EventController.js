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
    console.log("Incoming organizerEmail:", req.body.organizerEmail);
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

    const rulebookFile = req.files?.rulebook?.[0];
    let rulebook = undefined;
    if (rulebookFile) {
      rulebook = {
        public_id: rulebookFile.filename,
        url: rulebookFile.path,
      };
    }

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
      console.log("Incoming organizerEmail:", req.body.organizerEmail);
      return res
        .status(400)
        .json({ success: false, message: "Organizer not found" });
    }

    const isPaidEvent = req.body.isPaid === "true" || req.body.isPaid === true;
    const finalPrice = isPaidEvent ? Number(req.body.price) : 0;

    const event = new ticketModel({
      name: req.body.name,
      description: req.body.description,
      organizerEmail: req.body.organizerEmail,
      organizer: organizer._id,
      organizerContact: req.body.organizerContact || "",
      teamSizeLimit: req.body.teamSizeLimit ? Number(req.body.teamSizeLimit) : 10,
      memberWisePayment: req.body.memberWisePayment === "true" || req.body.memberWisePayment === true,
      isPaid: isPaidEvent,
      price: finalPrice,
      category: req.body.category,
      coverImage,
      otherImages,
      totalTickets: req.body.totalTickets,
      ticketsSold: 0,
      location: parsedLocation,
      highlights,
      date: req.body.date ? new Date(req.body.date) : undefined,
      ...(rulebook && { rulebook }),
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

    if (event.rulebook?.url) {
      try {
        const publicId = getPublicId(event.rulebook.url);
        if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
      } catch (err) {
        console.error("Cloudinary rulebook delete error:", err);
      }
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

const editEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const existingEvent = await ticketModel.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    let parsedLocation = existingEvent.location;
    if (req.body.location) {
      try {
        parsedLocation = JSON.parse(req.body.location);
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid location format" });
      }
    }

    const coverImageFile = req.files?.coverImage?.[0];
    const otherImageFiles = req.files?.otherImages || [];

    const getPublicId = (url) => {
      const match = typeof url === "string"
        ? url.match(/\/upload\/(?:v\d+\/)?([^/.]+(?:\/[^/.]+)*)\.[a-z]+$/)
        : url?.url?.match(/\/upload\/(?:v\d+\/)?([^/.]+(?:\/[^/.]+)*)\.[a-z]+$/);
      return match ? match[1] : null;
    };

    let coverImage = existingEvent.coverImage;
    if (coverImageFile) {
      const oldPublicId = getPublicId(existingEvent.coverImage?.url);
      if (oldPublicId) {
         try {
           await cloudinary.uploader.destroy(oldPublicId);
         } catch(e) { console.error("Failed to delete old cover image", e); }
      }
      coverImage = {
        public_id: coverImageFile.filename,
        url: coverImageFile.path,
      };
    }

    let otherImages = existingEvent.otherImages || [];
    let retainedUrls = [];
    try {
       if (req.body.retainedOtherImages) {
          retainedUrls = JSON.parse(req.body.retainedOtherImages);
       } else {
          // If perfectly matching Add.jsx, this might not be sent. Let's just keep everything if so.
          retainedUrls = otherImages.map(img => img.url);
       }
    } catch(e) {
       retainedUrls = otherImages.map(img => img.url);
    }
    
    otherImages = otherImages.filter(img => {
       if(!retainedUrls.includes(img.url)) {
           const oldPublicId = getPublicId(img.url);
           if (oldPublicId) {
             cloudinary.uploader.destroy(oldPublicId).catch(console.error);
           }
           return false;
       }
       return true;
    });

    if (otherImageFiles.length > 0) {
      const newImages = otherImageFiles.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
      otherImages = [...otherImages, ...newImages];
    }

    const rulebookFile = req.files?.rulebook?.[0];
    let rulebook = existingEvent.rulebook;
    if (rulebookFile) {
      const oldPublicId = getPublicId(existingEvent.rulebook?.url);
      if (oldPublicId) {
         try {
           await cloudinary.uploader.destroy(oldPublicId, { resource_type: "raw" });
         } catch(e) { console.error("Failed to delete old rulebook", e); }
      }
      rulebook = {
        public_id: rulebookFile.filename,
        url: rulebookFile.path,
      };
    } else if (req.body.removeRulebook === "true") {
      const oldPublicId = getPublicId(existingEvent.rulebook?.url);
      if (oldPublicId) {
         try {
           await cloudinary.uploader.destroy(oldPublicId, { resource_type: "raw" });
         } catch(e) { console.error("Failed to delete old rulebook", e); }
      }
      rulebook = undefined;
    }

    let highlights = existingEvent.highlights;
    if (req.body.highlights) {
      try {
        const allowedHighlights = ["Live Music", "Seating Available", "Washrooms", "Parking", "Food Stalls"];
        const parsedHighlights = JSON.parse(req.body.highlights);
        highlights = parsedHighlights.filter((h) => allowedHighlights.includes(h));
      } catch (err) {}
    }

    if (req.body.isPaid !== undefined) {
      existingEvent.isPaid = req.body.isPaid === "true" || req.body.isPaid === true;
    }
    if (req.body.organizerContact !== undefined) {
      existingEvent.organizerContact = req.body.organizerContact;
    }
    if (req.body.teamSizeLimit !== undefined) {
      existingEvent.teamSizeLimit = Number(req.body.teamSizeLimit);
    }
    if (req.body.memberWisePayment !== undefined) {
      existingEvent.memberWisePayment = req.body.memberWisePayment === "true" || req.body.memberWisePayment === true;
    }
    if (req.body.date !== undefined) {
      existingEvent.date = req.body.date ? new Date(req.body.date) : undefined;
    }

    existingEvent.name = req.body.name || existingEvent.name;
    existingEvent.description = req.body.description || existingEvent.description;
    existingEvent.price = existingEvent.isPaid ? (req.body.price !== undefined ? Number(req.body.price) : existingEvent.price) : 0;
    existingEvent.category = req.body.category || existingEvent.category;
    existingEvent.totalTickets = req.body.totalTickets || existingEvent.totalTickets;
    existingEvent.location = parsedLocation;
    existingEvent.highlights = highlights;
    existingEvent.coverImage = coverImage;
    existingEvent.otherImages = otherImages;
    existingEvent.rulebook = rulebook;

    await existingEvent.save();
    res.json({ success: true, message: "Event Updated" });

  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addEvent, listEvent, RemoveEvent, getEventById, editEvent };
