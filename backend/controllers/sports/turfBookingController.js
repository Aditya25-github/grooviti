import turfModel from "../../models/sports/turfModel.js";
import { listTurf } from "../controllers/turfController.js";

const listTurf = async (req, res) => {
  try {
    const turfs = await turfModel.find();
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching turf data" });
  }
};

const addTurf = async (req, res) => {
  try {
    const newTurf = new turfModel(req.body);
    await newTurf.save();
    res.status(201).json(newTurf);
  } catch (error) {
    res.status(500).json({ message: "Error adding turf data" });
  }
};

export { listTurf, addTurf };