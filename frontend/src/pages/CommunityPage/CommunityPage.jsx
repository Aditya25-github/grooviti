"use client"

import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { io } from "socket.io-client"
import { toast } from "react-toastify"
import { StoreContext } from "../../context/StoreContext"
import "./CommunityPage.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons"
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import Community from "../Community/Community"
import DiscoverTab from "../../components/DiscoverTab/DiscoverTab"

const CommunityPage = () => {
  const { id } = useParams()
  const { url } = useContext(StoreContext)
  const [community, setCommunity] = useState(null)
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [commentInput, setCommentInput] = useState({})
  const [showAllComments, setShowAllComments] = useState({})
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [recommendedCommunities, setRecommendedCommunities] = useState([])
  const [followedUsers, setFollowedUsers] = useState([])
  const [selectedDMUser, setSelectedDMUser] = useState(null)
  const [dmMessages, setDmMessages] = useState({})
  const [dmInput, setDmInput] = useState("")
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))
  const currentUserId = user?._id
  const socket = io(url)
  const navigate = useNavigate()
  const isCreator = community?.createdBy && community.createdBy._id?.toString() === currentUserId?.toString()
  const [activeTab, setActiveTab] = useState("announcements")
  const [showForm, setShowForm] = useState(false)

  const toggleComments = (postId) => {
    setShowAllComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/api/community/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.success) setCommunity(res.data.community)

        const postsRes = await axios.get(`${url}/api/community/${id}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (postsRes.data.success) setPosts(postsRes.data.posts)

        const communitiesRes = await axios.get(`${url}/api/user/communities`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (communitiesRes.data.success) setJoinedCommunities(communitiesRes.data.communities)

        const recommendedRes = await axios.get(`${url}/api/community/recommended`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (recommendedRes.data.success) setRecommendedCommunities(recommendedRes.data.communities)

        const followedRes = await axios.get(`${url}/api/user/followed`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (followedRes.data.success) setFollowedUsers(followedRes.data.users)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load community")
      }
    }
    fetchData()
  }, [id, token, url])

  useEffect(() => {
    socket.on("postCreated", (post) => {
      if (post.community === id) {
        setPosts((prev) => [post, ...prev])
      }
    })
    socket.on("postLiked", ({ postId, userId, liked }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: liked ? [...p.likes, userId] : p.likes.filter((id) => id !== userId),
              }
            : p,
        ),
      )
    })

    socket.on("commentAdded", ({ postId, comment }) => {
      setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, comments: [...p.comments, comment] } : p)))
    })

    return () => {
      socket.off("postCreated")
      socket.off("postLiked")
      socket.off("commentAdded")
    }
  }, [id, socket])

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `${url}/api/community/${id}/post/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (res.data.success) {
        const { userId, liked } = res.data
        socket.emit("likePost", { postId, userId, liked })

        setPosts((prev) =>
          prev.map((post) => {
            if (post._id === postId) {
              const updatedLikes = liked ? [...post.likes, userId] : post.likes.filter((id) => id !== userId)
              return { ...post, likes: updatedLikes }
            }
            return post
          }),
        )
      }
    } catch (err) {
      console.error(err)
      toast.error("Error toggling like")
    }
  }

  const handleComment = async (postId, text) => {
    if (!text.trim()) return toast.warning("Comment can't be empty")
    try {
      const res = await axios.post(
        `${url}/api/community/${id}/post/${postId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (res.data.success) {
        const newComment = res.data.comment

        setPosts((prev) =>
          prev.map((post) => (post._id === postId ? { ...post, comments: [...post.comments, newComment] } : post)),
        )

        socket.emit("newComment", {
          postId,
          comment: res.data.comment,
        })
        toast.success("Comment added!")
      }
    } catch (err) {
      console.error(err)
      toast.error("Error adding comment")
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handlePostSubmit = async () => {
    if (!newPost.trim() && !image) {
      return toast.warning("Post can't be empty")
    }

    const formData = new FormData()
    formData.append("text", newPost)
    if (image) formData.append("image", image)

    try {
      const res = await axios.post(`${url}/api/community/${id}/post`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (res.data.success) {
        setNewPost("")
        setImage(null)
        setPreview(null)
        toast.success("Post added")
        setPosts((prev) => [res.data.post, ...prev])
        socket.emit("newPost", res.data.post)
      }
    } catch (err) {
      console.error(err)
      toast.error("Error adding post")
    }
  }

  const handleDeleteCommunity = async () => {
    if (!window.confirm("Are you sure you want to delete this community?")) return

    try {
      const res = await axios.delete(`${url}/api/community/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data.success) {
        toast.success("Community deleted")
        navigate("/community")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete community")
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return

    try {
      const res = await axios.delete(`${url}/api/community/${id}/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.data.success) {
        toast.success("Post deleted")
        setPosts((prev) => prev.filter((p) => p._id !== postId))
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete post")
    }
  }

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Delete this comment?")) return
    try {
      const res = await axios.delete(`${url}/api/community/${id}/post/${postId}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data.success) {
        toast.success("Comment deleted")
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: post.comments.filter((cmt) => cmt._id !== commentId),
                }
              : post,
          ),
        )
      }
    } catch (err) {
      console.error("Delete comment failed", err)
      toast.error("Failed to delete comment")
    }
  }


const handleDeleteGalleryItem = async (itemId) => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/community/${community._id}/gallery/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json(); // 👈 parse response for better debug
    if (res.ok) {
      setCommunity((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((item) => item._id !== itemId),
      }));
    } else {
      console.error("Failed to delete gallery item:", data);
      alert(`Delete failed: ${data?.error || data?.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error deleting gallery item:", error);
  }
};






  const handleSendDM = async () => {
    if (!dmInput.trim() || !selectedDMUser) return

    try {
      const res = await axios.post(
        `${url}/api/messages/send`,
        { recipientId: selectedDMUser._id, message: dmInput },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (res.data.success) {
        setDmMessages((prev) => ({
          ...prev,
          [selectedDMUser._id]: [...(prev[selectedDMUser._id] || []), res.data.message],
        }))
        setDmInput("")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to send message")
    }
  }

  const renderProfileIcon = (author) => {
    if (author?.profileImage?.url) {
      return (
        <img src={author.profileImage.url || "/placeholder.svg"} alt={author.name} className="comment-profile-icon" />
      )
    } else {
      return (
        <div className="comment-profile-icon">
          <FontAwesomeIcon icon={faUser} />
        </div>
      )
    }
  }

  const handleGalleryUpload = async () => {
    if (!newPost.trim() && !image) {
      return toast.warning("Comment or media is required")
    }

    const formData = new FormData()
    formData.append("comment", newPost)
    if (image) formData.append("media", image)

    try {
      const res = await axios.post(`${url}/api/community/${id}/gallery/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (res.data.success) {
        setNewPost("")
        setImage(null)
        setPreview(null)
        toast.success("Media uploaded successfully")

        const updatedCommunity = await axios.get(`${url}/api/community/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (updatedCommunity.data.success) {
          setCommunity(updatedCommunity.data.community)
        }
      }
    } catch (err) {
      console.error(err)
      toast.error("Error uploading media")
    }
  }

  if (!community) return <div className="loading">Loading...</div>

  return (
    <div className="community-page-container">
      <aside className="community-sidebar-left">
        <div className="communities-list-card">
          <h3>Communities</h3>
          <div className="search-box">
            <input type="text" placeholder="Search communities..." />
          </div>
          <div className="joined-communities">
            {joinedCommunities.map((comm) => (
              <div
                key={comm._id}
                className={`community-item ${comm._id === id ? "active" : ""}`}
                onClick={() => navigate(`/community/${comm._id}`)}
              >
                <img src={comm.image?.url || "/placeholder.svg"} alt={comm.name} className="community-item-img" />
                <div className="community-item-info">
                  <p className="community-item-name">{comm.name}</p>
                  <span className="community-item-members">{comm.members?.length || 0} online</span>
                </div>
              </div>
            ))}
          </div>

          <div className="recommended-section">
            <h4>Recommended for You</h4>
            {recommendedCommunities.slice(0, 3).map((comm) => (
              <div key={comm._id} className="recommended-item">
                <img src={comm.image?.url || "/placeholder.svg"} alt={comm.name} className="recommended-img" />
                <div className="recommended-info">
                  <p className="recommended-name">{comm.name}</p>
                  <span className="recommended-members">{comm.members?.length || 0} members</span>
                </div>
              </div>
            ))}
          </div>

          <button className="discover-btn">+ Discover Communities</button>
        </div>
      </aside>

      <main className="community-main-panel">
        <div className="community-header-bar">
          <div className="community-header-info">
            <h2>{community.name}</h2>
            <span className="member-count">👥 {community.members.length} members</span>
          </div>
          <div className="header-actions">
            <button className="notification-btn">🔔</button>
            {!isCreator && <button className="leave-btn">Leave</button>}
            {isCreator && (
              <button className="delete-community-btn" onClick={handleDeleteCommunity}>
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "announcements" ? "active" : ""}`}
            onClick={() => setActiveTab("announcements")}
          >
            Announcements
          </button>
          <button className={`tab-btn ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
            Chat
          </button>
          <button
            className={`tab-btn ${activeTab === "gallery" ? "active" : ""}`}
            onClick={() => setActiveTab("gallery")}
          >
            Gallery
          </button>
          <button
            className={`tab-btn ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
          <button
            className={`tab-btn ${activeTab === "discover" ? "active" : ""}`}
            onClick={() => setActiveTab("discover")}
          >
            Discover
          </button>
        </div>

        <div className="tab-content">
          {/* Announcements Tab */}
          {activeTab === "announcements" && (
            <div className="announcements-tab">
              {isCreator && (
                <>
                  <button className="create-post-btn" onClick={() => setShowForm((prev) => !prev)}>
                    {showForm ? "Cancel" : "+ Create Announcement"}
                  </button>
                  {showForm && (
                    <div className="post-form">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="What's on your mind?"
                        className="post-textarea"
                      />
                      {preview && <img src={preview || "/placeholder.svg"} alt="preview" className="preview-img" />}
                      <div className="post-form-actions">
                        <label className="upload-label">
                          📷
                          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                        </label>
                        <button className="post-submit-btn" onClick={handlePostSubmit}>
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="posts-list">
                {posts.length === 0 ? (
                  <p className="no-posts">No announcements yet</p>
                ) : (
                  posts.map((post) => (
                    <div key={post._id} className="post-card">
                      <div className="post-header">
                        <Link to={`/user/${post.author._id}`} className="post-author-link">
                          {post.author.profileImage?.url ? (
                            <img
                              src={post.author.profileImage.url || "/placeholder.svg"}
                              alt={post.author.name}
                              className="post-author-img"
                            />
                          ) : (
                            <div className="post-author-img">
                              <FontAwesomeIcon icon={faUser} />
                            </div>
                          )}
                          <span className="post-author-name">{post.author.name}</span>
                        </Link>
                      </div>

                      {post.image?.url && (
                        <img src={post.image.url || "/placeholder.svg"} alt="Post" className="post-img" />
                      )}

                      <div className="post-content">
                        {(post.author?._id === currentUserId || isCreator) && (
                          <button className="delete-post-btn" onClick={() => handleDeletePost(post._id)}>
                            Delete
                          </button>
                        )}

                        {post.text && <p className="post-text">{post.text}</p>}
                        <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>

                        <div className="post-actions">
                          <button
                            onClick={() => handleLike(post._id)}
                            className={`actioon-btn ${post.likes.includes(currentUserId) ? "liked" : ""}`}
                          >
                            <FontAwesomeIcon
                              icon={post.likes.includes(currentUserId) ? solidHeart : regularHeart}
                              className="heart-icon"
                            />
                            {post.likes.length}
                          </button>
                          <button
                            className="actioon-btn"
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
                              {(showAllComments[post._id] ? post.comments : post.comments.slice(0, 1)).map(
                                (cmt, index) => (
                                  <div className="comment-item" key={index}>
                                    {renderProfileIcon(cmt.author)}
                                    <div className="comment-content">
                                      <Link to={`/user/${cmt.author?._id}`} className="comment-author">
                                        {cmt.author?.name || "User"}
                                      </Link>
                                      <span className="comment-text">{cmt.text}</span>
                                    </div>
                                    <div className="comment-actions">
                                      {(cmt.author?._id === currentUserId || isCreator) && (
                                        <button
                                          className="delete-comment-btn"
                                          onClick={() => handleDeleteComment(post._id, cmt._id)}
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}

                              {post.comments.length > 1 && (
                                <button className="view-comments-btn" onClick={() => toggleComments(post._id)}>
                                  {showAllComments[post._id]
                                    ? "View less comments"
                                    : `View ${post.comments.length - 1} more comment${
                                        post.comments.length - 1 === 1 ? "" : "s"
                                      }`}
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
                                    e.preventDefault()
                                    const text = commentInput[`${post._id}_text`]?.trim()
                                    if (text) {
                                      handleComment(post._id, text)
                                      setCommentInput((prev) => ({
                                        ...prev,
                                        [`${post._id}_text`]: "",
                                      }))
                                    }
                                  }
                                }}
                              />
                              <button
                                className="comment-btn"
                                onClick={() => {
                                  const text = commentInput[`${post._id}_text`]?.trim()
                                  if (text) {
                                    handleComment(post._id, text)
                                    setCommentInput((prev) => ({
                                      ...prev,
                                      [`${post._id}_text`]: "",
                                    }))
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
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="chat-tab">
              <div className="chat-placeholder">
                <p>💬 Community chat coming soon</p>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <div className="gallery-tab">
              <div className="gallery-upload-form">
                <textarea
                  placeholder="Write a comment about this event..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="gallery-textarea"
                />
                <input type="file" accept="image/*,video/*" onChange={handleImageChange} />
                {preview && (
                  <div className="preview-wrapper">
                    {image?.type?.startsWith("video") ? (
                      <video src={preview} controls />
                    ) : (
                      <img src={preview || "/placeholder.svg"} alt="preview" />
                    )}
                  </div>
                )}
                <button className="gallery-upload-btn" onClick={handleGalleryUpload}>
                  Upload
                </button>
              </div>

              {/* Gallery grid */}
            <div className="gallery-grid">
              {community.gallery && community.gallery.length > 0 ? (
                community.gallery.map((item, index) => (
                  <div key={index} className="gallery-item">
                    {item.url.endsWith(".mp4") || item.url.includes("video") ? (
                      <video src={item.url} className="gallery-media" controls />
                    ) : (
                      <img src={item.url || "/placeholder.svg"} alt="gallery" className="gallery-media" />
                    )}

                    {/* Hover overlay */}
                    <div className="gallery-overlay">
                      <span className="uploader-name">
                        {item.uploadedBy?.name || "Unknown User"}
                      </span>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteGalleryItem(item._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-gallery">No media yet. Be the first to post!</p>
              )}
            </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="members-tab">
              <div className="members-grid">
                {community.members && community.members.length > 0 ? (
                  community.members.map((member, index) => (
                    <div key={index} className="member-card">
                      {member.profileImage?.url ? (
                        <img
                          src={member.profileImage.url || "/placeholder.svg"}
                          alt={member.name}
                          className="member-avatar"
                        />
                      ) : (
                        <div className="member-avatar">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                      )}
                      <h4 className="member-name">{member.name}</h4>
                      {/* <p className="member-email">{member.email}</p> */}
                    </div>
                  ))
                ) : (
                  <p className="no-members">No members yet</p>
                )}
              </div>
            </div>
          )}

          {/* Discover Tab */}
          {activeTab === "discover" && (
            <div className="discover-tab">
              {/* <div className="discover-grid">
                {recommendedCommunities.map((comm) => (
                  <div key={comm._id} className="discover-card">
                    <img src={comm.image?.url || "/placeholder.svg"} alt={comm.name} className="discover-card-img" />
                    <div className="discover-card-content">
                      <h4>{comm.name}</h4>
                      <p className="discover-description">{comm.description}</p>
                      <div className="discover-stats">
                        <span>{comm.members?.length || 0} members</span>
                      </div>
                      <button className="discover-join-btn">Join</button>
                    </div>
                  </div>
                ))}
              </div> */}
              {/* <div className="chat-placeholder">
                <p> This feature is coming soon ! </p>
                <p> Stay Tuned </p>
              </div> */}
              <DiscoverTab />
            </div>
          )}
        </div>
      </main>

      <aside className="community-sidebar-right">
        <div className="dm-card">
          <h3>Direct Messages</h3>
          <div className="dm-search">
            <input type="text" placeholder="Search messages..." />
          </div>
          <div className="followed-users-list">
            {followedUsers.map((followedUser) => (
              <div
                key={followedUser._id}
                className={`dm-user-item ${selectedDMUser?._id === followedUser._id ? "active" : ""}`}
                onClick={() => setSelectedDMUser(followedUser)}
              >
                {followedUser.profileImage?.url ? (
                  <img
                    src={followedUser.profileImage.url || "/placeholder.svg"}
                    alt={followedUser.name}
                    className="dm-user-avatar"
                  />
                ) : (
                  <div className="dm-user-avatar">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                )}
                <div className="dm-user-info">
                  <p className="dm-user-name">{followedUser.name}</p>
                  <span className="dm-user-status">Active now</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedDMUser && (
          <div className="dm-chat-card">
            <div className="dm-chat-header">
              <h4>{selectedDMUser.name}</h4>
            </div>
            <div className="dm-messages">
              {(dmMessages[selectedDMUser._id] || []).map((msg, index) => (
                <div key={index} className={`dm-message ${msg.senderId === currentUserId ? "sent" : "received"}`}>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="dm-input-box">
              <input
                type="text"
                placeholder="Type a message..."
                value={dmInput}
                onChange={(e) => setDmInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendDM()
                  }
                }}
              />
              <button onClick={handleSendDM}>➤</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}

export default CommunityPage
