import express from "express";
import multer from "multer";
import {
  addHalloweenCandidate,
  getHalloweenCandidates,
  getHalloweenWinners,
  getHalloweenVoteStatus,
  submitHalloweenVote,
} from "../controllers/halloweenController.js";
import authMiddleware from "../middleware/auth.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Halloween voting routes
router.get("/halloween/candidates", getHalloweenCandidates);
router.post("/halloween/candidates", upload.single("photo"), addHalloweenCandidate);
router.get("/halloween/winners", getHalloweenWinners);
router.get("/halloween/vote-status", authMiddleware, getHalloweenVoteStatus);
router.post("/halloween/vote", authMiddleware, submitHalloweenVote);

export default router;
