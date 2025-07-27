// controllers/postController.js

import postModel from "../models/postModel.js";
import communityModel from "../models/communityModel.js";
import cloudinary from "../utils/cloudinary.js";
import userModel from "../models/userModel.js";

// Create a new post in a community
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim() && !req.file) {
      return res.status(400).json({ success: false, message: "Post content required" });
    }

    let imageData = { url: "", public_id: "" };
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "community_posts",
      });
      imageData = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    const post = await postModel.create({
      text,
      image: imageData,
      author: req.user.id,
      community: req.params.id,
    });

    const populatedPost = await post.populate("author", "_id name profileImage");
    
    res.status(201).json({ success: true, post: populatedPost });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
};


// Get all posts for a specific community
export const getCommunityPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await postModel.find({ community: id })
      .populate("author", "name profileImage")
      .populate("comments.author", "name profileImage")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
};


// ✅ Like a post
export const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    // ✅ Emit to all clients via socket.io
    const io = req.app.get("io");
    io.emit("postLiked", {
      postId,
      userId,
      liked: !alreadyLiked,
    });

    res.json({ success: true, userId, liked: !alreadyLiked });
  } catch (err) {
    console.error("Like toggle error:", err);
    res.status(500).json({ success: false, message: "Failed to toggle like" });
  }
};


// ✅ Comment on a post
export const commentOnPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?.id;
  const { text } = req.body;

  if (!userId) {
  return res.status(401).json({ success: false, message: "Unauthorized: Missing userId" });
}

  try {
    const user = await userModel.findById(userId).select("name profileImage");
    const post = await postModel.findById(postId);
    if (!post || !user) {
      return res.status(404).json({ success: false, message: "Post or user not found" });
    }

    const commentObj = {
      author: user._id,
      text,
      createdAt: new Date(),
    };

    post.comments.push(commentObj);
    await post.save();

    const savedComment = post.comments[post.comments.length - 1];

    // Emit comment with extra author info as expected by frontend
    const formattedComment = {
      _id: savedComment._id, 
      text,
      createdAt: commentObj.createdAt,
      author: {
        _id: user._id,
        name: user.name,
        profileImage: user.profileImage,
      },
    };

    res.json({ success: true, comment: formattedComment });
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
};

// ✅ Delete a post
export const deletePost = async (req, res) => {
  const { id, postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Only the author of the post or the community creator can delete
    const community = await communityModel.findById(post.community).populate("createdBy", "id");

    if (
      post.author.toString() !== userId &&
      community.createdBy._id.toString() !== userId
    ) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this post" });
    }

    // If there's an image, delete it from Cloudinary
    if (post.image?.public_id) {
      await cloudinary.uploader.destroy(post.image.public_id);
    }

    await post.deleteOne();

    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ success: false, message: "Failed to delete post" });
  }
};


export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user?.id;
  const userEmail = req.user?.email;

  try {
    const post = await postModel.findById(postId);
    const community = await communityModel.findById(post.community);

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    const isCommentCreator = comment.author.toString() === userId;
    const isCommunityHost = community.createdBy.toString() === userId;

    if (!isCommentCreator && !isCommunityHost) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
    }

    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();


    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
