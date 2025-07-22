// middlewares/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|heic|heif/;
  const ext = allowed.test(file.originalname.toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, png, webp, heic, heif) are allowed"));
  }
};

const organizerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "grooviti/organizers",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "heic", "heif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const userStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "grooviti/users",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "heic", "heif"],
    transformation: [{ width: 400, height: 400, crop: "limit" }],
  },
});

export const uploadOrganizerImage = multer({
  storage: organizerStorage,
  fileFilter,
});

export const uploadUserProfileImage = multer({
  storage: userStorage,
  fileFilter,
});
