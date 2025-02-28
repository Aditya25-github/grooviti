import express from "express";
import { addEvent, listEvent, RemoveFood } from "../controllers/EventController.js";
import multer from "multer"

const eventRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()} ${file.originalname}`)
  }
})

const upload = multer({ storage: storage })

eventRouter.post("/add", upload.single("image"), addEvent)
eventRouter.get("/list", listEvent)
eventRouter.post("/remove", RemoveFood);

export default eventRouter;