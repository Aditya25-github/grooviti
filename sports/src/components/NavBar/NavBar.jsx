import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { StoreContext } from "../../context/StoreContext";
import styles from "./NavBar.module.css";
import logo from "../../assets/sports_assets/logo.png";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";

// SVG Icons
const icons = {
  ProfileIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  ChevronDownIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  LogoutIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  SettingsIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.09a2 2 0 0 0-2.73.73l-.26.43a2 2 0 0 0 .73 2.73l.09.15a2 2 0 0 1 0 2.73l-.09.15a2 2 0 0 0-.73 2.73l.26.43a2 2 0 0 0 2.73.73l.15-.09a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.09a2 2 0 0 0 2.73-.73l.26-.43a2 2 0 0 0-.73-2.73l-.09-.15a2 2 0 0 1 0-2.73l.09-.15a2 2 0 0 0 .73-2.73l-.26-.43a2 2 0 0 0-2.73-.73l-.15.09a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  BookingsIcon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Venues", to: "/venues" },
  { name: "Play Together", to: "/playtogether" },
  { name: "Academy", to: "/academy" },
];

const Navbar = () => {
  const { isLoggedIn, user, setToken, setUser } = useContext(StoreContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileNavClick = (to) => {
    setIsMenuOpen(false);
    navigate(to);
  };

  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleCloseLoginModal = () => setIsLoginModalOpen(false);
  const handleSignupClick = () => setIsSignupModalOpen(true);
  const handleCloseSignupModal = () => setIsSignupModalOpen(false);
  const handleSwitchToLogin = () => { setIsSignupModalOpen(false); setIsLoginModalOpen(true); };
  const handleSwitchToSignup = () => { setIsLoginModalOpen(false); setIsSignupModalOpen(true); };

  const handleProfileClick = () => setIsProfileDropdownOpen(prev => !prev);
  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsProfileDropdownOpen(false);
    navigate('/');
    import('react-toastify').then(({ toast }) => toast.info("You have been logged out successfully"));
  };
  const handleProfileNavigation = (path) => {
    setIsProfileDropdownOpen(false);
    navigate(path);
  };

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
          scrollState === 'scrolled' ? styles.scrolled : scrollState === 'scrolling' ? styles.scrolling : ''
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.container}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <motion.img
              src={logo}
              alt="Grooviti Logo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className={styles.navLinks}>
            {navLinks.map((link) => (
              <motion.div key={link.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={link.to}
                  className={`${styles.navLink} ${location.pathname === link.to ? styles.active : ""}`}
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

          {/* Auth Section */}
          <div className={styles.authSection} ref={profileDropdownRef}>
            {isLoggedIn ? (
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
                  <icons.ChevronDownIcon />
                </motion.button>

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
                          <span className={styles.dropdownInitials}>
                            {getUserInitials(user?.name)}
                          </span>
                        </div>
                        <div className={styles.dropdownUserInfo}>
                          <p className={styles.dropdownName}>{user?.name || 'User'}</p>
                          <p className={styles.dropdownEmail}>{user?.email}</p>
                        </div>
                      </div>
                      <div className={styles.dropdownDivider}></div>
                      <div className={styles.dropdownMenu}>
                        <button className={styles.dropdownItem} onClick={() => handleProfileNavigation('/profile')}>
                          <icons.ProfileIcon />
                          <span>View Profile</span>
                        </button>
                        <button className={styles.dropdownItem} onClick={() => handleProfileNavigation('/my-bookings')}>
                          <icons.BookingsIcon />
                          <span>My Bookings</span>
                        </button>
                        <button className={styles.dropdownItem} onClick={() => handleProfileNavigation('/settings')}>
                          <icons.SettingsIcon />
                          <span>Settings</span>
                        </button>
                        <div className={styles.dropdownDivider}></div>
                        <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout}>
                          <icons.LogoutIcon />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
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

          {/* Mobile Menu Button */}
          <motion.button
            className={styles.mobileMenuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"  strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.mobileMenuContent}>
                <div className={styles.mobileNavLinks}>
                    {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.to}
                        className={`${styles.mobileNavLink} ${location.pathname === link.to ? styles.active : ""}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <motion.span
                            whileTap={{ scale: 0.97 }}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {link.name}
                        </motion.span>
                    </Link>
                    ))}
                </div>
                
                <div className={styles.mobileMenuDivider}></div>

                {isLoggedIn ? (
                  <div className={styles.mobileProfileSection}>
                    <div className={styles.mobileProfileHeader}>
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
                    </div>
                    <div className={styles.mobileProfileActions}>
                      <motion.button className={styles.mobileProfileBtn} onClick={() => handleProfileNavigation('/profile')} whileTap={{ scale: 0.95 }}>
                        <icons.ProfileIcon />
                        <span>View Profile</span>
                      </motion.button>
                      <motion.button className={styles.mobileProfileBtn} onClick={() => handleProfileNavigation('/my-bookings')} whileTap={{ scale: 0.95 }}>
                        <icons.BookingsIcon />
                        <span>My Bookings</span>
                      </motion.button>
                      <motion.button className={styles.mobileProfileBtn} onClick={() => handleProfileNavigation('/settings')} whileTap={{ scale: 0.95 }}>
                        <icons.SettingsIcon />
                        <span>Settings</span>
                      </motion.button>
                      <motion.button className={`${styles.mobileProfileBtn} ${styles.mobileLogoutBtn}`} onClick={handleLogout} whileTap={{ scale: 0.95 }}>
                        <icons.LogoutIcon />
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.mobileAuthButtons}>
                    <motion.button className={styles.mobileLoginBtn} whileTap={{ scale: 0.95 }} onClick={handleLoginClick}>
                      Login
                    </motion.button>
                    <motion.button className={styles.mobileSignupBtn} whileTap={{ scale: 0.95 }} onClick={handleSignupClick}>
                      Sign Up
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      <Login isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} onSwitchToSignup={handleSwitchToSignup} />
      <Signup isOpen={isSignupModalOpen} onClose={handleCloseSignupModal} onSwitchToLogin={handleSwitchToLogin} />
    </>
  );
};

export default Navbar;