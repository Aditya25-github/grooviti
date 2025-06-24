
import fs from 'fs';
import ticketModel from '../models/ticketModel.js';


// add Event item

const addEvent = async (req, res) => {
  try {
    // 1. Parse and validate location
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

    // 2. Get images
    const coverImage = req.files?.coverImage?.[0]?.filename;
    const otherImages = req.files?.otherImages?.map((file) => file.filename) || [];

    const organizerEmail = req.body.organizerEmail;


    if (!coverImage) {
      return res.json({ success: false, message: "Cover image is required" });
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
      highlights = parsedHighlights.filter((h) => allowedHighlights.includes(h));
    } catch (err) {
      console.log("Invalid highlights format");
    }

    // 3. Create event
    const event = new ticketModel({
      name: req.body.name,
      description: req.body.description,
      organizerEmail,
      price: req.body.price,
      category: req.body.category,
      coverImage,
      otherImages,
      totalTickets: req.body.totalTickets,
      ticketsSold: 0,
      location: parsedLocation,
      highlights,
    });

    // 4. Save to DB
    await event.save();
    res.json({ success: true, message: "Event Added" });

  } catch (error) {
    console.log("Error in addEvent:", error);
    res.json({ success: false, message: "Error adding event" });
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

    if (event.coverImage) {
      fs.unlink(`uploads/${event.coverImage}`, (err) => {
        if (err) console.error("Error deleting cover image:", err);
      });
    }

    if (event.otherImages && event.otherImages.length > 0) {
      event.otherImages.forEach((img) => {
        fs.unlink(`uploads/${img}`, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      });
    }

    if (event.image) {
      fs.unlink(`uploads/${event.image}`, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }

    res.json({ success: true, message: "Event Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error while deleting event" });
  }
};

const getEventById = async (req, res) => {
  try {
    console.log("Received event ID:", req.params.id);
    const event = await ticketModel.findById(req.params.id);
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
