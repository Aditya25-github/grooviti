// routes/eventRouter.js
import express from "express";
import {
  addEvent,
  listEvent,
  RemoveEvent,
  getEventById,
  getEventsByOrganizer,
  // organizerLogin,
  organizerRegister,
  editEvent,
} from "../controllers/EventController.js";
import { loginOrganizer } from "../controllers/organizerController.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const eventRouter = express.Router();

// ---- Auth endpoints (no multer here) ----
// eventRouter.post("/login", organizerLogin);
eventRouter.post("/login",loginOrganizer)
eventRouter.post("/register", organizerRegister);

// Image Storage Engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "grooviti/events";
    let resource_type = "image";
    let allowed_formats = ["jpg", "jpeg", "png", "webp"];
    let transformation = [{ width: 1000, height: 600, crop: "limit" }];

    if (file.fieldname === "coverImage") {
      folder = "grooviti/events/covers";
    } else if (file.fieldname === "otherImages") {
      folder = "grooviti/events/gallery";
    } else if (file.fieldname === "rulebook") {
      folder = "grooviti/events/rulebooks";
      resource_type = "raw";
    }

    const params = { folder, resource_type };
    if (resource_type === "image") {
      params.allowed_formats = ["jpg", "jpeg", "png", "webp"];
      params.transformation = [{ width: 1000, height: 600, crop: "limit" }];
    } else if (resource_type === "raw") {
      const ext = file.originalname.includes('.') ? file.originalname.substring(file.originalname.lastIndexOf('.')) : '';
      params.public_id = `doc_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    }

    return params;
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "rulebook") {
      const ext = file.originalname.toLowerCase().match(/\.(pdf|doc|docx)$/);
      if (ext) {
        cb(null, true);
      } else {
        cb(new Error("Only .pdf, .doc, .docx formats allowed for rulebook!"), false);
      }
    } else {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only .jpg, .png, .webp formats allowed!"), false);
      }
    }
  },
});

// Event routes
eventRouter.get("/my-events", getEventsByOrganizer);
eventRouter.post("/add",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "otherImages", maxCount: 5 },
    { name: "rulebook", maxCount: 1 },
  ]),addEvent
);
eventRouter.get("/list", listEvent);
eventRouter.post("/remove", RemoveEvent);
eventRouter.get("/:id", getEventById);
eventRouter.post("/edit/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "otherImages", maxCount: 5 },
    { name: "rulebook", maxCount: 1 },
  ]), editEvent
);

export default eventRouter;
