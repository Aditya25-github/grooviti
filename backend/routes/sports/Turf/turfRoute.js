// backend/routes/turfRoutes.js
import express from "express";
import {
<<<<<<< HEAD
   getAllTurfs,
=======
>>>>>>> 4b3e7842 (too many changes so doing today)
  createTurf,
  getTurfs,
  getTurfById,
  updateTurf,
<<<<<<< HEAD
  deleteTurf
=======
  deleteTurf,
>>>>>>> 4b3e7842 (too many changes so doing today)
} from "../../../controllers/sports/Turf/turfController.js";
import authMiddleware from "../../../middleware/auth.js";
import { uploadTurfImage } from "../../../middleware/upload.js";
import { loginTurfOwner, registerTurfOwner } from "../../../controllers/sports/Turf/turfController.js";


const router = express.Router();

<<<<<<< HEAD
router.get("/All", getAllTurfs);

=======
>>>>>>> 4b3e7842 (too many changes so doing today)
router.post("/register", registerTurfOwner);
router.post("/login", loginTurfOwner);
router.post(
  "/",
  authMiddleware,
  uploadTurfImage.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  createTurf
);
<<<<<<< HEAD
=======

>>>>>>> 4b3e7842 (too many changes so doing today)
router.get("/", authMiddleware, getTurfs);
router.get("/:id", getTurfById);

router.put(
  "/:id",
  authMiddleware,
  uploadTurfImage.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  updateTurf
);

router.delete("/:id", authMiddleware, deleteTurf);

export default router;