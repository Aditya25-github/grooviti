import React, { useState, useContext, useEffect } from "react";
import styles from "./TurfLogin.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
import { toast } from "react-toastify";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

const TurfLogin = ({ url }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { setToken, setUserRole } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/turfs/login`, loginData);
      if (response.data.success) {
        setToken(response.data.token);
        setUserRole("turfOwner");
        localStorage.setItem("turfOwnerToken", response.data.token);
        localStorage.setItem("userType", "turfOwner");
        toast.success("Login successful");
        navigate("/turf/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error full:", err);
      console.error("Response data:", err.response?.data);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/turfs/register`,
        signupData
      );
      if (response.data.success) {
        toast.success("Registration successful. Please login.");
        setIsLogin(true);
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Signup failed.");
    }
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("turfOwnerToken");
    const roleFromStorage = localStorage.getItem("userType");
    if (tokenFromStorage && roleFromStorage === "turfOwner") {
      setToken(tokenFromStorage);
      setUserRole(roleFromStorage);
      navigate("/turf/dashboard");
    }
  }, [setToken, setUserRole, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.flipCard}>
        <div
          className={`${styles.cardInner} ${!isLogin ? styles.flipped : ""}`}
        >
          {/* Login Face */}
          <div className={`${styles.cardFace} ${styles.cardFront}`}>
            <div className={styles.loginCard}>
              <div className={styles.header}>
                <h1 className={styles.title}>Turf Owner Login</h1>
                <p className={styles.subtitle}>Access your turf dashboard</p>
              </div>

              <form onSubmit={handleLogin} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
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

                <button type="submit" className={styles.loginButton}>
                  Sign In
                </button>
              </form>

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
            </div>
          </div>

          {/* Signup Face */}
          <div className={`${styles.cardFace} ${styles.cardBack}`}>
            <div className={styles.loginCard}>
              <div className={styles.header}>
                <h1 className={styles.title}>Turf Owner Signup</h1>
                <p className={styles.subtitle}>Create your turf account</p>
              </div>

              <form onSubmit={handleSignup} className={styles.form}>
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
              </form>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurfLogin;
