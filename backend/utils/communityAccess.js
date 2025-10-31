// utils/communityAccess.js
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Community from "../models/communityModel.js";
import User from "../models/userModel.js";


export async function verifyCommunityAccess(authorizationHeader, communityId) {
  if (!authorizationHeader) throw new Error("No token provided");

  const token = authorizationHeader.replace(/^Bearer\s+/i, "");
  if (!token) throw new Error("Invalid token format");

  // Decode token
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const userId = payload?.id;
  if (!userId || !mongoose.isValidObjectId(userId)) throw new Error("Invalid user ID");

  // Fetch user and community
  const [user, community] = await Promise.all([
    User.findById(userId).select("_id name").lean(),
    Community.findById(communityId).select("_id members").lean(),
  ]);

  if (!user) throw new Error("User not found");
  if (!community) throw new Error("Community not found");

  // Check membership
  const isMember = community.members.some(
    (m) => String(m) === String(user._id)
  );
  if (!isMember) throw new Error("Not a member of this community");

  return { user, communityId: String(community._id) };
}
