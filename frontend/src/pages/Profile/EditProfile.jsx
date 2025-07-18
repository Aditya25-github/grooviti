import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import "./EditProfile.css";

const EditProfile = () => {
  const { user: currentUser, token, url, setUser } = useContext(StoreContext);
  const [user, setFormUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profileImage: "",
    bannerImage: "",
  });
  const [originalUser, setOriginalUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [bannerImagePreview, setBannerImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    // Initialize form with current user data
    const userData = {
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      location: currentUser.location || "",
      bio: currentUser.bio || "",
      profileImage: currentUser.profileImage || "",
      bannerImage: currentUser.bannerImage || "",
    };

    setFormUser(userData);
    setOriginalUser(userData);
    setProfileImagePreview(currentUser.profileImage?.url || "");
    setBannerImagePreview(currentUser.bannerImage?.url || "");
    setLoading(false);
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === "profile") {
          setProfileImagePreview(e.target.result);
          setFormUser((prev) => ({
            ...prev,
            profileImage: e.target.result,
          }));
        } else {
          setBannerImagePreview(e.target.result);
          setFormUser((prev) => ({
            ...prev,
            bannerImage: e.target.result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", user.phone || "");
      formData.append("location", user.location || "");
      formData.append("bio", user.bio || "");

      // You would need to handle file uploads differently in a real API
      // This is a simplified version
      const response = await fetch(`${url}/api/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update context with new user data
      setUser(data.user);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  const isFormChanged = () => {
    return JSON.stringify(user) !== JSON.stringify(originalUser);
  };

  if (loading) {
    return (
      <div className="edit-profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="edit-profile-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: "95px" }}
    >
      <div className="edit-profile-header">
        <h1>Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-section">
          <div className="banner-section">
            <div className="banner-preview">
              <img
                src={bannerImagePreview || "/banner-placeholder.jpg"}
                alt="Banner preview"
                onError={(e) => {
                  e.target.src = "/banner-placeholder.jpg";
                }}
              />
              <div className="banner-overlay">
                <label htmlFor="banner-upload" className="upload-label">
                  Change Banner
                </label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "banner")}
                  className="image-input"
                />
              </div>
            </div>
          </div>

          <div className="avatar-section">
            <div className="avatar-preview">
              <img
                src={profileImagePreview || "/profile.jpg"}
                alt="Profile preview"
                onError={(e) => {
                  e.target.src = "/profile.jpg";
                }}
              />
              <div className="avatar-overlay">
                <label htmlFor="avatar-upload" className="upload-label">
                  Change Photo
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "profile")}
                  className="image-input"
                />
              </div>
            </div>
            <p className="image-hint">Max file size: 5MB</p>
          </div>
        </div>

        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={user.phone || ""}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={user.location || ""}
                onChange={handleInputChange}
                placeholder="Enter your location"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={user.bio || ""}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows="4"
              maxLength="500"
            />
            <span className="char-count">
              {(user.bio || "").length}/500 characters
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || !isFormChanged()}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <div className="form-section danger-zone">
        <h3>Danger Zone</h3>
        <div className="danger-actions">
          <div className="danger-item">
            <div>
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all associated data.</p>
            </div>
            <button className="btn btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditProfile;
