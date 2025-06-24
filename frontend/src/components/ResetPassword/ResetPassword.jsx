// src/pages/ResetPassword/ResetPassword.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { StoreContext } from "../../context/StoreContext";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${url}/api/user/reset-password/` + token, {
        password,
      });
      setMessage(res.data.message);
      if (res.data.success) {
        setTimeout(() => navigate("/"), 3000); // Redirect to home/login
      }
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="reset-password-page">
      <form className="reset-password-form" onSubmit={handleReset}>
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        {message && <p className="reset-message">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
