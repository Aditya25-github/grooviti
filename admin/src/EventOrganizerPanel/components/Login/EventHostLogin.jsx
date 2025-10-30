import React, { useContext, useState, useEffect } from "react";
import styles from "./EventHostLogin.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
import { toast } from "react-toastify";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

const EventHostLogin = ({ url }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { setUserRole, setAdmin, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/event/login`, loginData);
      if (response.data.success && response.data.role === "host") {
        setToken(response.data.token);
        setAdmin(true);
        setUserRole("event");
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("organizerEmail", response.data.email);
        localStorage.setItem("eventHost", response.data.email);
        localStorage.setItem("userRole", "event");
        toast.success("Login successful");
        navigate("/event/add");
      } else if (response.data.success) {
        toast.error("You are not an admin");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Organizer login error:", error);
      toast.error(error.response?.data?.message || "Network or server error");
    }
  };

  const onSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${url}/api/event/register`, {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        role: "host",
      });
      if (response.data.success) {
        toast.success("Registration successful. Please login.");
        setIsLogin(true);
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Organizer signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("adminToken");
    const roleFromStorage = localStorage.getItem("userRole");
    const emailFromStorage = localStorage.getItem("eventHost");
    if (tokenFromStorage && roleFromStorage === "event" && emailFromStorage) {
      setToken(tokenFromStorage);
      setAdmin(true);
      setUserRole(roleFromStorage);
      navigate("/event/add");
    }
  }, [setToken, setAdmin, setUserRole, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isLogin ? "Event Host Login" : "Event Host Signup"}
          </h1>
          <p className={styles.subtitle}>
            {isLogin
              ? "Access your event management dashboard"
              : "Create your event host account"}
          </p>
        </div>

        <div className={styles.divider}></div>

        {isLogin ? (
          <form onSubmit={onLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className={styles.input}
                value={loginData.email}
                onChange={handleLoginChange}
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
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </div>

            <div className={styles.rememberForgot}>
              <label className={styles.rememberMe}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.rememberLabel}>Remember me</span>
              </label>
              <a href="#" className={styles.forgotPassword}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className={styles.loginButton}>
              Sign In to Dashboard
            </button>

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

            <div className={styles.footerLinks}>
              <p className={styles.signupText}>
                Don’t have an account?{" "}
                <span
                  className={styles.signupLink}
                  onClick={() => setIsLogin(false)}
                >
                  Sign up here
                </span>
              </p>
              <a href="/" className={styles.backLink}>
                <IoArrowBack className={styles.backIcon} />
                Back to role selection
              </a>
            </div>
          </form>
        ) : (
          <form onSubmit={onSignup} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                className={styles.input}
                value={signupData.name}
                onChange={handleSignupChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className={styles.input}
                value={signupData.email}
                onChange={handleSignupChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                className={styles.input}
                value={signupData.password}
                onChange={handleSignupChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className={styles.input}
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                required
              />
            </div>

            <button type="submit" className={styles.loginButton}>
              Register Account
            </button>

            <div className={styles.footerLinks}>
              <p className={styles.signupText}>
                Already have an account?{" "}
                <span
                  className={styles.signupLink}
                  onClick={() => setIsLogin(true)}
                >
                  Sign in here
                </span>
              </p>
              <a href="/" className={styles.backLink}>
                <IoArrowBack className={styles.backIcon} />
                Back to role selection
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventHostLogin;
