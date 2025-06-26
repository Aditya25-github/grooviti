import express from "express";
import {
  createPost, getCommunityPosts, likePost,
  commentOnPost,
} from "../controllers/postController.js";
import {
  getAllCommunities,
  joinCommunity,
  leaveCommunity,
  createCommunity,
  getSingleCommunity
} from "../controllers/communityController.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Community routes
router.get("/", getAllCommunities);
router.get("/:id", getSingleCommunity);
router.post("/join/:id", authMiddleware, joinCommunity);
router.post("/leave/:id", authMiddleware, leaveCommunity);
router.post("/create", authMiddleware, upload.single("image"), createCommunity);

// Post routes inside community
router.post("/:id/post", authMiddleware, upload.single("image"), createPost);
router.get("/:id/posts", getCommunityPosts);
router.post("/:id/post/:postId/like", authMiddleware, likePost);
router.post("/:id/post/:postId/comment", authMiddleware, commentOnPost);

export default router;
