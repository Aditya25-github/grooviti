// components/Profile/LeftPanel.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Profile.css";
import { toast } from "react-toastify";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const LeftPanel = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const { url } = useContext(StoreContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${url}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const user = res.data.user;
          setUserData(user);
          setName(user.name);
          setPhone(user.phone || "");
          setGender(user.gender || "");
          setDob(user.dob ? user.dob.substring(0, 10) : "");
          setLocation(user.location || "");
          setBio(user.bio || "");
        } else {
          toast.error("Failed to load profile");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching profile");
      }
    };

    fetchProfile();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("dob", dob);
    formData.append("location", location);
    formData.append("bio", bio);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const res = await axios.put(`${url}/api/user/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setUserData(res.data.user);
        toast.success("Profile updated successfully");
        setEditMode(false);
        setPreview(null);
        setProfileImage(null);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="left-panel">
      <div className="image-wrapper">
        <img
          src={preview || userData.profileImage?.url || assets.profile_icon}
          alt="Profile"
          className="left-panel-profile-img"
        />
        {editMode && (
          <label className="upload-btn">
            Change
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      {editMode ? (
        <div className="left-panel-edit-form">
          <div className="left-panel-form-group">
            <label>Name</label>
            <input
              className="left-panel-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="left-panel-form-group">
            <label>Phone</label>
            <input
              className="left-panel-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="left-panel-form-group">
            <label>Gender</label>
            <select
              className="left-panel-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="left-panel-form-group">
            <label>Date of Birth</label>
            <input
              className="left-panel-input"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="left-panel-form-group">
            <label>Location</label>
            <input
              className="left-panel-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="left-panel-form-group">
            <label>Bio</label>
            <textarea
              className="left-panel-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button className="left-panel-save-btn" onClick={handleUpdate}>
            Save
          </button>
        </div>
      ) : (
        <>
          <h2 className="left-panel-name">{userData.name}</h2>
          <p className="left-panel-email">{userData.email}</p>
          {userData.phone && <p>📞 {userData.phone}</p>}
          {userData.gender && <p>👤 {userData.gender}</p>}
          {userData.dob && <p>🎂 {userData.dob.substring(0, 10)}</p>}
          {userData.location && <p>📍 {userData.location}</p>}
          {userData.bio && <p>📝 {userData.bio}</p>}
          <button
            className="left-panel-edit-btn"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
};

export default LeftPanel;
