import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiUpload,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiUsers,
  FiMail,
} from "react-icons/fi";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./MyProfile.css";

const MyProfile = () => {
  const { token, url, isLoggedIn, isLoading } = useContext(StoreContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    location: "",
    bio: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!token || !isLoggedIn) {
      setLoading(false);
      toast.error("Please login to view your profile");
      navigate("/");
      return;
    }

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    const fetchProfileData = async () => {
      try {
        const res = await axios.get(`${url}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data.user);
        setFormData({
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone || "",
          gender: res.data.user.gender || "",
          dob: res.data.user.dob || "",
          location: res.data.user.location || "",
          bio: res.data.user.bio || "",
          twitter: res.data.user.twitter || "",
          instagram: res.data.user.instagram || "",
          linkedin: res.data.user.linkedin || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, isLoggedIn, url, navigate, isLoading]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
      if (profileImage) formDataToSend.append("profileImage", profileImage);

      const res = await axios.put(`${url}/api/users/profile`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUserData(res.data.user);
      toast.success("Profile updated successfully");
      setEditMode(false);
      setPreview(null);
      setProfileImage(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "events":
        return (
          <div className="events-grid">
            {userData?.events?.length > 0 ? (
              userData.events.map((event) => (
                <div key={event._id} className="event-card">
                  <img src={event.image} alt={event.name} />
                  <div className="event-info">
                    <h4>{event.name}</h4>
                    <p>
                      <FiMapPin /> {event.location}
                    </p>
                    <p>
                      <FiCalendar /> {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events">
                <p>No events to display</p>
              </div>
            )}
          </div>
        );
      case "communities":
        return (
          <div className="communities-grid">
            {userData?.communities?.length > 0 ? (
              userData.communities.map((community) => (
                <div key={community._id} className="community-card">
                  <img src={community.image} alt={community.name} />
                  <h4>{community.name}</h4>
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/community/${community._id}`)}
                  >
                    View Community
                  </button>
                </div>
              ))
            ) : (
              <div className="no-communities">
                <p>No communities to display</p>
              </div>
            )}
          </div>
        );
      case "followers":
        return (
          <div className="connections-grid">
            {userData?.followers?.length > 0 ? (
              userData.followers.map((follower, i) => (
                <div key={i} className="connection-card">
                  <img
                    src={
                      follower.profileImage?.url || `/user${(i % 4) + 1}.jpg`
                    }
                    alt={`Follower ${i}`}
                  />
                  <h4>{follower.name}</h4>
                  <p>{follower.location || "No location"}</p>
                  <button className="follow-btn">Following</button>
                </div>
              ))
            ) : (
              <div className="no-followers">
                <p>No followers to display</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="error-container">
        <h2>Profile Not Found</h2>
        <p>We couldn't load your profile information.</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="profile-container" style={{ paddingTop: "95px" }}>
      {/* Profile Header */}
      <div className="profile-header">
        <div className="cover-photo"></div>

        <div className="profile-info-section">
          <div className="avatar-container">
            <img
              src={preview || userData.profileImage?.url || "/profile.jpg"}
              alt="Profile"
              className="profile-avatar"
            />
            {editMode && (
              <label className="avatar-upload">
                <FiUpload />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="profile-meta">
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="name-input"
              />
            ) : (
              <h1>{userData.name}</h1>
            )}
            <p className="location">
              <FiMapPin />{" "}
              {editMode ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              ) : (
                userData.location
              )}
            </p>

            <div className="social-links">
              {editMode ? (
                <>
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="Twitter"
                  />
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Instagram"
                  />
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="LinkedIn"
                  />
                </>
              ) : (
                <>
                  {userData.twitter && (
                    <a
                      href={`https://twitter.com/${userData.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter />
                    </a>
                  )}
                  {userData.instagram && (
                    <a
                      href={`https://instagram.com/${userData.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram />
                    </a>
                  )}
                  {userData.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${userData.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">
                {userData.followers?.length || 0}
              </span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {userData.following?.length || 0}
              </span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {userData.events?.length || 0}
              </span>
              <span className="stat-label">Events</span>
            </div>
          </div>

          <div className="profile-actions">
            {editMode ? (
              <>
                <button className="save-btn" onClick={handleUpdate}>
                  Save Changes
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                <FiEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Left Column */}
        <div className="left-column">
          <div className="about-section">
            <h3>About</h3>
            {editMode ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p>{userData.bio}</p>
            )}
          </div>

          <div className="details-section">
            <h3>Details</h3>
            <div className="detail-item">
              <FiMail />
              <span>{userData.email}</span>
            </div>
            <div className="detail-item">
              <FiPhone />
              {editMode ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userData.phone}</span>
              )}
            </div>
            <div className="detail-item">
              <FiCalendar />
              {editMode ? (
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              ) : (
                <span>
                  {userData.dob
                    ? new Date(userData.dob).toLocaleDateString()
                    : "Not specified"}
                </span>
              )}
            </div>
            <div className="detail-item">
              <FiUsers />
              {editMode ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <span>
                  {userData.gender
                    ? userData.gender.charAt(0).toUpperCase() +
                      userData.gender.slice(1)
                    : "Not specified"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="tabs">
            <button
              className={activeTab === "events" ? "active" : ""}
              onClick={() => setActiveTab("events")}
            >
              My Events
            </button>
            <button
              className={activeTab === "communities" ? "active" : ""}
              onClick={() => setActiveTab("communities")}
            >
              Communities
            </button>
            <button
              className={activeTab === "followers" ? "active" : ""}
              onClick={() => setActiveTab("followers")}
            >
              Connections
            </button>
          </div>

          <div className="tab-content">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
