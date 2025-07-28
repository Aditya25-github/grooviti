import React, { useEffect, useState } from "react";
import styles from "./ProfileSettingsPage.module.css";
import axios from "axios";
import { toast } from "react-toastify";

const ProfileSettingsPage = ({ url, token }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.user || {});
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [url, token]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put(`${url}/api/users/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className={styles.loading}>Loading profile...</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Profile Settings</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Name:
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
            type="text"
          />
        </label>

        <label>
          Email:
          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
            type="email"
            disabled
          />
          <small>Email cannot be changed</small>
        </label>

        <label>
          Phone:
          <input
            name="phone"
            value={profile.phone || ""}
            onChange={handleChange}
            type="tel"
            placeholder="Optional"
          />
        </label>

        <label>
          Bio:
          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about yourself"
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettingsPage;
