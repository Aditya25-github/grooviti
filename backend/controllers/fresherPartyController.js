import FresherCandidate from "../models/fresherCandidateModel.js";
import cloudinary from "../utils/cloudinary.js";
import FresherVote from "../models/fresherVoteModel.js";

// POST: Add a new candidate
export const addCandidate = async (req, res) => {
  try {
    const { name, gender, department, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "fresher_candidates",
    });

    const newCandidate = new FresherCandidate({
      name,
      department,
      category,
      image: result.secure_url,
    });

    await newCandidate.save();

    res.status(201).json({ success: true, message: "Candidate added", candidate: newCandidate });
  } catch (error) {
    console.error("Add Candidate Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET: All candidates
export const getCandidates = async (req, res) => {
  try {
    const candidates = await FresherCandidate.find().sort({ category: 1, name: 1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: "Error fetching candidates" });
  }
};

// GET: Winners (top vote in each category)
export const getWinners = async (req, res) => {
  try {
    const [mrWinner] = await FresherCandidate.find({ category: "Mr" }).sort({ votes: -1 }).limit(1);
    const [mrsWinner] = await FresherCandidate.find({ category: "Mrs" }).sort({ votes: -1 }).limit(1);

    res.json({ mr: mrWinner || null, mrs: mrsWinner || null });
  } catch (err) {
    res.status(500).json({ message: "Error fetching winners" });
  }
};

export const getVoteStatus = async (req, res) => {
  try {
    const votes = await FresherVote.find({ user: req.user.id });
    const categoriesVoted = votes.map((v) => v.category);

    res.json({
      hasVoted: {
        Mr: categoriesVoted.includes("Mr"),
        Mrs: categoriesVoted.includes("Mrs"),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error checking vote status" });
  }
};

// POST: Submit a vote (one per category per user)
export const submitVote = async (req, res) => {
  const { candidateId } = req.body;
  const userId = req.user?.id; // Safe access

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found in request" });
    }

    const candidate = await FresherCandidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const existingVote = await FresherVote.findOne({
      user: userId,
      category: candidate.category,
    });

    if (existingVote) {
      return res.status(400).json({ message: `You have already voted for ${candidate.category} Fresher` });
    }

    if (typeof candidate.votes !== "number") {
      candidate.votes = 1;
    } else {
      candidate.votes += 1;
    }

    await candidate.save();

    await FresherVote.create({
      user: userId,
      candidate: candidateId,
      category: candidate.category,
    });

    res.json({ message: "Vote submitted successfully" });
  } catch (err) {
    console.error("Error submitting vote:", err); // <-- critical logging
    res.status(500).json({ message: "Error submitting vote", error: err.message });
  }
};
