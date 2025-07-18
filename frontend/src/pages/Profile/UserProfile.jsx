import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "./UserProfile.css";
import { StoreContext } from "../../context/StoreContext";
import {
  FiEdit2,
  FiMessageSquare,
  FiUsers,
  FiCalendar,
  FiMapPin,
  FiCamera,
} from "react-icons/fi";

const UserProfile = () => {
  const { userId } = useParams();
  const { url, user: currentUser, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [userMemories, setUserMemories] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("events");
  const [followTab, setFollowTab] = useState("followers");

  const isOwnProfile = currentUser && currentUser._id === user?._id;
  const isLoggedIn = !!currentUser;
  const isEventHost = user?.role === "eventHost";

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId, currentUser]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchFollowData();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${url}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message || "User not found");

      setUser(data.user);
      setFollowersCount(data.user.followers.length);
      setFollowingCount(data.user.following.length);
      setIsFollowing(data.user.followers.includes(currentUser?._id));

      setIsFollowing(
        currentUser &&
          data.user.followers.some((follower) =>
            typeof follower === "string"
              ? follower === currentUser._id
              : follower._id === currentUser._id
          )
      );

      if (data.user.role === "eventHost") {
        fetchUserEvents();
      }
      fetchUserMemories();
      fetchUserCommunities();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowData = async () => {
    try {
      const resFollowers = await fetch(`${url}/api/user/${userId}/followers`);
      const followersData = await resFollowers.json();
      if (followersData.success) setFollowersList(followersData.followers);

      const resFollowing = await fetch(`${url}/api/user/${userId}/following`);
      const followingData = await resFollowing.json();
      if (followingData.success) setFollowingList(followingData.following);
    } catch (err) {
      console.error("Error fetching followers/following list:", err);
    }
  };

  const fetchUserEvents = async () => {
    try {
      const res = await fetch(`${url}/api/events/organizer/${userId}`);
      const data = await res.json();
      if (data.success) {
        setUserEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching user events:", error);
    }
  };

  const fetchUserMemories = async () => {
    try {
      // Assuming we have an endpoint for user memories
      const res = await fetch(`${url}/api/posts/user/${userId}`);
      const data = await res.json();
      if (data.success) {
        setUserMemories(data.posts);
      }
    } catch (error) {
      console.error("Error fetching user memories:", error);
    }
  };

  const fetchUserCommunities = async () => {
    try {
      // Assuming we have an endpoint for user communities
      const res = await fetch(`${url}/api/community/user/${userId}`);
      const data = await res.json();
      if (data.success) {
        setUserCommunities(data.communities);
      }
    } catch (error) {
      console.error("Error fetching user communities:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !token) {
      toast.error("Please log in to follow users");
      return;
    }

    try {
      const endpoint = isFollowing
        ? `${url}/api/users/${userId}/unfollow`
        : `${url}/api/users/${userId}/follow`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setIsFollowing(!isFollowing);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
      fetchFollowData(); // Refresh lists
      toast.success(isFollowing ? "Unfollowed" : "Followed");
    } catch (error) {
      console.error(error);
      toast.error("Error updating follow status");
    }
  };

  const handleMessageUser = () => {
    if (!currentUser) {
      toast.error("Please log in to send messages");
      return;
    }
    navigate(`/messages/${userId}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "events":
        return renderEvents();
      case "memories":
        return renderMemories();
      case "communities":
        return renderCommunities();
      case "followersFollowing":
        return renderFollowersFollowing();
      default:
        return renderEvents();
    }
  };

  const renderEvents = () => {
    if (!isEventHost || userEvents.length === 0) {
      return (
        <div className="no-content">
          <FiCalendar size={48} />
          <p>
            {isEventHost
              ? `${user.name} hasn't organized any events yet.`
              : `${user.name} is not an event host.`}
          </p>
        </div>
      );
    }

    return (
      <div className="events-grid">
        {userEvents.map((event) => (
          <motion.div
            key={event._id}
            className="event-card"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="event-image">
              <img
                src={event.image || "/event-placeholder.jpg"}
                alt={event.title}
                onError={(e) => {
                  e.target.src = "/event-placeholder.jpg";
                }}
              />
            </div>

            <div className="event-content">
              <h4>{event.title}</h4>
              <div className="event-details">
                <p className="event-date">
                  <FiCalendar /> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="event-location">
                  <FiMapPin /> {event.location}
                </p>
                <p className="event-attendees">
                  <FiUsers /> {event.attendees} attendees
                </p>
              </div>

              <div className="event-actions">
                <button
                  onClick={() => navigate(`/event/${event._id}`)}
                  className="btn btn-primary"
                >
                  View Event
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderMemories = () => {
    if (userMemories.length === 0) {
      return (
        <div className="no-content">
          <FiCamera size={48} />
          <p>{user.name} hasn't shared any memories yet.</p>
          {isOwnProfile && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/create-post")}
            >
              Share Your First Memory
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="memories-grid">
        {userMemories.map((memory) => (
          <motion.div
            key={memory._id}
            className="memory-card"
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate(`/post/${memory._id}`)}
          >
            <img
              src={memory.images[0]?.url || "/memory-placeholder.jpg"}
              alt={memory.caption || "Memory"}
            />
            <div className="memory-overlay">
              <p>{memory.caption?.substring(0, 100)}</p>
              <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderCommunities = () => {
    if (userCommunities.length === 0) {
      return (
        <div className="no-content">
          <FiUsers size={48} />
          <p>{user.name} hasn't joined any communities yet.</p>
          {isOwnProfile && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/communities")}
            >
              Explore Communities
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="communities-grid">
        {userCommunities.map((community) => (
          <motion.div
            key={community._id}
            className="community-card"
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate(`/community/${community._id}`)}
          >
            <img
              src={community.image?.url || "/community-placeholder.jpg"}
              alt={community.name}
            />
            <div className="community-info">
              <h4>{community.name}</h4>
              <p>{community.members?.length || 0} members</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderFollowersFollowing = () => {
    const listToRender =
      followTab === "followers" ? followersList : followingList;

    if (!listToRender.length) {
      return (
        <div className="no-content">
          <FiUsers size={48} />
          <p>
            {followTab === "followers"
              ? `${user.name} has no followers yet.`
              : `${user.name} is not following anyone yet.`}
          </p>
        </div>
      );
    }

    return (
      <div className="follow-list">
        <div className="follow-tab-buttons">
          <button
            className={followTab === "followers" ? "active" : ""}
            onClick={() => setFollowTab("followers")}
          >
            Followers
          </button>
          <button
            className={followTab === "following" ? "active" : ""}
            onClick={() => setFollowTab("following")}
          >
            Following
          </button>
        </div>

        {listToRender.map((person) => (
          <div
            key={person._id}
            className="follow-user"
            onClick={() => navigate(`/user/${person._id}`)}
          >
            <img
              src={person.profileImage?.url || "/profile.jpg"}
              alt={person.name}
              className="follow-avatar"
              onError={(e) => (e.target.src = "/profile.jpg")}
            />
            <span>{person.name}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="user-profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-error">
        <h2>User not found</h2>
        <p>The user you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="user-profile-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: "95px" }}
    >
      <div className="profile-header-wrapper">
        <div className="profile-banner">
          <img
            src={user.bannerImage?.url || "/banner-placeholder.jpg"}
            alt="Profile banner"
          />
          {isOwnProfile && (
            <button
              className="edit-banner-btn"
              onClick={() => navigate("/profile/edit")}
            >
              <FiEdit2 /> Edit Banner
            </button>
          )}
        </div>

        <div className="user-profile-header">
          <div className="profile-avatar">
            <img
              src={user.profileImage?.url || "/profile.jpg"}
              alt={user.name}
              onError={(e) => {
                e.target.src = "/profile.jpg";
              }}
            />
            {isOwnProfile && (
              <button
                className="edit-avatar-btn"
                onClick={() => navigate("/profile/edit")}
              >
                <FiEdit2 />
              </button>
            )}
          </div>

          <div className="profile-info">
            <div className="profile-header-top">
              <h1>{user.name}</h1>
              <div className="profile-actions">
                {isOwnProfile ? (
                  <button
                    onClick={() => navigate("/profile/edit")}
                    className="btn btn-primary"
                  >
                    <FiEdit2 /> Edit Profile
                  </button>
                ) : isLoggedIn ? (
                  <>
                    <button
                      onClick={handleFollowToggle}
                      className={`btn ${
                        isFollowing ? "btn-secondary" : "btn-primary"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                    <button
                      onClick={handleMessageUser}
                      className="btn btn-outline"
                    >
                      <FiMessageSquare /> Message
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-disabled"
                      onClick={() => toast.info("Please login to follow")}
                    >
                      Follow
                    </button>
                    <button
                      className="btn btn-outline btn-disabled"
                      onClick={() => toast.info("Please login to message")}
                    >
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>

            {user.location && (
              <p className="profile-location">
                <FiMapPin /> {user.location}
              </p>
            )}
            {user.bio && <p className="profile-bio">{user.bio}</p>}

            <div className="profile-stats">
              <div
                className="stat"
                onClick={() => setActiveTab("followersFollowing")}
              >
                <span className="stat-number">{followersCount}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div
                className="stat"
                onClick={() => setActiveTab("followersFollowing")}
              >
                <span className="stat-number">{followingCount}</span>
                <span className="stat-label">Following</span>
              </div>
              {isEventHost && (
                <div className="stat">
                  <span className="stat-number">{userEvents.length}</span>
                  <span className="stat-label">Events</span>
                </div>
              )}
              <div className="stat">
                <span className="stat-number">{userMemories.length}</span>
                <span className="stat-label">Memories</span>
              </div>
              <div className="stat">
                <span className="stat-number">{userCommunities.length}</span>
                <span className="stat-label">Communities</span>
              </div>
            </div>

            <div className="profile-meta">
              <p className="join-date">
                Joined: {new Date(user.joinDate).toLocaleDateString()}
              </p>
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content-tabs">
        {isEventHost && (
          <button
            className={`tab ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
        )}
        <button
          className={`tab ${activeTab === "memories" ? "active" : ""}`}
          onClick={() => setActiveTab("memories")}
        >
          Memories
        </button>
        <button
          className={`tab ${activeTab === "communities" ? "active" : ""}`}
          onClick={() => setActiveTab("communities")}
        >
          Communities
        </button>
        {/* Show Followers/Following tab only when active */}
        {activeTab === "followersFollowing" && (
          <button className="tab active" disabled>
            Followers / Following
          </button>
        )}
      </div>

      <div className="user-profile-content">{renderContent()}</div>
    </motion.div>
  );
};

export default UserProfile;
