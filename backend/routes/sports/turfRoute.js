// backend/routes/turfRoutes.js
import express from "express";
import {
  createTurf,
  getAllTurfs,
  getTurfById,
  updateTurf,
  deleteTurf,
} from "../../controllers/sports/turfController.js";
import authMiddleware from "../../middleware/auth.js";
import { uploadTurfImage } from "../../middleware/upload.js";
import { loginTurfOwner, registerTurfOwner } from "../../controllers/sports/turfController.js";


const router = express.Router();

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

router.get("/", getAllTurfs);
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