import express from "express";
import multer from "multer";
import {
  registerOrganizer,
  getOrganizerByEmail,
  loginOrganizer,
  updateOrganizerProfile,
  getOrganizerProfile,
} from "../controllers/organizerController.js";
import { uploadOrganizerImage } from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Multer setup for local image storage (in /uploads)
const storage = multer.diskStorage({
  destination: "uploads", //  Ensure this folder exists
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Organizer registration with profile image
router.post("/register", uploadOrganizerImage.single("profileImage"), registerOrganizer);

// Organizer login & get by email
router.post("/login", loginOrganizer);
router.post("/get", getOrganizerByEmail);

// organizers profile
router.get("/profile", authMiddleware, getOrganizerProfile);

//  Update organizer profile + profile image
router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"), // for new image
  updateOrganizerProfile
);

export default router;
