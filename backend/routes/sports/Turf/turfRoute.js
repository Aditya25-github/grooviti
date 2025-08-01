// backend/routes/turfRoutes.js
import express from "express";
import {
   getAllTurfs,
  createTurf,
  getTurfs,
  getTurfById,
  updateTurf,
  deleteTurf
} from "../../../controllers/sports/Turf/turfController.js";
import authMiddleware from "../../../middleware/auth.js";
import { uploadTurfImage } from "../../../middleware/upload.js";
import { loginTurfOwner, registerTurfOwner } from "../../../controllers/sports/Turf/turfController.js";


const router = express.Router();

router.get("/All", getAllTurfs);

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