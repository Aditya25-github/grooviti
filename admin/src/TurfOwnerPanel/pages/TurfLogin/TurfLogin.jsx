import React, { useState, useContext, useEffect } from "react";
import styles from "./TurfLogin.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
import { toast } from "react-toastify";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

const TurfLogin = ({ url }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { setToken, setUserType } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/turf/login`, credentials);
      if (response.data.success) {
        setToken(response.data.token);
        setUserType("turf");
        toast.success("Login successful");
        navigate("/dashboardpage");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Check credentials.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Turf Owner Login</h1>
          <p className={styles.subtitle}>
            Access your turf management dashboard
          </p>
        </div>

        <div className={styles.divider}></div>

        {/* Form */}
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              className={styles.input}
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className={styles.input}
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.rememberForgot}>
            <div className={styles.rememberMe}>
              <input
                type="checkbox"
                id="remember"
                className={styles.checkbox}
              />
              <label htmlFor="remember" className={styles.rememberLabel}>
                Remember me
              </label>
            </div>
            <a href="#" className={styles.forgotPassword}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className={styles.loginButton}>
            Sign In to Dashboard
          </button>
        </form>

        {/* Social Login */}
        <div className={styles.socialLogin}>
          <div className={styles.orDivider}>
            <span className={styles.orText}>or continue with</span>
          </div>

          <div className={styles.socialButtons}>
            <button type="button" className={styles.socialButton}>
              <FaGoogle className={styles.socialIcon} />
              Google
            </button>
            <button type="button" className={styles.socialButton}>
              <FaMicrosoft className={styles.socialIcon} />
              Microsoft
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className={styles.footerLinks}>
          <p className={styles.signupText}>
            Don't have an account?{" "}
            <a href="#" className={styles.signupLink}>
              Sign up here
            </a>
          </p>
          <a href="#" className={styles.backLink}>
            <IoArrowBack className={styles.backIcon} />
            Back to role selection
          </a>
        </div>
      </div>
    </div>
  );
};

export default TurfLogin;
