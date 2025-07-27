import turfRoute from "./turfRoute.js";
import express from "express";
const sportsRoutes = express.Router();

sportsRoutes.use("/turf", turfRoute);

export default sportsRoutes;