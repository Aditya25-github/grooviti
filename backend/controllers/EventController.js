import cloudinary from "../utils/cloudinary.js";
import ticketModel from '../models/ticketModel.js';
import mongoose from "mongoose";
import OrganizerModel from '../models/organizerModel.js';

// add Event item

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

    // 2. Get uploaded images from multer-storage-cloudinary
    const coverImageFile = req.files?.coverImage?.[0];
    const otherImageFiles = req.files?.otherImages || [];

    if (!coverImageFile) {
      return res.status(400).json({ success: false, message: "Cover image is required" });
    }

    const coverImage = {
      public_id: coverImageFile.filename,
      url: coverImageFile.path,
    };

    const otherImages = otherImageFiles.map(file => ({
      public_id: file.filename,
      url: file.path,
    }));

    // 3. Parse and filter highlights
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
      highlights = parsedHighlights.filter(h => allowedHighlights.includes(h));
    } catch (err) {
      console.log("Invalid highlights format");
    }

    const organizer = await OrganizerModel.findOne({ email: req.body.organizerEmail });
    if (!organizer) {
      return res.status(400).json({ success: false, message: "Organizer not found" });
    }

    // 4. Create event object
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


//specific events shown by the organizer

export const getEventsByOrganizer = async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const events = await ticketModel.find({ organizerEmail: email });
    return res.json({ success: true, events });
  } catch (error) {
    console.error("Error fetching organizer's events:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// all event list

const listEvent = async (req, res) => {

  try {
    const events = await ticketModel.find({})
    const updatedEvents = events.map(event => {
      const availableTickets = event.totalTickets - event.ticketsSold;
      return {
        ...event._doc,
        availableTickets,
      };
    });
    res.json({ success: true, data: updatedEvents })
  } catch (error) {
    console.log(error)
    response.json({ success: false, message: "Error" })
  }

}

// Remove Event Item

const RemoveEvent = async (req, res) => {
  try {
    const event = await ticketModel.findById(req.body.id);
    if (!event) {
      return res.json({ success: false, message: "Event not found" });
    }

    await ticketModel.findByIdAndDelete(req.body.id);

    // Extract Cloudinary public_id from URL
    const getPublicId = (url) => {
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/);
      return match ? match[1] : null;
    };

    if (event.coverImage) {
      try {
        const publicId = getPublicId(event.coverImage);
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Cloudinary cover image delete error:", err);
      }
    }

    if (event.otherImages && event.otherImages.length > 0) {
      for (const imgUrl of event.otherImages) {
        try {
          const publicId = getPublicId(imgUrl);
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Cloudinary image delete error:", err);
        }
      }
    }

    res.json({ success: true, message: "Event Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error while deleting event" });
  }
};

const getEventById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid event ID" });
  }

  try {
    const event = await ticketModel.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export { addEvent, listEvent, RemoveEvent, getEventById }
