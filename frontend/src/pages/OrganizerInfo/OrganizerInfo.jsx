import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrganizerInfo.css";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const pricing = {
  Basic: { monthly: 49, quarterly: 119, annual: 299 },
  Premium: { monthly: 499, quarterly: 1199, annual: 2999 },
  Custom: { monthly: 999, quarterly: 2399, annual: 5999 },
};

const OrganizerInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { planName, billingCycle } = location.state || {};
  const { url } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    organization: "",
    bio: "",
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    city: "",
    state: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const totalPrice = pricing[planName]?.[billingCycle] || 0;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordMinLength = 6;

    if (!formData.name.trim()) return "Name is required.";
    if (!formData.email.trim() || !emailRegex.test(formData.email))
      return "Valid email is required.";
    if (formData.password.length < passwordMinLength)
      return `Password must be at least ${passwordMinLength} characters.`;
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone))
      return "Valid 10-digit phone number required.";
    if (!formData.organization.trim()) return "Organization name is required.";
    return null;
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append("planName", planName);
      data.append("billingCycle", billingCycle);
      data.append("amount", totalPrice);
      if (profileImage) data.append("profileImage", profileImage);

      const res = await axios.post(`${url}/api/organizer/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Proceeding to payment...");
        navigate("/payment", {
          state: {
            amount: totalPrice,
            userId: res.data.userId,
            email: formData.email,
          },
        });
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error("Registration Error:", err);
    }
  };

  return (
    <div style={{ paddingTop: "95px" }}>
      <div className="organizer-info-wrapper">
        <div className="organizer-info-left">
          <h2>Organizer Information</h2>
          <p>
            Plan: <strong>{planName}</strong> | Billing:{" "}
            <strong>{billingCycle}</strong>
          </p>
          <p className="total-price">
            Total Price: <strong>₹{totalPrice}</strong>
          </p>

          <form onSubmit={handleBuyNow} className="organizer-info-form">
            <input type="file" onChange={handleFileChange} accept="image/*" />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="organization"
              placeholder="Organization Name"
              onChange={handleChange}
              required
            />
            <textarea
              name="bio"
              placeholder="Short bio"
              onChange={handleChange}
            />

            <input
              type="text"
              name="website"
              placeholder="Website"
              onChange={handleChange}
            />
            <input
              type="text"
              name="instagram"
              placeholder="Instagram"
              onChange={handleChange}
            />
            <input
              type="text"
              name="facebook"
              placeholder="Facebook"
              onChange={handleChange}
            />
            <input
              type="text"
              name="twitter"
              placeholder="Twitter"
              onChange={handleChange}
            />
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn"
              onChange={handleChange}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleChange}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              onChange={handleChange}
            />

            <button type="submit" className="buy-now-button">
              Buy Now
            </button>
          </form>
        </div>

        <div className="organizer-info-right">
          <img
            src={previewUrl || "/images/profile.png"}
            alt="Profile Preview"
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizerInfo;
