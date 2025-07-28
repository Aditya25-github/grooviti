import React, { useContext, useState, useEffect } from "react";
import styles from "./AcademyLogin.module.css";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const AcademyLogin = ({ url }) => {
  const navigate = useNavigate();
  const { setUserRole, token, setToken } = useContext(StoreContext); // <-- fixed here
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Input Handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  // Login Handler
  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + "/api/academy/login", loginData);
      if (response.data.success) {
        setToken(response.data.token);
        setUserRole("academy"); // <-- fixed here
        localStorage.setItem("academyToken", response.data.token);
        localStorage.setItem("userType", "academy");
        toast.success("Login successful");
        navigate("/academy/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  // Signup Handler
  const onSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        url + "/api/academy/register",
        signupData
      );
      if (response.data.success) {
        toast.success("Registration successful. Please login.");
        setIsLogin(true);
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/academy/dashboard");
      return;
    }

    const tokenFromStorage = localStorage.getItem("academyToken");
    const userTypeFromStorage = localStorage.getItem("userType");

    if (!token && tokenFromStorage && userTypeFromStorage === "academy") {
      setToken(tokenFromStorage);
      setUserRole("academy"); // <-- fixed here
    }
  }, [token, navigate, setToken, setUserRole]);

  return (
    <div className={styles.container}>
      <div className={styles.flipCard}>
        <div
          className={`${styles.cardInner} ${!isLogin ? styles.flipped : ""}`}
        >
          {/* Login Form */}
          <div className={`${styles.cardFace} ${styles.cardFront}`}>
            <div className={styles.loginCard}>
              <div className={styles.header}>
                <h1 className={styles.title}>Academy Owner Login</h1>
                <p className={styles.subtitle}>Access your academy dashboard</p>
              </div>
              <div className={styles.divider}></div>

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
                  Don't have an account?{" "}
                  <span
                    className={styles.signupLink}
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up here
                  </span>
                </p>
                <a href="#" className={styles.backLink}>
                  <IoArrowBack className={styles.backIcon} />
                  Back to role selection
                </a>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <div className={`${styles.cardFace} ${styles.cardBack}`}>
            <div className={styles.loginCard}>
              <div className={styles.header}>
                <h1 className={styles.title}>Academy Owner Signup</h1>
                <p className={styles.subtitle}>Create your academy account</p>
              </div>
              <div className={styles.divider}></div>

              <form onSubmit={onSignup} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className={styles.input}
                    value={signupData.name}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
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
                    placeholder="Create a password"
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
                    placeholder="Re-enter your password"
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
                <a href="#" className={styles.backLink}>
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

export default AcademyLogin;
