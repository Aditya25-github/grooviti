
import fs from 'fs';
import ticketModel from '../models/ticketModel.js';


// add Event item

const addEvent = async (req, res) => {

  let image_filename = `${req.file.filename}`;

  const event = new ticketModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
    totalTickets: req.body.totalTickets, // Add totalTickets here
    ticketsSold: 0
  })

  try {
    await event.save();
    res.json({ success: true, message: "Event Added" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

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

export { addEvent, listEvent, RemoveEvent }
