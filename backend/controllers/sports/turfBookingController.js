import turf from "../../models/sports/turfModel.js";


const listTurf = async (req, res) => {
  try {
    const turfs = await turf.find();
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching turf data" });
  }
};

const addTurf = async (req, res) => {
  try {
    const newTurf = new turf(req.body);
    await newTurf.save();
    res.status(201).json(newTurf);
  } catch (error) {
    res.status(500).json({ message: "Error adding turf data" });
  }
};

export { listTurf, addTurf };