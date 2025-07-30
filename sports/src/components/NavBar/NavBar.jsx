import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./NavBar.module.css";
import logo from "../../assets/sports_assets/logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Venues", path: "/Venues" },
  { name: "Play Together", path: "/communities" },
  { name: "Academy", path: "/academy" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const [activePath, setActivePath] = useState(window.location.pathname);

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

    const handleRouteChange = () => {
      setActivePath(window.location.pathname);
      setIsMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return (
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
        <motion.div 
          className={styles.logo}
          whileHover={{ scale: 1.05 }}
        >
          <a href="/" aria-label="Go to home">
            <img src={logo} alt="Grooviti Logo" />
          </a>
        </motion.div>

        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.path}
              className={`${styles.navLink} ${
                activePath === link.path ? styles.active : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.name}
              <motion.span 
                className={styles.underline}
                initial={{ width: 0 }}
                animate={{ width: activePath === link.path ? "100%" : 0 }}
              />
            </motion.a>
          ))}
        </div>

        <div className={styles.authButtons}>
          <motion.button
            className={styles.loginBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
          <motion.button
            className={styles.signupBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>

        <motion.button
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
        </motion.button>
      </div>

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
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.path}
                  className={`${styles.mobileNavLink} ${
                    activePath === link.path ? styles.active : ""
                  }`}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <div className={styles.mobileAuthButtons}>
                <motion.button
                  className={styles.mobileLoginBtn}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                <motion.button
                  className={styles.mobileSignupBtn}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;