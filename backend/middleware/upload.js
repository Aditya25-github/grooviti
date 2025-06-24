// middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Utility to create folder if not exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, png, webp) are allowed"));
  }
};

// Organizer storage
const organizerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/organizers";
    ensureDirExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

export const uploadOrganizerImage = multer({
  storage: organizerStorage,
  fileFilter,
});
