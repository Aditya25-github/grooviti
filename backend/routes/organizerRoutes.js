import express from "express";
import multer from "multer";
import {
  registerOrganizer,
  getOrganizerByEmail,
  loginOrganizer,
  updateOrganizerProfile,
  getOrganizerProfile,
  generateCertificates,
  markAttendance,
  generateCertificatePDF,
} from "../controllers/organizerController.js";
import { uploadOrganizerImage } from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/register", uploadOrganizerImage.single("profileImage"), registerOrganizer);


router.post("/login", loginOrganizer);
router.post("/get", getOrganizerByEmail);


router.get("/profile", authMiddleware, getOrganizerProfile);


router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  updateOrganizerProfile
);
router.post("/generate", generateCertificates);
router.post("/mark-attendance", markAttendance);
router.get("/view-certificate", async (req, res) => {
  try {
    const pdf = await generateCertificatePDF(
      "Swaroop Shivaji Mane",
      "Technovate - Battle of Bands"
    );

    // ✅ IMPORTANT HEADERS
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=certificate.pdf");

    res.send(pdf);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error generating PDF");
  }
});
export default router;
