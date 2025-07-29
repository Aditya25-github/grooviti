import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./NavBar.module.css";
import logo from "../../assets/sports_assets/logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Venues", path: "/Venues" },
  { name: "Play Together", path: "/communities" },
  { name: "Academy", path: "/academy" },
];

const getActivePath = () => window.location.hash || "/";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState(getActivePath());

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage (0-100)
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        10000;

      // Set visibility threshold (e.g., 10% of page scrolled)
      const visibilityThreshold = 10; // Percentage of page to scroll before showing navbar
      setScrolled(scrollPercent > visibilityThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      role="navigation"
      aria-label="Main Navigation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Rest of your JSX remains exactly the same */}
      <div className={styles.container}>
        <div className={styles.logo}>
          <a href="/" aria-label="Go to home">
            <img src={logo} alt="Grooviti Logo" className={styles.logo} />
          </a>
        </div>
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.path}
              className={`${styles.navLink} ${
                activePath === link.path ? styles.active : ""
              }`}
              tabIndex="0"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              aria-current={activePath === link.path ? "page" : undefined}
            >
              <span>{link.name}</span>
              <span className={styles.underline}></span>
            </motion.a>
          ))}
        </div>
        <div className={styles.authButtons}>
          <motion.button
            className={styles.loginBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            tabIndex="0"
          >
            Login
          </motion.button>
          <motion.button
            className={styles.signupBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            tabIndex="0"
          >
            Sign Up
          </motion.button>
        </div>
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Mobile menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path
                fill="currentColor"
                d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
              />
            </svg>
          )}
        </button>
      </div>
      <motion.div
        className={styles.mobileMenu}
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto", pointerEvents: "auto" },
          closed: { opacity: 0, height: 0, pointerEvents: "none" },
        }}
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
              tabIndex="0"
              aria-current={activePath === link.path ? "page" : undefined}
            >
              {link.name}
            </motion.a>
          ))}
          <div className={styles.mobileAuthButtons}>
            <button className={styles.mobileLoginBtn}>Login</button>
            <button className={styles.mobileSignupBtn}>Sign Up</button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
