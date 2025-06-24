import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email field cannot be empty");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${url}/api/user/forgot-password`, {
        email,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => navigate("/"), 2500);
      } else {
        if (res.data.message === "User not found. Please sign up first.") {
          toast.error(res.data.message, {
            onClick: () => navigate("/"),
          });
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <img
          src={assets.logo} // Make sure this icon exists in assets
          alt="Email Icon"
          style={{ width: "100px", alignSelf: "center" }}
        />
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
