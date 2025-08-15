import { addTurf, listTurf } from "../../controllers/sports/turfController.js";
const turfRouter = express.Router();

// Define your turf-related routes here
turfRouter.get("/", (req, res) => {
  res.send("Turf API");
});

//admin
turfRouter.post("/add", addTurf); // Assuming you want to add a turf, adjust as necessary



//user


//for both
turfRouter.post("/list", listTurf);// Assuming you want to list turfs


module.exports = turfRouter;
