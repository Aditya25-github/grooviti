// src/components/Login/Login.jsx
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import styles from './Login.module.css';

// Icon Components
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.inputIcon}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.inputIcon}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.eyeIcon}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.eyeIcon}
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const AppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={styles.socialIcon}
  >
    <path 
      fill="currentColor" 
      d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    className={styles.socialIcon}
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={styles.socialIcon}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg
    className={styles.spinnerIcon}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className={styles.spinnerCircle}
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className={styles.spinnerPath}
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Main Login Component with Mobile Keyboard Handling
const Login = ({ isOpen, onClose, onSwitchToSignup }) => {
  const { url, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  // Refs for keyboard handling
  const modalRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  // Keyboard detection for mobile
  useEffect(() => {
    if (!isOpen) return;

    let initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    let initialWindowHeight = window.innerHeight;

    const handleViewportChange = () => {
      if (!window.visualViewport) return;

      const currentHeight = window.visualViewport.height;
      const heightDifference = initialViewportHeight - currentHeight;
      
      const keyboardIsOpen = heightDifference > 150;
      setIsKeyboardOpen(keyboardIsOpen);

      if (modalRef.current) {
        if (keyboardIsOpen) {
          modalRef.current.style.transform = 'translateY(-20vh)';
          modalRef.current.style.transition = 'transform 0.3s ease-in-out';
        } else {
          modalRef.current.style.transform = 'translateY(0)';
          modalRef.current.style.transition = 'transform 0.3s ease-in-out';
        }
      }
    };

    const handleWindowResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialWindowHeight - currentHeight;
      const keyboardIsOpen = heightDifference > 150;
      
      setIsKeyboardOpen(keyboardIsOpen);

      if (modalRef.current) {
        if (keyboardIsOpen) {
          modalRef.current.style.transform = 'translateY(-15vh)';
          modalRef.current.style.transition = 'transform 0.3s ease-in-out';
        } else {
          modalRef.current.style.transform = 'translateY(0)';
          modalRef.current.style.transition = 'transform 0.3s ease-in-out';
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    } else {
      window.addEventListener('resize', handleWindowResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      } else {
        window.removeEventListener('resize', handleWindowResize);
      }
    };
  }, [isOpen]);

  // Scroll to active input when keyboard opens
  useEffect(() => {
    if (isKeyboardOpen && activeInput && modalRef.current) {
      setTimeout(() => {
        const activeElement = activeInput === 'email' ? emailInputRef.current : passwordInputRef.current;
        if (activeElement) {
          activeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 300);
    }
  }, [isKeyboardOpen, activeInput]);

  // Input focus handlers
  const handleInputFocus = useCallback((inputType) => {
    setActiveInput(inputType);
  }, []);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => {
      setActiveInput(null);
    }, 100);
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/login`, data);
      
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        if (response.data.role === "eventHost") {
          window.location.href = "https://grooviti-sports-admin.onrender.com";
        } else {
          onClose();
          toast.success("Login successful!");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    onClose();
    navigate("/forgot-password");
  };

  const handleAppleLogin = () => {
    toast.info("Apple login will be available soon!");
  };

  const handleGoogleLogin = () => {
    toast.info("Google login will be available soon!");
  };

  const handleXLogin = () => {
    toast.info("X login will be available soon!");
  };

  useEffect(() => {
    if (isOpen) {
      setData({ email: "", password: "" });
      setShowPassword(false);
      setIsKeyboardOpen(false);
      setActiveInput(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={`${styles.modalOverlay} ${isKeyboardOpen ? styles.keyboardOpen : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div 
          ref={modalRef}
          className={`${styles.modalContent} ${isKeyboardOpen ? styles.keyboardActive : ''}`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </motion.button>

          <div className={styles.loginCard}>
            <motion.div 
              className={styles.loginHeader}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <h1 className={styles.loginTitle}>Welcome back</h1>
                <p className={styles.loginSubtitle}>Enter your credentials to sign in</p>
              </div>
            </motion.div>

            <motion.div 
              className={styles.socialButtons}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button 
                className={styles.socialBtn} 
                onClick={handleAppleLogin} 
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <AppleIcon />
              </motion.button>
              <motion.button 
                className={styles.socialBtn} 
                onClick={handleGoogleLogin} 
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <GoogleIcon />
              </motion.button>
              <motion.button 
                className={styles.socialBtn} 
                onClick={handleXLogin} 
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <XIcon />
              </motion.button>
            </motion.div>

            <motion.div 
              className={styles.divider}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.dividerLine} />
              <div className={styles.dividerText}>
                <span>Or continue with email</span>
              </div>
            </motion.div>

            <motion.form 
              className={styles.loginForm} 
              onSubmit={onLogin}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Email Input with Icon */}
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIconContainer}>
                    <MailIcon />
                  </div>
                  <input
                    ref={emailInputRef}
                    type="email"
                    id="email"
                    name="email"
                    value={data.email}
                    onChange={onChangeHandler}
                    onFocus={() => handleInputFocus('email')}
                    onBlur={handleInputBlur}
                    placeholder="name@example.com"
                    className={styles.input}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>
              </div>
              
              {/* Password Input with Icon and Eye Button */}
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIconContainer}>
                    <LockIcon />
                  </div>
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={onChangeHandler}
                    onFocus={() => handleInputFocus('password')}
                    onBlur={handleInputBlur}
                    placeholder="Enter your password"
                    className={`${styles.input} ${styles.passwordInput}`}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className={styles.forgotPasswordContainer}>
                <motion.button
                  type="button"
                  className={styles.forgotPasswordLink}
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Forgot your password?
                </motion.button>
              </div>

              <motion.button
                type="submit"
                className={`${styles.signInButton} ${isLoading ? styles.loading : ''}`}
                disabled={isLoading}
                aria-busy={isLoading}
                whileHover={!isLoading ? { y: -2 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={styles.loadingContent}
                    >
                      <LoadingSpinner />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="signin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Sign In
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>

            <motion.div 
              className={styles.loginFooter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className={styles.footerText}>
                Don&apos;t have an account?{' '}
                <motion.button
                  type="button"
                  className={styles.footerLink}
                  onClick={onSwitchToSignup}
                  disabled={isLoading}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign up here
                </motion.button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
