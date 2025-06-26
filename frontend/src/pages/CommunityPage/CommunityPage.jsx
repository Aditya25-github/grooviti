// Updated CommunityPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import "./CommunityPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const CommunityPage = () => {
  const { id } = useParams();
  const { url } = useContext(StoreContext);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [commentInput, setCommentInput] = useState({});
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?._id;
  const socket = io(url);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/api/community/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setCommunity(res.data.community);

        const postsRes = await axios.get(`${url}/api/community/${id}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (postsRes.data.success) setPosts(postsRes.data.posts);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load community");
      }
    };
    fetchData();
  }, [id, token, url]);

  useEffect(() => {
    socket.on("postCreated", (post) => {
      if (post.community === id) {
        setPosts((prev) => [post, ...prev]);
      }
    });
    socket.on("postLiked", ({ postId, userId, liked }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: liked
                  ? [...p.likes, userId]
                  : p.likes.filter((id) => id !== userId),
              }
            : p
        )
      );
    });

    socket.on("commentAdded", ({ postId, comment }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: [...p.comments, comment] } : p
        )
      );
    });

    return () => {
      socket.off("postCreated");
      socket.off("postLiked");
      socket.off("commentAdded");
    };
  }, [id, socket]);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `${url}/api/community/${id}/post/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const { userId, liked } = res.data;
        socket.emit("likePost", { postId, userId, liked });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error toggling like");
    }
  };

  const handleComment = async (postId, text) => {
    if (!text.trim()) return toast.warning("Comment can't be empty");
    try {
      const res = await axios.post(
        `${url}/api/community/${id}/post/${postId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        socket.emit("newComment", {
          postId,
          comment: res.data.comment,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding comment");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim() && !image) {
      return toast.warning("Post can't be empty");
    }

    const formData = new FormData();
    formData.append("text", newPost);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(
        `${url}/api/community/${id}/post`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setNewPost("");
        setImage(null);
        setPreview(null);
        toast.success("Post added");
        socket.emit("newPost", res.data.post);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding post");
    }
  };

  if (!community) return <div>Loading...</div>;

  return (
    <div className="community-page" style={{ paddingTop: "95px" }}>
      <div className="community-header">
        <img src={community.image?.url || "/default.jpg"} alt="Community" />
        <div>
          <h2>{community.name}</h2>
          <p>{community.description}</p>
          <p>{community.members.length} members</p>
        </div>
      </div>

      <div className="post-form">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
        />
        {preview && <img src={preview} alt="preview" className="preview-img" />}
        <div className="post-form-actions">
          <label className="upload-label">
            📷
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
          <button onClick={handlePostSubmit}>Post</button>
        </div>
      </div>

      <div className="community-posts">
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <strong>{post.author.name}</strong>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <p>{post.text}</p>
              {post.image?.url && (
                <img src={post.image.url} alt="Post" className="post-img" />
              )}
              <div className="post-action">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`like-btn ${
                    post.likes.includes(currentUserId) ? "liked" : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      post.likes.includes(currentUserId)
                        ? solidHeart
                        : regularHeart
                    }
                    className="heart-icon"
                  />
                  {post.likes.length}
                </button>
                <button
                  onClick={() =>
                    setCommentInput((prev) => ({
                      ...prev,
                      [post._id]: !prev[post._id],
                    }))
                  }
                >
                  💬 {post.comments.length}
                </button>
              </div>

              {commentInput[post._id] && (
                <div className="comment-box">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInput[`${post._id}_text`] || ""}
                    onChange={(e) =>
                      setCommentInput((prev) => ({
                        ...prev,
                        [`${post._id}_text`]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const text = commentInput[`${post._id}_text`]?.trim();
                        if (text) {
                          handleComment(post._id, text);
                          setCommentInput((prev) => ({
                            ...prev,
                            [`${post._id}_text`]: "",
                          }));
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const text = commentInput[`${post._id}_text`]?.trim();
                      if (text) {
                        handleComment(post._id, text);
                        setCommentInput((prev) => ({
                          ...prev,
                          [`${post._id}_text`]: "",
                        }));
                      }
                    }}
                    disabled={!commentInput[`${post._id}_text`]?.trim()}
                  >
                    Send
                  </button>
                </div>
              )}

              {post.comments?.length > 0 && (
                <div className="comments-list">
                  {post.comments.map((cmt, index) => (
                    <div className="comment-item" key={index}>
                      <strong>{cmt.author?.name || "User"}</strong>: {cmt.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
