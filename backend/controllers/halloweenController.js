import HalloweenCandidate from "../models/HalloweenCandidate.js";
import HalloweenVote from "../models/HalloweenVote.js";
import cloudinary from "../utils/cloudinary.js";

// POST: Add a new Halloween candidate (Cloudinary upload)
export const addHalloweenCandidate = async (req, res) => {
  try {
    const { name, gender, department, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "halloween_candidates",
    });

    const doc = await HalloweenCandidate.create({
      name,
      gender,
      department,
      category, // "bestDressed" | "famousCharacter" | "bestDuo"
      image: result.secure_url,
    });

    res.status(201).json({ success: true, message: "Halloween candidate added", candidate: doc });
  } catch (err) {
    console.error("Add Halloween Candidate Error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Candidate already exists for this department and category" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET: All Halloween candidates with optional filters
export const getHalloweenCandidates = async (req, res) => {
  try {
    const { category, department, gender } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (department) filter.department = department;
    if (gender) filter.gender = gender;

    const list = await HalloweenCandidate.find(filter).sort({ category: 1, votes: -1, name: 1 });
    res.json({ success: true, data: list });
  } catch (err) {
    console.error("Get Halloween Candidates Error:", err);
    res.status(500).json({ message: "Error fetching candidates" });
  }
};

// GET: Winners (top vote in each category)
export const getHalloweenWinners = async (req, res) => {
  try {
    const categories = ["bestDressed", "famousCharacter", "bestDuo"];
    const winners = {};
    for (const c of categories) {
      const [winner] = await HalloweenCandidate.find({ category: c }).sort({ votes: -1 }).limit(1);
      winners[c] = winner || null;
    }
    res.json(winners);
  } catch (err) {
    console.error("Get Halloween Winners Error:", err);
    res.status(500).json({ message: "Error fetching winners" });
  }
};

// GET: Vote status per category for the logged-in user
export const getHalloweenVoteStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const votes = await HalloweenVote.find({ user: userId }).select("category candidate");
    const hasVoted = {
      bestDressed: false,
      famousCharacter: false,
      bestDuo: false,
    };
    votes.forEach(v => { hasVoted[v.category] = true; });

    res.json({ hasVoted });
  } catch (err) {
    console.error("Get Halloween Vote Status Error:", err);
    res.status(500).json({ message: "Error checking vote status" });
  }
};

// POST: Submit a vote (one per category per user)
export const submitHalloweenVote = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { candidateId } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized: User not found in request" });

    const candidate = await HalloweenCandidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    const existingVote = await HalloweenVote.findOne({
      user: userId,
      category: candidate.category,
    });
    if (existingVote) {
      return res.status(400).json({ message: `You have already voted for ${candidate.category}` });
    }

    // increment candidate votes then record vote
    await HalloweenCandidate.updateOne({ _id: candidate._id }, { $inc: { votes: 1 } });
    await HalloweenVote.create({
      user: userId,
      candidate: candidate._id,
      category: candidate.category,
    });

    res.json({ message: "Vote submitted successfully" });
  } catch (err) {
    console.error("Submit Halloween Vote Error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already voted in this category" });
    }
    res.status(500).json({ message: "Error submitting vote", error: err.message });
  }
};
