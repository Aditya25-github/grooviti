import React, { useContext, useEffect, useState } from "react";
import "./Settings.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Settings = ({ url }) => {
  const { token } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organizationName: "",
    website: "",
    bio: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileImageFromDB, setProfileImageFromDB] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/api/organizer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const org = res.data.organizer;
          setFormData({
            name: org.name || "",
            email: org.email || "",
            phone: org.phone || "",
            organizationName: org.organization || "",
            website: org.socialLinks?.website || "",
            bio: org.bio || "",
            address: `${org.address?.city || ""}, ${org.address?.state || ""}`,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setPreviewImage(`${url}/uploads/organizers/${org.profileImage}`);
          setProfileImageFromDB(
            `${url}/uploads/organizers/${org.profileImage}`
          );
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching profile");
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("organizationName", formData.organizationName);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("bio", formData.bio);
      const [city = "", state = ""] = formData.address
        .split(",")
        .map((s) => s.trim());
      formDataToSend.append("city", city);
      formDataToSend.append("state", state);

      if (newProfileImage) {
        formDataToSend.append("profileImage", newProfileImage);
      }

      const res = await axios.put(
        `${url}/api/organizer/profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const res = await axios.put(
        `${url}/api/organizer/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Password updated successfully");
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        toast.error(res.data.message || "Password update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="settings-page">
      <h2>Organizer Settings</h2>
      <div className="settings-card">
        <form onSubmit={handleProfileUpdate} encType="multipart/form-data">
          <h3>Personal Info</h3>
          <div className="form-grid">
            <div className="form-fields">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
              />
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <label>Organization Name</label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
              />
              <label>Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
              <label>About</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
              />
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              <button className="save-btn" type="submit">
                Update Profile
              </button>
            </div>
            <div className="profile-img-wrapper">
              <img
                src={previewImage || profileImageFromDB || assets.profile_image}
                alt="Profile Preview"
                className="profile-img"
              />
              <label className="upload-btn">
                Change Photo
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
            </div>
          </div>
        </form>

        <hr />

        <form onSubmit={handlePasswordChange}>
          <h3>Change Password</h3>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button className="save-btn" type="submit">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
