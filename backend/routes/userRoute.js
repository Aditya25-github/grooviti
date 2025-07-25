import express from "express"
import authFormMiddleware from "../middleware/auth.js";
import authMiddleware from "../middleware/auth.js";

import {
  loginUser, registerUser, forgotPassword, resetPassword, googleLogin, getUserProfile,
  updateUserProfile, fetchUserProfile, followUser, unfollowUser,
  getFollowers,
  getFollowing
} from "../controllers/usercontroller.js"
import { uploadUserProfileImage } from "../middleware/upload.js";

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.post("/google-login", googleLogin);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.put(
  "/profile",
  authFormMiddleware,
  uploadUserProfileImage.single("profileImage"),
  updateUserProfile
);
userRouter.get("/:userId", fetchUserProfile);
userRouter.post("/:userId/follow", authMiddleware, followUser);
userRouter.post("/:userId/unfollow", authMiddleware, unfollowUser);
userRouter.get("/:userId/followers", getFollowers);
userRouter.get("/:userId/following", getFollowing);

export default userRouter;