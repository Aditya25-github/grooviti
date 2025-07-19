import communityModel from "../models/communityModel.js";
import userModel from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import multer from "multer";
import mongoose from "mongoose";
import postModel from "../models/postModel.js";

// Get all communities
export const getAllCommunities = async (req, res) => {
  try {
    const communities = await communityModel.find().populate("members", "name");
    res.json({ success: true, communities });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching communities" });
  }
};

// Get single community
export const getSingleCommunity = async (req, res) => {
  try {
    const community = await communityModel
      .findById(req.params.id)
      .populate("members", "name email")
      .populate("createdBy", "name email _id role"); 

    if (!community) {
      return res.status(404).json({ success: false, message: "Community not found" });
    }

    res.json({ success: true, community });
  } catch (err) {
    console.error("Get community error:", err);
    res.status(500).json({ success: false, message: "Error fetching community" });
  }
};


// Join a community
export const joinCommunity = async (req, res) => {
  try {
    const community = await communityModel.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: "Community not found" });

    const userId = req.user.id;
    if (community.members.includes(userId)) {
      return res.status(400).json({ success: false, message: "Already a member" });
    }

    community.members.push(userId);
    await community.save();

    res.json({ success: true, message: "Joined community", community });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error joining community" });
  }
};

// Leave a community
export const leaveCommunity = async (req, res) => {
  try {
    const community = await communityModel.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: "Community not found" });

    const userId = req.user.id;
    community.members = community.members.filter((id) => id.toString() !== userId);
    await community.save();

    res.json({ success: true, message: "Left community", community });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error leaving community" });
  }
};

// Create a community
export const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    let imageData = { url: "", public_id: "" };

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "community_images",
      });

      imageData = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    const newCommunity = await communityModel.create({
      name,
      description,
      image: imageData,
      members: [req.user.id],
      admins: [req.user.id],           // make creator an admin
      createdBy: req.user.id,          // store creator info
    });

    res.json({ success: true, message: "Community created", community: newCommunity });
  } catch (err) {
    console.error("Create community error:", err);
    res.status(500).json({ success: false, message: "Failed to create community" });
  }
};


export const deleteCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;

    const community = await communityModel.findById(communityId);
    if (!community) {
      return res.status(404).json({ success: false, message: "Community not found" });
    }

    // Check if the logged-in user is the creator
    if (community.email !== req.user.email) {
      return res.status(403).json({ success: false, message: "You are not allowed to delete this community" });
    }

    // Delete all posts in that community
    await postModel.deleteMany({ community: communityId });

    // Delete the community
    await communityModel.findByIdAndDelete(communityId);

    res.status(200).json({ success: true, message: "Community and its posts deleted successfully" });
  } catch (error) {
    console.error("Delete community error:", error);
    res.status(500).json({ success: false, message: "Server error while deleting community" });
  }
};

