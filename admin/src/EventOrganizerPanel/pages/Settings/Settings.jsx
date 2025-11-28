import React, { useContext, useEffect, useState } from "react";
import "./Settings.css";
import axios from "axios";
import { StoreContext } from "../../../context/StoreContext";
import { toast } from "react-toastify";
import { assets } from "../../../assets/assets";

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
          const imageUrl =
            org.profileImage?.url ||
            (typeof org.profileImage === "string" &&
            org.profileImage.startsWith("http")
              ? org.profileImage
              : org.profileImage
              ? `${url}/uploads/organizers/${org.profileImage}`
              : null);
          setPreviewImage(imageUrl);
          setProfileImageFromDB(imageUrl);
        } else {
          setPreviewImage(null);
          setProfileImageFromDB(null);
        }
      } catch (err) {
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
      if (res.data.success) toast.success("Profile updated successfully");
      else toast.error("Update failed");
    } catch {
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
        { headers: { Authorization: `Bearer ${token}` } }
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
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="settings-main">
      <h1 className="settings-title">User Settings</h1>
      <div className="settings-grid">
        <div className="settings-left">
          <form
            onSubmit={handleProfileUpdate}
            encType="multipart/form-data"
            className="settings-section"
          >
            <div className="section-title">User Information</div>
            <div className="section-instructions">
              Update your basic profile information.
            </div>
            <div className="two-inputs">
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} readOnly />
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <label>Job Title</label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
            />
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={"Grooviti Events"}
              readOnly
            />
            <div className="button-row">
              <button className="btn-primary" type="submit">
                Save Changes
              </button>
              <button className="btn-neutral" type="reset">
                Cancel
              </button>
            </div>
          </form>
          <form onSubmit={handlePasswordChange} className="settings-section">
            <div className="section-title">Password Management</div>
            <div className="section-instructions">
              Change your password to keep your account secure.
            </div>
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
            <div className="two-inputs">
              <div>
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="button-row">
              <button className="btn-primary" type="submit">
                Update Password
              </button>
              <button className="btn-neutral" type="reset">
                Cancel
              </button>
            </div>
          </form>
          <div className="danger-section">
            <div className="danger-title">Danger Zone</div>
            <div className="danger-desc">
              Permanently delete your account and all associated data.
            </div>
            <button className="danger-btn">Delete My Account</button>
          </div>
        </div>
        <div className="settings-right">
          <div className="profile-block">
            <div className="profile-title">Profile Photo</div>
            <img
              src={previewImage || profileImageFromDB || assets.profile_image}
              alt="Profile Preview"
              className="profile-img-block"
            />
            <label className="btn-primary upload-btn">
              Upload New Photo
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
            <button className="btn-neutral remove-btn">Remove Photo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
