import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { StoreContext } from "../../context/StoreContext";
import styles from "./NavBar.module.css";
import logo from "../../assets/sports_assets/logo.png";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Venues", to: "/venues" },
  { name: "Play Together", to: "/playtogether" },
  { name: "Academy", to: "/academy" },
];

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
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const location = useLocation();
  const navigate = useNavigate();

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

  // Body scroll management for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('mobileMenuOpen');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('mobileMenuOpen');
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.classList.remove('mobileMenuOpen');
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

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
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleMobileNavClick = (to) => {
    setIsMenuOpen(false);
    navigate(to);
  };

  // Login modal handlers
  const handleLoginClick = () => {
    setIsMenuOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // Signup modal handlers
  const handleSignupClick = () => {
    setIsMenuOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleCloseSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  // Modal switching handlers
  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  // Profile handlers
  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    // Clear authentication data
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    
    // Navigate to home page
    navigate('/');
    
    // Show logout success message
    import('react-toastify').then(({ toast }) => {
      toast.info("You have been logged out successfully");
    });
  };

  const handleProfileNavigation = (path) => {
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
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
        transition={{ duration: 0.3 }}
      >
        <div className={styles.container}>
          {/* Logo */}
          <motion.div 
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" aria-label="Go to home" onClick={handleLogoClick}>
              <img src={logo} alt="Grooviti Logo" />
            </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
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
                >
                  {link.name}
                  <motion.span 
                    className={styles.underline}
                    initial={{ width: 0 }}
                    animate={{ width: location.pathname === link.to ? "100%" : 0 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className={styles.authSection}>
            {isLoggedIn ? (
              // Profile Section (when logged in)
              <div className={styles.profileSection}>
                <motion.button
                  className={styles.profileButton}
                  onClick={handleProfileClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={styles.profileAvatar}>
                    {user?.profileImage?.url ? (
                      <img src={user.profileImage.url} alt={user.name} />
                    ) : (
                      <span className={styles.profileInitials}>
                        {getUserInitials(user?.name)}
                      </span>
                    )}
                  </div>
                  <span className={styles.profileName}>
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDownIcon />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      className={styles.profileDropdown}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.dropdownHeader}>
                        <div className={styles.dropdownAvatar}>
                          {user?.profileImage?.url ? (
                            <img src={user.profileImage.url} alt={user.name} />
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
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleProfileNavigation('/profile')}
                        >
                          <ProfileIcon />
                          <span>View Profile</span>
                        </button>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleProfileNavigation('/settings')}
                        >
                          <SettingsIcon />
                          <span>Settings</span>
                        </button>
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
                >
                  Sign Up
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button with Icon Transformation */}
          <motion.button
            className={styles.mobileMenuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            {/* Hamburger Icon */}
            <svg 
              className={`${styles.hamburgerIcon} ${isMenuOpen ? styles.open : ''}`}
              viewBox="0 0 24 24" 
              width="28" 
              height="28"
            >
              <path
                fill="currentColor"
                d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
              />
            </svg>
            
            {/* Close Icon */}
            <svg 
              className={`${styles.closeIcon} ${isMenuOpen ? styles.open : ''}`}
              viewBox="0 0 24 24" 
              width="28" 
              height="28"
            >
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu Overlay and Sidebar */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Transparent Blurry Background Overlay */}
              <motion.div
                className={`${styles.mobileMenuOverlay} ${isMenuOpen ? styles.open : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Sliding Sidebar Menu */}
              <motion.div
                className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}
                initial={{ right: '-100%' }}
                animate={{ right: 0 }}
                exit={{ right: '-100%' }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
              >
                <div className={styles.mobileMenuContent}>
                  {/* Profile Header - Top Section */}
                  {isLoggedIn && (
                    <motion.div 
                      className={styles.mobileProfileHeader}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <div className={styles.mobileProfileAvatar}>
                        {user?.profileImage?.url ? (
                          <img src={user.profileImage.url} alt={user.name} />
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
                    </motion.div>
                  )}
                  
                  {/* Navigation Links - Middle Section */}
                  <motion.div 
                    className={styles.mobileNavSection}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {navLinks.map((link, index) => (
                      <motion.button
                        key={link.name}
                        onClick={() => handleMobileNavClick(link.to)}
                        className={`${styles.mobileNavLink} ${
                          location.pathname === link.to ? styles.active : ""
                        }`}
                        whileTap={{ scale: 0.97 }}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ 
                          delay: 0.3 + (index * 0.1), 
                          duration: 0.3 
                        }}
                      >
                        <div className={styles.mobileNavIcon}>
                          {/* Add icons based on the link name */}
                          {link.name === 'Home' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                              <polyline points="9,22 9,12 15,12 15,22"/>
                            </svg>
                          )}
                          {link.name === 'Venues' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                          )}
                          {link.name === 'Play Together' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                              <circle cx="9" cy="7" r="4"/>
                              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                              <path d="M16 3.13a4 4 0 010 7.75"/>
                            </svg>
                          )}
                          {link.name === 'Academy' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                            </svg>
                          )}
                        </div>
                        <span>{link.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                  
                  {/* Bottom Actions */}
                  {isLoggedIn ? (
                    <motion.div 
                      className={styles.mobileBottomActions}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <motion.button
                        className={styles.mobileActionBtn}
                        onClick={() => handleProfileNavigation('/profile')}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ProfileIcon />
                        <span>Profile</span>
                      </motion.button>
                      <motion.button
                        className={styles.mobileActionBtn}
                        onClick={() => handleProfileNavigation('/')}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SettingsIcon />
                        <span>Account & Settings</span>
                      </motion.button>
                      <motion.button
                        className={`${styles.mobileActionBtn} ${styles.mobileLogoutBtn}`}
                        onClick={handleLogout}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogoutIcon />
                        <span>Logout</span>
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className={styles.mobileAuthSection}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
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
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

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
    </>
  );
};

export default Navbar;
