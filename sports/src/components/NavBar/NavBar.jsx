<<<<<<< HEAD
import React, { useState, useEffect, useContext, useCallback, lazy, Suspense } from "react";
=======
import React, { useState, useEffect, useContext } from "react";
>>>>>>> 4b3e7842 (too many changes so doing today)
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { StoreContext } from "../../context/StoreContext";
import styles from "./NavBar.module.css";
import logo from "../../assets/sports_assets/logo.png";
<<<<<<< HEAD

// Lazy load modals
const Login = lazy(() => import("../Login/Login"));
const Signup = lazy(() => import("../Signup/Signup"));

// Icons
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
=======
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
>>>>>>> 4b3e7842 (too many changes so doing today)

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Venues", to: "/venues" },
  { name: "Play Together", to: "/playtogether" },
  { name: "Academy", to: "/academy" },
];

<<<<<<< HEAD
const Navbar = () => {
  const { isLoggedIn, user, setToken, setUser } = useContext(StoreContext);
=======
// Profile Icon Component
const ProfileIcon = () => (
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
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

// Chevron Down Icon
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);

// Logout Icon
const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// Settings Icon
const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17-4a4 4 0 0 1-8 0 4 4 0 0 1 8 0zM7 20a4 4 0 0 1-8 0 4 4 0 0 1 8 0z"/>
  </svg>
);

const Navbar = () => {
  // Context for authentication state
  const { isLoggedIn, user, setToken, setUser } = useContext(StoreContext);
  
>>>>>>> 4b3e7842 (too many changes so doing today)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const location = useLocation();
  const navigate = useNavigate();

<<<<<<< HEAD
  // Throttled scroll handler for better performance
  const throttledScrollHandler = useCallback(
    (() => {
      let timeoutId = null;
      return () => {
        if (timeoutId) return;
        timeoutId = setTimeout(() => {
          const scrollY = window.scrollY;
          if (scrollY === 0) {
            setScrollState('top');
          } else if (scrollY < 100) {
            setScrollState('scrolling');
          } else {
            setScrollState('scrolled');
          }
          timeoutId = null;
        }, 16); // ~60fps
      };
    })(),
    []
  );

  // Scroll handler
  useEffect(() => {
    window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", throttledScrollHandler);
  }, [throttledScrollHandler]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest(`.${styles.profileSection}`)) {
        setIsProfileDropdownOpen(false);
      }
      if (isMenuOpen && !event.target.closest(`.${styles.mobileMenuButton}`) && !event.target.closest(`.${styles.mobileMenu}`)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isProfileDropdownOpen, isMenuOpen]);

  // Body scroll management
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);
=======
  // Scroll state management
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY === 0) {
        setScrollState('top');
      } else if (scrollY < 100) {
        setScrollState('scrolling');
      } else {
        setScrollState('scrolled');
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
>>>>>>> 4b3e7842 (too many changes so doing today)

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

<<<<<<< HEAD
  // Close modals and menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsProfileDropdownOpen(false);
        setIsLoginModalOpen(false);
        setIsSignupModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

=======
  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest(`.${styles.profileSection}`)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Navigation handlers
>>>>>>> 4b3e7842 (too many changes so doing today)
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleMobileNavClick = (to) => {
    setIsMenuOpen(false);
    navigate(to);
  };

<<<<<<< HEAD
  const handleLoginClick = () => {
    setIsMenuOpen(false);
=======
  // Login modal handlers
  const handleLoginClick = () => {
>>>>>>> 4b3e7842 (too many changes so doing today)
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

<<<<<<< HEAD
  const handleSignupClick = () => {
    setIsMenuOpen(false);
=======
  // Signup modal handlers
  const handleSignupClick = () => {
>>>>>>> 4b3e7842 (too many changes so doing today)
    setIsSignupModalOpen(true);
  };

  const handleCloseSignupModal = () => {
    setIsSignupModalOpen(false);
  };

<<<<<<< HEAD
=======
  // Modal switching handlers
>>>>>>> 4b3e7842 (too many changes so doing today)
  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

<<<<<<< HEAD
=======
  // Profile handlers
>>>>>>> 4b3e7842 (too many changes so doing today)
  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

<<<<<<< HEAD
  const handleLogout = async () => {
=======
  const handleLogout = () => {
    // Clear authentication data
>>>>>>> 4b3e7842 (too many changes so doing today)
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsProfileDropdownOpen(false);
<<<<<<< HEAD
    setIsMenuOpen(false);
    navigate('/');
    
    const { toast } = await import('react-toastify');
    toast.info("You have been logged out successfully");
=======
    
    // Navigate to home page
    navigate('/');
    
    // Show logout success message
    import('react-toastify').then(({ toast }) => {
      toast.info("You have been logged out successfully");
    });
>>>>>>> 4b3e7842 (too many changes so doing today)
  };

  const handleProfileNavigation = (path) => {
    setIsProfileDropdownOpen(false);
<<<<<<< HEAD
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <motion.nav 
        className={`${styles.navbar} ${
          scrollState === 'scrolled' ? styles.scrolled : 
          scrollState === 'scrolling' ? styles.scrolling : ''
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
=======
    navigate(path);
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <motion.nav
        className={`${styles.navbar} ${
          scrollState === 'scrolled' 
            ? styles.scrolled 
            : scrollState === 'scrolling' 
              ? styles.scrolling 
              : ''
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
>>>>>>> 4b3e7842 (too many changes so doing today)
        transition={{ duration: 0.3 }}
      >
        <div className={styles.container}>
          {/* Logo */}
<<<<<<< HEAD
          <motion.div className={styles.logo}>
            <Link to="/" onClick={handleLogoClick} aria-label="Go to homepage">
              <img src={logo} alt="Sports Hub Logo" loading="lazy" />
=======
          <motion.div 
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" aria-label="Go to home" onClick={handleLogoClick}>
              <img src={logo} alt="Grooviti Logo" />
>>>>>>> 4b3e7842 (too many changes so doing today)
            </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
<<<<<<< HEAD
          <nav className={styles.navLinks} role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <motion.div key={link.name}>
                <Link
                  to={link.to}
                  className={`${styles.navLink} ${location.pathname === link.to ? styles.active : ""}`}
                  aria-current={location.pathname === link.to ? "page" : undefined}
=======
          <div className={styles.navLinks}>
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.to}
                  className={`${styles.navLink} ${
                    location.pathname === link.to ? styles.active : ""
                  }`}
>>>>>>> 4b3e7842 (too many changes so doing today)
                >
                  {link.name}
                  <motion.span 
                    className={styles.underline}
                    initial={{ width: 0 }}
                    animate={{ width: location.pathname === link.to ? "100%" : 0 }}
<<<<<<< HEAD
                    transition={{ duration: 0.3 }}
=======
>>>>>>> 4b3e7842 (too many changes so doing today)
                  />
                </Link>
              </motion.div>
            ))}
<<<<<<< HEAD
          </nav>

          {/* Auth Section */}
          <div className={styles.authSection}>
            {isLoggedIn ? (
=======
          </div>

          {/* Desktop Auth Section */}
          <div className={styles.authSection}>
            {isLoggedIn ? (
              // Profile Section (when logged in)
>>>>>>> 4b3e7842 (too many changes so doing today)
              <div className={styles.profileSection}>
                <motion.button
                  className={styles.profileButton}
                  onClick={handleProfileClick}
<<<<<<< HEAD
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="menu"
=======
                  whileHover={{ scale: 1.05 }}
>>>>>>> 4b3e7842 (too many changes so doing today)
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={styles.profileAvatar}>
                    {user?.profileImage?.url ? (
<<<<<<< HEAD
                      <img 
                        src={user.profileImage.url} 
                        alt={`${user.name}'s profile`} 
                        loading="lazy"
                        style={{ opacity: 1 }} 
                      />
=======
                      <img src={user.profileImage.url} alt={user.name} />
>>>>>>> 4b3e7842 (too many changes so doing today)
                    ) : (
                      <span className={styles.profileInitials}>
                        {getUserInitials(user?.name)}
                      </span>
                    )}
                  </div>
                  <span className={styles.profileName}>
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
<<<<<<< HEAD
                  <motion.div
                    animate={{ rotate: isProfileDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDownIcon />
                  </motion.div>
                </motion.button>

=======
                  <ChevronDownIcon />
                </motion.button>

                {/* Profile Dropdown */}
>>>>>>> 4b3e7842 (too many changes so doing today)
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      className={styles.profileDropdown}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
<<<<<<< HEAD
                      role="menu"
                      aria-labelledby="profile-button"
=======
>>>>>>> 4b3e7842 (too many changes so doing today)
                    >
                      <div className={styles.dropdownHeader}>
                        <div className={styles.dropdownAvatar}>
                          {user?.profileImage?.url ? (
<<<<<<< HEAD
                            <img 
                              src={user.profileImage.url} 
                              alt={`${user.name}'s profile`} 
                              loading="lazy"
                              style={{ opacity: 1 }} 
                            />
=======
                            <img src={user.profileImage.url} alt={user.name} />
>>>>>>> 4b3e7842 (too many changes so doing today)
                          ) : (
                            <span className={styles.dropdownInitials}>
                              {getUserInitials(user?.name)}
                            </span>
                          )}
                        </div>
                        <div className={styles.dropdownUserInfo}>
                          <p className={styles.dropdownName}>{user?.name || 'User'}</p>
                          <p className={styles.dropdownEmail}>{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className={styles.dropdownDivider}></div>
                      
                      <div className={styles.dropdownMenu}>
<<<<<<< HEAD
                        <button 
                          className={styles.dropdownItem} 
                          onClick={() => handleProfileNavigation('/profile')}
                          role="menuitem"
=======
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleProfileNavigation('/profile')}
>>>>>>> 4b3e7842 (too many changes so doing today)
                        >
                          <ProfileIcon />
                          <span>View Profile</span>
                        </button>
<<<<<<< HEAD
                        <button 
                          className={styles.dropdownItem} 
                          onClick={() => handleProfileNavigation('/settings')}
                          role="menuitem"
=======
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleProfileNavigation('/settings')}
>>>>>>> 4b3e7842 (too many changes so doing today)
                        >
                          <SettingsIcon />
                          <span>Settings</span>
                        </button>
<<<<<<< HEAD
                        <div className={styles.dropdownDivider}></div>
                        <button 
                          className={`${styles.dropdownItem} ${styles.logoutItem}`} 
                          onClick={handleLogout}
                          role="menuitem"
=======
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleProfileNavigation('/my-bookings')}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span>My Bookings</span>
                        </button>
                        <div className={styles.dropdownDivider}></div>
                        <button
                          className={`${styles.dropdownItem} ${styles.logoutItem}`}
                          onClick={handleLogout}
>>>>>>> 4b3e7842 (too many changes so doing today)
                        >
                          <LogoutIcon />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
<<<<<<< HEAD
              <div className={styles.authButtons}>
                <motion.button 
                  className={styles.loginBtn} 
                  onClick={handleLoginClick}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                <motion.button 
                  className={styles.signupBtn} 
                  onClick={handleSignupClick}
                  whileTap={{ scale: 0.95 }}
=======
              // Auth Buttons (when not logged in)
              <div className={styles.authButtons}>
                <motion.button
                  className={styles.loginBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginClick}
                >
                  Login
                </motion.button>
                <motion.button
                  className={styles.signupBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignupClick}
>>>>>>> 4b3e7842 (too many changes so doing today)
                >
                  Sign Up
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className={styles.mobileMenuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
<<<<<<< HEAD
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={false}
              animate={{ opacity: isMenuOpen ? 0 : 1, rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <MenuIcon />
            </motion.div>
            <motion.div
              className={styles.closeIconContainer}
              initial={false}
              animate={{ opacity: isMenuOpen ? 1 : 0, rotate: isMenuOpen ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <CloseIcon />
            </motion.div>
=======
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path
                  fill="currentColor"
                  d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
                />
              </svg>
            )}
>>>>>>> 4b3e7842 (too many changes so doing today)
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
<<<<<<< HEAD
            <>
              <motion.div 
                className={styles.mobileMenuOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div 
                className={styles.mobileMenu}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className={styles.mobileMenuContent}>
                  {isLoggedIn && (
                    <motion.div 
                      className={styles.mobileProfileHeader}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className={styles.mobileProfileAvatar}>
                        {user?.profileImage?.url ? (
                          <img 
                            src={user.profileImage.url} 
                            alt={`${user.name}'s profile`} 
                            loading="lazy"
                            style={{ opacity: 1 }} 
                          />
=======
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.mobileMenuContent}>
                {/* Mobile Navigation Links */}
                {navLinks.map((link) => (
                  <motion.button
                    key={link.name}
                    onClick={() => handleMobileNavClick(link.to)}
                    className={`${styles.mobileNavLink} ${
                      location.pathname === link.to ? styles.active : ""
                    }`}
                    whileTap={{ scale: 0.97 }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                  </motion.button>
                ))}
                
                {/* Mobile Auth Section */}
                {isLoggedIn ? (
                  // Mobile Profile Section
                  <div className={styles.mobileProfileSection}>
                    <div className={styles.mobileProfileHeader}>
                      <div className={styles.mobileProfileAvatar}>
                        {user?.profileImage?.url ? (
                          <img src={user.profileImage.url} alt={user.name} />
>>>>>>> 4b3e7842 (too many changes so doing today)
                        ) : (
                          <span className={styles.mobileProfileInitials}>
                            {getUserInitials(user?.name)}
                          </span>
                        )}
                      </div>
                      <div className={styles.mobileProfileInfo}>
                        <p className={styles.mobileProfileName}>{user?.name || 'User'}</p>
                        <p className={styles.mobileProfileEmail}>{user?.email}</p>
                      </div>
<<<<<<< HEAD
                    </motion.div>
                  )}
                  
                  <nav className={styles.mobileNavSection} role="navigation" aria-label="Mobile navigation">
                    {navLinks.map((link, index) => (
                      <motion.button
                        key={link.name}
                        className={`${styles.mobileNavLink} ${location.pathname === link.to ? styles.active : ""}`}
                        onClick={() => handleMobileNavClick(link.to)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        aria-current={location.pathname === link.to ? "page" : undefined}
                      >
                        <span>{link.name}</span>
                      </motion.button>
                    ))}
                  </nav>
                  
                  {isLoggedIn ? (
                    <motion.div 
                      className={styles.mobileBottomActions}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button className={styles.mobileActionBtn} onClick={() => handleProfileNavigation('/profile')}>
                        <ProfileIcon />
                        <span>Profile</span>
                      </button>
                      <button className={styles.mobileActionBtn} onClick={() => handleProfileNavigation('/settings')}>
                        <SettingsIcon />
                        <span>Settings</span>
                      </button>
                      <button className={`${styles.mobileActionBtn} ${styles.mobileLogoutBtn}`} onClick={handleLogout}>
                        <LogoutIcon />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className={styles.mobileAuthSection}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className={styles.mobileAuthButtons}>
                        <button className={styles.mobileLoginBtn} onClick={handleLoginClick}>
                          Login
                        </button>
                        <button className={styles.mobileSignupBtn} onClick={handleSignupClick}>
                          Sign Up
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </>
=======
                    </div>
                    
                    <div className={styles.mobileProfileActions}>
                      <motion.button
                        className={styles.mobileProfileBtn}
                        onClick={() => handleProfileNavigation('/profile')}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ProfileIcon />
                        <span>View Profile</span>
                      </motion.button>
                      <motion.button
                        className={styles.mobileProfileBtn}
                        onClick={() => handleProfileNavigation('/my-bookings')}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>My Bookings</span>
                      </motion.button>
                      <motion.button
                        className={styles.mobileProfileBtn}
                        onClick={() => handleProfileNavigation('/settings')}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SettingsIcon />
                        <span>Settings</span>
                      </motion.button>
                      <motion.button
                        className={`${styles.mobileProfileBtn} ${styles.mobileLogoutBtn}`}
                        onClick={handleLogout}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogoutIcon />
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  // Mobile Auth Buttons
                  <div className={styles.mobileAuthButtons}>
                    <motion.button
                      className={styles.mobileLoginBtn}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLoginClick}
                    >
                      Login
                    </motion.button>
                    <motion.button
                      className={styles.mobileSignupBtn}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSignupClick}
                    >
                      Sign Up
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
>>>>>>> 4b3e7842 (too many changes so doing today)
          )}
        </AnimatePresence>
      </motion.nav>

<<<<<<< HEAD
      {/* Modals */}
      <Suspense fallback={null}>
        {isLoginModalOpen && (
          <Login 
            isOpen={isLoginModalOpen}
            onClose={handleCloseLoginModal} 
            onSwitchToSignup={handleSwitchToSignup} 
          />
        )}
        {isSignupModalOpen && (
          <Signup 
            isOpen={isSignupModalOpen}
            onClose={handleCloseSignupModal} 
            onSwitchToLogin={handleSwitchToLogin} 
          />
        )}
      </Suspense>
=======
      {/* Login Modal */}
      <Login 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseLoginModal}
        onSwitchToSignup={handleSwitchToSignup}
      />

      {/* Signup Modal */}
      <Signup 
        isOpen={isSignupModalOpen} 
        onClose={handleCloseSignupModal}
        onSwitchToLogin={handleSwitchToLogin}
      />
>>>>>>> 4b3e7842 (too many changes so doing today)
    </>
  );
};

export default Navbar;
