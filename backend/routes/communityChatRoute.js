import { Router } from "express";
import CommunityMessage from "../models/CommunityMessage.js";
import { verifyCommunityAccess } from "../utils/communityAccess.js";

const router = Router();

// GET /api/community/:communityId/chat/history?before=<ISO>&limit=30
router.get("/:communityId/chat/history", async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { communityId } = req.params;
    const { before, limit = 30 } = req.query;

    await verifyCommunityAccess(authorization, communityId);

    const q = { community: communityId };
    if (before) q.createdAt = { $lt: new Date(before) };

    const messages = await CommunityMessage.find(q)
      .sort({ createdAt: -1 })
      .limit(Math.max(1, Math.min(100, Number(limit) || 30)))
      .populate("sender", "name profileImage")
      .lean();

    res.json({ success: true, messages });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || "Failed to load history" });
  }
});

export default router;
