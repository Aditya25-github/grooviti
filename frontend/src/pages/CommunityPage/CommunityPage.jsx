// Updated CommunityPage.jsx with profile icons in comments
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
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const CommunityPage = () => {
  const { id } = useParams();
  const { url } = useContext(StoreContext);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [commentInput, setCommentInput] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?._id;
  const socket = io(url);
  const isCreator = community?.createdBy && (community.createdBy._id?.toString() === currentUserId?.toString());
  const [activeTab, setActiveTab] = useState("posts");
  const [showForm, setShowForm] = useState(false);

  const toggleComments = (postId) => {
    setShowAllComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

         setPosts((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            const updatedLikes = liked
              ? [...post.likes, userId]
              : post.likes.filter((id) => id !== userId);
            return { ...post, likes: updatedLikes };
          }
          return post;
        })
      );

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


  const handleDeleteCommunity = async () => {
  if (!window.confirm("Are you sure you want to delete this community?")) return;

  try {
    const res = await axios.delete(`${url}/api/community/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.success) {
      toast.success("Community deleted");
      window.location.href = "/communities"; // or use navigate("/communities")
    }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete community");
    }
  };

const handleDeletePost = async (postId) => {
  if (!window.confirm("Delete this post?")) return;

  try {
    const res = await axios.delete(`${url}/api/community/${id}/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };


  // Helper function to render profile icon
  const renderProfileIcon = (author) => {
    if (author?.profileImage?.url) {
      return (
        <img 
          src={author.profileImage.url} 
          alt={author.name} 
          className="comment-profile-icon"
        />
      );
    } else {
      return (
        <div className="comment-profile-icon">
          <FontAwesomeIcon icon={faUser} />
        </div>
      );
    }
  };



  const handleGalleryUpload = async () => {
      if (!newPost.trim() && !image) {
        return toast.warning("Comment or media is required");
      }
  
      const formData = new FormData();
      formData.append("comment", newPost);
      if (image) formData.append("media", image);
  
      try {
        const res = await axios.post(
          `${url}/api/community/${id}/gallery/upload`,
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
          toast.success("Media uploaded successfully");
  
          const updatedCommunity = await axios.get(`${url}/api/community/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (updatedCommunity.data.success) {
            setCommunity(updatedCommunity.data.community);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Error uploading media");
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
          {isCreator && (
            <button
              className="delete-community-btn"
              onClick={handleDeleteCommunity}
            >
              Delete Community
            </button>
          )}

          <div className="stats">
            <span>{community.members.length} Members</span>
            <span>{posts.reduce((sum, p) => sum + p.likes.length, 0)} Likes</span>
          </div>
        </div>
      </div>

      {isCreator && (
        <>
          <button
            className="post-toggle-btn"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Cancel" : "Create Post"}
          </button>
          {showForm && (
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
          )}
        </>
      )}

      <div className="community-tabs">
        <button
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={activeTab === "gallery" ? "active" : ""}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery
        </button>
      </div>
      
      {activeTab === "posts" && (
      <div className="community-posts">
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-image-container">
                {post.image?.url && (
                  <img src={post.image.url} alt="Post" className="post-img" />
                )}
              </div>
              
              <div className="post-content">
                {(post.author?._id === currentUserId || isCreator) && (
                  <button
                    className="delete-post-btn"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete
                  </button>
                )}

                {post.text && <p className="post-text">{post.text}</p>}
                <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                
                <div className="post-actions">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`action-btn ${
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
                  <button className="action-btn"
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

                <div className="comment-section">
                  {post.comments?.length > 0 && (
                    <div className="comments-list">
                      {(showAllComments[post._id] ? post.comments : post.comments.slice(0, 1)).map((cmt, index) => (
                        <div className="comment-item" key={index}>
                          {renderProfileIcon(cmt.author)}
                          <div className="comment-content">
                            <Link
                              to={`/user/${cmt.author?._id}`}
                              className="comment-author"
                            >
                              {cmt.author?.name || "User"}
                            </Link>
                            <span className="comment-text">{cmt.text}</span>
                          </div>
                        </div>
                      ))}
                      
                      {post.comments.length > 1 && (
                        <button
                          className="view-comments-btn"
                          onClick={() => toggleComments(post._id)}
                        >
                          {showAllComments[post._id] 
                            ? "View less comments"
                            : `View ${post.comments.length - 1} more comment${post.comments.length - 1 === 1 ? '' : 's'}`
                          }
                        </button>
                      )}
                    </div>
                  )}

                  {commentInput[post._id] && (
                    <div className="comment-box">
                      <input
                        type="text"
                        className="comment-input"
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
                        className="comment-btn"
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      )}
{activeTab === "gallery" && (
        <div className="community-gallery">
          <h3>Event Gallery</h3>

          <div className="gallery-upload-form">
            <textarea
              placeholder="Write a comment about this event..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleImageChange}
            />
            {preview && (
              <div className="preview-wrapper">
                {image?.type?.startsWith("video") ? (
                  <video src={preview} controls />
                ) : (
                  <img src={preview} alt="preview" />
                )}
              </div>
            )}
            <button onClick={handleGalleryUpload}>Upload</button>
          </div>

          <div className="gallery-grid">
            {community.gallery && community.gallery.length > 0 ? (
              community.gallery.map((item, index) => (
                <div key={index} className="gallery-card">
                  {item.url.endsWith(".mp4") || item.url.includes("video") ? (
                    <video src={item.url} controls />
                  ) : (
                    <img src={item.url} alt="gallery" />
                  )}
                  <div className="gallery-meta">
                    <p className="comment">{item.comment}</p>
                    <p className="author">
                      Uploaded by: {item.uploadedBy?.name || "User"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No media yet. Be the first to post!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;