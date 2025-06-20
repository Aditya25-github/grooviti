import express from "express";
import Review from "../models/review.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

// POST: Add a review (protected route)
router.post("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { rating, comment, userName } = req.body;
    const newReview = new Review({
      eventId: req.params.eventId,
      userId: req.user.id,
      userName: userName || "Anonymous",
      rating,
      comment,
    });
    await newReview.save();
    res.json({ success: true, data: newReview });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to submit review" });
  }
});

// GET: Fetch reviews for an event (public route)
router.get("/:eventId", async (req, res) => {
  try {
    const reviews = await Review.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
});

// PUT: Update a review
router.put("/:reviewId", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    // Only allow the user who posted the review to edit
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    review.comment = req.body.comment || review.comment;
    review.rating = req.body.rating || review.rating;
    await review.save();

    res.json({ success: true, data: review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
});

// DELETE: Delete a review
router.delete("/:reviewId", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await review.deleteOne();
    res.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete review"
    });
  }
});


export default router;
