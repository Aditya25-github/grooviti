// routes/candidateRoutes.js
import express from "express";
import Candidate from "../models/Candidate.js";

const router = express.Router();

// @route GET /api/candidates
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// @route POST /api/candidates
router.post("/", async (req, res) => {
  try {
    const { name, image, position } = req.body;

    const candidate = new Candidate({
      name,
      image,
      position,
    });

    const saved = await candidate.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to add candidate" });
  }
});

// @route PUT /api/candidates/:id/vote
router.put("/:id/vote", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    candidate.votes += 1;
    await candidate.save();

    res.json({ message: "Vote counted", candidate });
  } catch (err) {
    res.status(500).json({ error: "Voting failed" });
  }
});

export default router;
