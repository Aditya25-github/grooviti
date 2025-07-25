import express from "express";
import {
  createPost, getCommunityPosts, likePost,
  commentOnPost, deletePost
} from "../controllers/postController.js";
import {
  getAllCommunities,
  joinCommunity,
  leaveCommunity,
  createCommunity,
  getSingleCommunity,
  uploadGalleryMedia   // ✅ Added
} from "../controllers/communityController.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { deleteCommunity } from "../controllers/communityController.js";


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
router.delete("/:id/post/:postId", authMiddleware, deletePost);
router.delete("/:id", authMiddleware, deleteCommunity);

// ✅ Gallery upload route
router.post("/:id/gallery/upload", authMiddleware, upload.single("media"), uploadGalleryMedia);

export default router;
