import React, { useContext, useState, useEffect } from "react";
import styles from "./EventHostLogin.module.css";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const EventHostLogin = ({ url }) => {
  const navigate = useNavigate();
  const { setUserRole, admin, setAdmin, token, setToken } =
    useContext(StoreContext);

  const [data, setData] = useState({ email: "", password: "" });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + "/api/organizer/login", data);
      if (response.data.success) {
        if (response.data.role === "host") {
          setToken(response.data.token);
          setAdmin(true);
          setUserRole("event");
          localStorage.setItem("adminToken", response.data.token);
          localStorage.setItem("organizerEmail", response.data.email);
          localStorage.setItem("eventHost", response.data.email);
          localStorage.setItem("userRole", "event");

          toast.success("Login Successfully");
          navigate("/add");
        } else {
          toast.error("You are not an admin");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("🔥 AXIOS LOGIN ERROR:", error);
      if (error.response) {
        toast.error(
          error.response.data.message || "Server responded with error"
        );
      } else {
        toast.error("Network or client error");
      }
    }
  };

  useEffect(() => {
    if (admin && token) {
      navigate("/add");
      return;
    }

    const tokenFromStorage = localStorage.getItem("adminToken");
    const emailFromStorage = localStorage.getItem("eventHost");
    const roleFromStorage = localStorage.getItem("userRole");

    if (!token && !admin && tokenFromStorage && emailFromStorage) {
      setToken(tokenFromStorage);
      setAdmin(true);
      setUserRole(roleFromStorage);
    }
  }, [admin, token, navigate, setAdmin, setToken, setUserRole]);

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Event Host Login</h1>
          <p className={styles.subtitle}>
            Access your event management dashboard
          </p>
        </div>

        <div className={styles.divider}></div>

        {/* Form */}
        <form onSubmit={onLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className={styles.input}
              value={data.email}
              onChange={onChangeHandler}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className={styles.input}
              value={data.password}
              onChange={onChangeHandler}
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

export default EventHostLogin;
