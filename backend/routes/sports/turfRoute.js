import { addTurf, listTurf } from "../../controllers/sports/turfBookingController.js";
import express from "express";
const turfRoute = express.Router();
// Define your turf-related routes here
turfRoute.get("/", (req, res) => {
  res.send("Turf API");
});

//admin
turfRoute.post("/add", addTurf); // Assuming you want to add a turf, adjust as necessary



//user


//for both
turfRoute.post("/list", listTurf);// Assuming you want to list turfs


export default turfRoute;
