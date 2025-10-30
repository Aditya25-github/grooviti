// routes/eventRouter.js
import express from "express";
import {
  addEvent,
  listEvent,
  RemoveEvent,
  getEventById,
  getEventsByOrganizer,
  organizerLogin,
  organizerRegister,
} from "../controllers/EventController.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const eventRouter = express.Router();

// ---- Auth endpoints (no multer here) ----
eventRouter.post("/login", organizerLogin);
eventRouter.post("/register", organizerRegister);

// Image Storage Engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "grooviti/events";
    if (file.fieldname === "coverImage") {
      folder = "grooviti/events/covers";
    } else if (file.fieldname === "otherImages") {
      folder = "grooviti/events/gallery";
    }
    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1000, height: 600, crop: "limit" }],
    };
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .png, .webp formats allowed!"), false);
    }
  },
});

// Event routes
eventRouter.get("/my-events", getEventsByOrganizer);
eventRouter.post(
  "/add",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "otherImages", maxCount: 5 },
  ]),
  addEvent
);
eventRouter.get("/list", listEvent);
eventRouter.post("/remove", RemoveEvent);
eventRouter.get("/:id", getEventById);

export default eventRouter;
