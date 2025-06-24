import express from "express";
import { addEvent, listEvent, RemoveEvent, getEventById, getEventsByOrganizer } from "../controllers/EventController.js";
import multer from "multer"

const eventRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()} ${file.originalname}`)
  }
})


const upload = multer({
  storage: storage,
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

eventRouter.get("/my-events", getEventsByOrganizer);
eventRouter.post(
  "/add",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "otherImages", maxCount: 5 },
  ]),
  addEvent
);
eventRouter.get("/list", listEvent)
eventRouter.post("/remove", RemoveEvent);
eventRouter.get("/:id", getEventById);


export default eventRouter;