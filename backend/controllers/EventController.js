
import fs from 'fs';
import bookingModel from '../models/bookingsModel.js';


// add Event item

const addEvent = async (req, res) => {

  let image_filename = `${req.file.filename}`;

  const event = new bookingModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename
  })

  try {
    await event.save();
    res.json({ sucess: true, message: "Event Added" })
  } catch (error) {
    console.log(error)
    res.json({ sucess: false, message: "Error" })
  }
}

// all event list

const listEvent = async (req, res) => {

  try {
    const events = await bookingModel.find({})
    res.json({ sucess: true, data: events })
  } catch (error) {
    console.log(error)
    response.json({ sucess: false, message: "Error" })
  }

}

// Remove Event Item

const RemoveEvent = async (req, res) => {
  try {
    const event = await bookingModel.findById(req.body.id);
    fs.unlink(`uploads/${event.image}`, () => { })

    await bookingModel.findByIdAndDelete(req.body.id);
    res.json({ sucess: true, message: "Event Removed" })
  } catch (error) {
    console.log(error);
    res.json({ sucess: false, message: "Error" })
  }
}

export { addEvent, listEvent, RemoveEvent }
