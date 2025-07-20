import express from "express";
import multer from "multer";
import {
  getCandidates,
  getWinners,
  submitVote,
  getVoteStatus,
  addCandidate,
} from "../controllers/fresherPartyController.js";
import authMiddleware from "../middleware/auth.js";


const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Fresher party voting routes
router.get("/fresher-party/candidates", getCandidates);
router.post("/candidates", upload.single("photo"), addCandidate);
router.get("/fresher-party/winners", getWinners);
router.get("/fresher-party/vote-status", authMiddleware, getVoteStatus);
router.post("/fresher-party/vote", authMiddleware, submitVote);
export default router;
