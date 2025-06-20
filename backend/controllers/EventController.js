
import fs from 'fs';
import ticketModel from '../models/ticketModel.js';


// add Event item

const addEvent = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  let parsedLocation;
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
    console.log("Parsed Location:", parsedLocation);
  } catch (err) {
    console.log("Location parsing error:", req.body.location);
    return res.json({ success: false, message: "Invalid location format" });
  }

  const event = new ticketModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
    totalTickets: req.body.totalTickets,
    ticketsSold: 0,
    location: parsedLocation,
  });

  try {
    await event.save();
    res.json({ success: true, message: "Event Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
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
