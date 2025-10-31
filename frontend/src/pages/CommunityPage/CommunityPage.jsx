"use client"

import { useContext, useEffect, useState, useCallback, useMemo } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { io } from "socket.io-client"
import { toast } from "react-toastify"
import { StoreContext } from "../../context/StoreContext"
import "./CommunityPage.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faHeart as solidHeart, 
  faUser, 
  faBell, 
  faSignOutAlt, 
  faTrash, 
  faImage, 
  faPaperPlane, 
  faComment, 
  faUsers, 
  faCompass,
  faUserGroup,
  faThumbsUp,
  faTicketAlt,
  faPhotoVideo,
  faMessage
} from "@fortawesome/free-solid-svg-icons"
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"
import ChatRoom from "./ChatRoom.jsx"
import DiscoverTab from "../../components/DiscoverTab/DiscoverTab"
import { motion, AnimatePresence } from "framer-motion"

const CommunityPage = () => {
  const { id } = useParams()
  const { url } = useContext(StoreContext)
  const navigate = useNavigate()
  
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))
  const currentUserId = user?._id

  const [community, setCommunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const [activeTab, setActiveTab] = useState("announcements")
  const [showForm, setShowForm] = useState(false)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)

  const socket = useMemo(() => io(url), [url])

  const isCreator = useMemo(
    () => community?.createdBy && community.createdBy._id?.toString() === currentUserId?.toString(),
    [community, currentUserId]
  )

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchAllData()
  }, [id, token, url])

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let communityData = null
      try {
        const communityRes = await axios.get(`${url}/api/community/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (communityRes.data.success) {
          communityData = communityRes.data.community
          setCommunity(communityData)
        }
      } catch (err) {
        setError("Failed to load community")
        toast.error("Failed to load community")
        console.error("Community fetch error:", err)
      }

      try {
        const postsRes = await axios.get(`${url}/api/community/${id}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (postsRes.data.success) {
          setPosts(postsRes.data.posts)
        }
      } catch (err) {
        console.error("Posts fetch error:", err)
      }

      try {
        const communitiesRes = await axios.get(`${url}/api/user/communities`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (communitiesRes.data.success) {
          setJoinedCommunities(communitiesRes.data.communities)
        }
      } catch (err) {
        console.error("Communities fetch error:", err)
      }

      try {
        const recommendedRes = await axios.get(`${url}/api/community/recommended`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (recommendedRes.data.success) {
          setRecommendedCommunities(recommendedRes.data.communities)
        }
      } catch (err) {
        console.error("Recommended communities fetch error:", err)
      }

      try {
        const followedRes = await axios.get(`${url}/api/user/followed`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (followedRes.data.success) {
          setFollowedUsers(followedRes.data.users)
        }
      } catch (err) {
        console.error("Followed users fetch error:", err)
      }
    } finally {
      setLoading(false)
    }
  }, [id, token, url])

  useEffect(() => {
    const handlePostCreated = (post) => {
      if (post.community === id) {
        setPosts((prev) => [post, ...prev])
        toast.success("New announcement posted!")
      }
    }

    const handlePostLiked = ({ postId, userId, liked }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: liked ? [...p.likes, userId] : p.likes.filter((id) => id !== userId) }
            : p
        )
      )
    }

    const handleCommentAdded = ({ postId, comment }) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, comments: [...p.comments, comment] } : p))
      )
    }

    socket.on("postCreated", handlePostCreated)
    socket.on("postLiked", handlePostLiked)
    socket.on("commentAdded", handleCommentAdded)

    return () => {
      socket.off("postCreated", handlePostCreated)
      socket.off("postLiked", handlePostLiked)
      socket.off("commentAdded", handleCommentAdded)
    }
  }, [id, socket])

  const handleLike = useCallback(
    async (postId) => {
      try {
        const res = await axios.post(
          `${url}/api/community/${id}/post/${postId}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (res.data.success) {
          const { userId, liked } = res.data
          socket.emit("likePost", { postId, userId, liked })

          setPosts((prev) =>
            prev.map((post) =>
              post._id === postId
                ? { ...post, likes: liked ? [...post.likes, userId] : post.likes.filter((id) => id !== userId) }
                : post
            )
          )
        }
      } catch (err) {
        toast.error("Error liking post")
        console.error(err)
      }
    },
    [id, url, token, socket]
  )

  const handleComment = useCallback(
    async (postId, text) => {
      if (!text.trim()) {
        toast.warning("Comment can't be empty")
        return
      }

      try {
        const res = await axios.post(
          `${url}/api/community/${id}/post/${postId}/comment`,
          { text },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (res.data.success) {
          setPosts((prev) =>
            prev.map((post) =>
              post._id === postId ? { ...post, comments: [...post.comments, res.data.comment] } : post
            )
          )

          socket.emit("newComment", {
            postId,
            comment: res.data.comment,
          })

          toast.success("Comment added!")
        }
      } catch (err) {
        toast.error("Error adding comment")
        console.error(err)
      }
    },
    [id, url, token, socket]
  )

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }, [])

  const handlePostSubmit = useCallback(async () => {
    if (!newPost.trim() && !image) {
      toast.warning("Post can't be empty")
      return
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
        setShowForm(false)
      }
    } catch (err) {
      toast.error("Error adding post")
      console.error(err)
    }
  }, [newPost, image, id, url, token, socket])

  const handleDeleteCommunity = useCallback(async () => {
    if (!window.confirm("Are you sure you want to delete this community? This action cannot be undone.")) return

    try {
      const res = await axios.delete(`${url}/api/community/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data.success) {
        toast.success("Community deleted")
        navigate("/community")
      }
    } catch (err) {
      toast.error("Failed to delete community")
      console.error(err)
    }
  }, [id, url, token, navigate])

  const handleDeletePost = useCallback(
    async (postId) => {
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
        toast.error("Failed to delete post")
        console.error(err)
      }
    },
    [id, url, token]
  )

  const handleDeleteComment = useCallback(
    async (postId, commentId) => {
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
                ? { ...post, comments: post.comments.filter((cmt) => cmt._id !== commentId) }
                : post
            )
          )
        }
      } catch (err) {
        toast.error("Failed to delete comment")
        console.error(err)
      }
    },
    [id, url, token]
  )

  const handleDeleteGalleryItem = useCallback(
    async (itemId) => {
      if (!window.confirm("Delete this item?")) return

      try {
        const res = await axios.delete(`${url}/api/community/${id}/gallery/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.data.success) {
          setCommunity((prev) => ({
            ...prev,
            gallery: prev.gallery.filter((item) => item._id !== itemId),
          }))
          toast.success("Item deleted")
        }
      } catch (err) {
        toast.error("Failed to delete item")
        console.error(err)
      }
    },
    [id, url, token]
  )

  const handleGalleryUpload = useCallback(async () => {
    if (!newPost.trim() && !image) {
      toast.warning("Comment or media is required")
      return
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
      toast.error("Error uploading media")
      console.error(err)
    }
  }, [newPost, image, id, url, token])

  const handleSendDM = useCallback(async () => {
    if (!dmInput.trim() || !selectedDMUser) return

    try {
      const res = await axios.post(
        `${url}/api/messages/send`,
        { recipientId: selectedDMUser._id, message: dmInput },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.data.success) {
        setDmMessages((prev) => ({
          ...prev,
          [selectedDMUser._id]: [...(prev[selectedDMUser._id] || []), res.data.message],
        }))
        setDmInput("")
      }
    } catch (err) {
      toast.error("Failed to send message")
      console.error(err)
    }
  }, [dmInput, selectedDMUser, url, token])

  const renderProfileIcon = useCallback((author) => {
    if (author?.profileImage?.url) {
      return <img src={author.profileImage.url} alt={author.name} className="comment-profile-icon" />
    }
    return (
      <div className="comment-profile-icon">
        <FontAwesomeIcon icon={faUser} />
      </div>
    )
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div className="spinner" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} />
        <p>Loading community...</p>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="error-container">
        <h2>Community Not Found</h2>
        <p>{error || "Unable to load this community"}</p>
        <motion.button 
          onClick={() => navigate("/community")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Communities
        </motion.button>
      </div>
    )
  }

  return (
    <div className="community-page-container">
      {/* Enhanced Header Section */}
      <div className="community-hero-section">
        <div className="community-hero-content">
          <div className="hero-main-info">
            <motion.div 
              className="community-avatar"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img 
                src={community.image?.url || "/default-community.jpg"} 
                alt={community.name}
              />
            </motion.div>
            
            <div className="hero-text-content">
              <motion.h1 
                className="community-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {community.name}
              </motion.h1>
              
              <motion.p 
                className="community-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {community.description || "A community for like-minded people to connect and share"}
              </motion.p>
              
              <motion.div 
                className="community-stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="stat-item">
                  <FontAwesomeIcon icon={faUserGroup} className="stat-icon" />
                  <span className="stat-value">{community.members?.length || 0}</span>
                  <span className="stat-label">Members</span>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="hero-actions">
            {isCreator && (
              <motion.button 
                className="delete-community-btn"
                onClick={handleDeleteCommunity}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete Community
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Removed Chat */}
      <div className="community-nav-tabs">
        <div className="nav-tabs-container">
          <button 
            className={`nav-tab ${activeTab === "announcements" ? "active" : ""}`}
            onClick={() => setActiveTab("announcements")}
          >
            <FontAwesomeIcon icon={faComment} />
            Announcements
          </button>
          
          <button 
            className={`nav-tab ${activeTab === "gallery" ? "active" : ""}`}
            onClick={() => setActiveTab("gallery")}
          >
            <FontAwesomeIcon icon={faPhotoVideo} />
            Gallery
          </button>

          <button 
            className={`nav-tab ${activeTab === "discover" ? "active" : ""}`}
            onClick={() => setActiveTab("discover")}
          >
            <FontAwesomeIcon icon={faCompass} />
            Discover
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="community-main-content">
        <div className="content-grid">
          {/* Left Sidebar - Community Members */}
          <aside className="community-sidebar-left">
            <div className="sidebar-card members-sidebar">
              <h3>
                <FontAwesomeIcon icon={faUsers} />
                Community Members
              </h3>
              <div className="members-list-sidebar">
                {community.members?.slice(0, 10).map((member, index) => (
                  <div key={index} className="member-list-item">
                    {member.profileImage?.url ? (
                      <img src={member.profileImage.url} alt={member.name} className="member-list-avatar" />
                    ) : (
                      <div className="member-list-avatar">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                    )}
                    <div className="member-list-info">
                      <span className="member-list-name">{member.name}</span>
                      <span className="member-list-status">Online</span>
                    </div>
                  </div>
                ))}
                {community.members?.length > 10 && (
                  <button 
                    className="view-all-members-btn"
                    onClick={() => setShowMembersModal(true)}
                  >
                    View All {community.members.length} Members
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="community-content-area">
            {activeTab === "announcements" && (
              <div className="announcements-tab">
                {isCreator && (
                  <div className="create-post-section">
                    <button 
                      className="create-post-btn"
                      onClick={() => setShowForm(!showForm)}
                    >
                      <FontAwesomeIcon icon={faComment} />
                      {showForm ? "Cancel" : "Create Announcement"}
                    </button>

                    <AnimatePresence>
                      {showForm && (
                        <motion.div
                          className="post-form"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="What's on your mind?"
                            className="post-textarea"
                          />
                          {preview && (
                            <img src={preview} alt="preview" className="preview-image" />
                          )}
                          <div className="post-form-actions">
                            <label className="image-upload-btn">
                              <FontAwesomeIcon icon={faImage} />
                              Add Image
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange}
                                hidden 
                              />
                            </label>
                            <button 
                              className="submit-post-btn"
                              onClick={handlePostSubmit}
                            >
                              <FontAwesomeIcon icon={faPaperPlane} />
                              Post
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="posts-feed">
                  {posts.length === 0 ? (
                    <div className="no-posts">
                      <FontAwesomeIcon icon={faComment} />
                      <h3>No announcements yet</h3>
                      <p>Be the first to share something with the community!</p>
                    </div>
                  ) : (
                    posts.map((post, index) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        currentUserId={currentUserId}
                        isCreator={isCreator}
                        onLike={handleLike}
                        onComment={handleComment}
                        onDeletePost={handleDeletePost}
                        onDeleteComment={handleDeleteComment}
                        commentInput={commentInput}
                        setCommentInput={setCommentInput}
                        showAllComments={showAllComments}
                        setShowAllComments={setShowAllComments}
                        renderProfileIcon={renderProfileIcon}
                        index={index}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <GalleryTab
                community={community}
                newPost={newPost}
                setNewPost={setNewPost}
                image={image}
                onImageChange={handleImageChange}
                preview={preview}
                onUpload={handleGalleryUpload}
                onDeleteItem={handleDeleteGalleryItem}
              />
            )}

            {activeTab === "discover" && (
              <div className="discover-tab">
                <DiscoverTab />
              </div>
            )}
          </main>

          {/* Right Sidebar - Chat Section */}
          <aside className="community-sidebar-right">
            <div className="sidebar-card chat-sidebar">
              <h3>
                <FontAwesomeIcon icon={faMessage} />
                Community Chat
              </h3>
              <div className="chat-container">
                <ChatRoom 
                  apiBase={url} 
                  communityId={id} 
                  token={token} 
                  currentUserId={currentUserId} 
                  theme="light" 
                  compact={true}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Chat Floating Button */}
      <div className="mobile-chat-floating">
        <motion.button
          className="chat-floating-btn"
          onClick={() => setShowChatModal(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={faMessage} />
        </motion.button>
      </div>

      {/* Members Modal */}
      <AnimatePresence>
        {showMembersModal && (
          <MembersModal
            members={community.members}
            onClose={() => setShowMembersModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Chat Modal */}
      <AnimatePresence>
        {showChatModal && (
          <MobileChatModal
            onClose={() => setShowChatModal(false)}
            apiBase={url}
            communityId={id}
            token={token}
            currentUserId={currentUserId}
          />
        )}
      </AnimatePresence>

      {/* DM Chat Modal */}
      <AnimatePresence>
        {selectedDMUser && (
          <DMChatModal
            user={selectedDMUser}
            messages={dmMessages[selectedDMUser._id] || []}
            input={dmInput}
            setInput={setDmInput}
            onSend={handleSendDM}
            onClose={() => setSelectedDMUser(null)}
            currentUserId={currentUserId}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Post Card Component
const PostCard = ({
  post,
  currentUserId,
  isCreator,
  onLike,
  onComment,
  onDeletePost,
  onDeleteComment,
  commentInput,
  setCommentInput,
  showAllComments,
  setShowAllComments,
  renderProfileIcon,
  index,
}) => (
  <motion.div
    className="post-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <div className="post-header">
      <div className="post-author">
        {renderProfileIcon(post.author)}
        <div className="author-info">
          <span className="author-name">{post.author.name}</span>
          <span className="post-time">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      {(post.author?._id === currentUserId || isCreator) && (
        <button 
          className="delete-post-btn"
          onClick={() => onDeletePost(post._id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      )}
    </div>

    {post.text && <p className="post-content">{post.text}</p>}
    
    {post.image?.url && (
      <img src={post.image.url} alt="Post" className="post-image" />
    )}

    <div className="post-actions">
      <button
        className={`like-btn ${post.likes.includes(currentUserId) ? "liked" : ""}`}
        onClick={() => onLike(post._id)}
      >
        <FontAwesomeIcon 
          icon={post.likes.includes(currentUserId) ? solidHeart : regularHeart} 
        />
        <span>{post.likes.length}</span>
      </button>
      
      <button
        className="comment-btn"
        onClick={() => setCommentInput(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
      >
        <FontAwesomeIcon icon={faComment} />
        <span>{post.comments?.length || 0}</span>
      </button>
    </div>

    {/* Comments Section */}
    {post.comments && post.comments.length > 0 && (
      <div className="comments-section">
        <div className="comments-list">
          {(showAllComments[post._id] ? post.comments : post.comments.slice(0, 2)).map((comment, idx) => (
            <div key={idx} className="comment-item">
              {renderProfileIcon(comment.author)}
              <div className="comment-content">
                <span className="comment-author">{comment.author.name}</span>
                <p className="comment-text">{comment.text}</p>
              </div>
              {(comment.author?._id === currentUserId || isCreator) && (
                <button
                  className="delete-comment-btn"
                  onClick={() => onDeleteComment(post._id, comment._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          ))}
        </div>

        {post.comments.length > 2 && (
          <button
            className="view-comments-btn"
            onClick={() => setShowAllComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
          >
            {showAllComments[post._id] ? "Show less" : `View all ${post.comments.length} comments`}
          </button>
        )}
      </div>
    )}

    {/* Comment Input */}
    {commentInput[post._id] && (
      <div className="comment-input-section">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentInput[`${post._id}_text`] || ""}
          onChange={(e) => setCommentInput(prev => ({
            ...prev,
            [`${post._id}_text`]: e.target.value
          }))}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const text = commentInput[`${post._id}_text`]?.trim()
              if (text) {
                onComment(post._id, text)
                setCommentInput(prev => ({ ...prev, [`${post._id}_text`]: "" }))
              }
            }
          }}
          className="comment-input"
        />
        <button
          className="send-comment-btn"
          onClick={() => {
            const text = commentInput[`${post._id}_text`]?.trim()
            if (text) {
              onComment(post._id, text)
              setCommentInput(prev => ({ ...prev, [`${post._id}_text`]: "" }))
            }
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    )}
  </motion.div>
)

// Gallery Tab Component
const GalleryTab = ({
  community,
  newPost,
  setNewPost,
  image,
  onImageChange,
  preview,
  onUpload,
  onDeleteItem,
}) => (
  <div className="gallery-tab">
    <div className="gallery-upload-section">
      <textarea
        placeholder="Add a caption for your media..."
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        className="gallery-caption-input"
      />
      <div className="upload-controls">
        <label className="media-upload-btn">
          <FontAwesomeIcon icon={faImage} />
          Choose Media
          <input 
            type="file" 
            accept="image/*,video/*" 
            onChange={onImageChange}
            hidden 
          />
        </label>
        <button className="upload-media-btn" onClick={onUpload}>
          <FontAwesomeIcon icon={faPaperPlane} />
          Upload
        </button>
      </div>
      {preview && (
        <div className="media-preview">
          {image?.type?.startsWith('video') ? (
            <video src={preview} controls />
          ) : (
            <img src={preview} alt="Preview" />
          )}
        </div>
      )}
    </div>

    <div className="gallery-grid">
      {community.gallery && community.gallery.length > 0 ? (
        community.gallery.map((item, index) => (
          <div key={index} className="gallery-item">
            {item.url.includes('video') ? (
              <video src={item.url} controls />
            ) : (
              <img src={item.url} alt="Gallery item" />
            )}
            <div className="gallery-item-overlay">
              <button 
                className="delete-gallery-item"
                onClick={() => onDeleteItem(item._id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="no-gallery">
          <FontAwesomeIcon icon={faPhotoVideo} />
          <h3>No media yet</h3>
          <p>Share your first photo or video with the community!</p>
        </div>
      )}
    </div>
  </div>
)

// Members Modal Component
const MembersModal = ({ members, onClose }) => (
  <motion.div
    className="modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="members-modal"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2>Community Members</h2>
        <button className="close-modal" onClick={onClose}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="members-list">
        {members.map((member, index) => (
          <div key={index} className="member-item">
            {member.profileImage?.url ? (
              <img src={member.profileImage.url} alt={member.name} />
            ) : (
              <div className="member-avatar">
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
            <div className="member-info">
              <span className="member-name">{member.name}</span>
              <span className="member-email">{member.email}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
)

// Mobile Chat Modal Component
const MobileChatModal = ({ onClose, apiBase, communityId, token, currentUserId }) => (
  <motion.div
    className="modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="mobile-chat-modal"
      initial={{ scale: 0.9, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 50 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2>Community Chat</h2>
        <button className="close-modal" onClick={onClose}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="mobile-chat-container">
        <ChatRoom 
          apiBase={apiBase} 
          communityId={communityId} 
          token={token} 
          currentUserId={currentUserId} 
          theme="light" 
          compact={false}
        />
      </div>
    </motion.div>
  </motion.div>
)

// DM Chat Modal Component
const DMChatModal = ({ user, messages, input, setInput, onSend, onClose, currentUserId }) => (
  <motion.div
    className="modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="dm-chat-modal"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <div className="dm-user-info">
          {user.profileImage?.url ? (
            <img src={user.profileImage.url} alt={user.name} />
          ) : (
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
          )}
          <span>{user.name}</span>
        </div>
        <button className="close-modal" onClick={onClose}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      
      <div className="dm-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`dm-message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}
          >
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      
      <div className="dm-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSend()
            }
          }}
        />
        <button onClick={onSend}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </motion.div>
  </motion.div>
)

export default CommunityPage