import React from "react";
import styles from "./Footer.module.css";
import logo from "../../assets/sports_assets/logo.png"; // Directly import the logo
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaHome,
  FaFootballBall,
  FaInfoCircle,
  FaEnvelope,
  FaPhone,
  FaShieldAlt
} from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      className={styles.footer}
      id="footer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={styles.footerContent}>
        <motion.div
          className={styles.footerContentLeft}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <img className={styles.logo} src={logo} alt="Grooviti Logo" /> {/* Use the imported logo */}
          {/* Rest of your code remains the same */}
          <p className={styles.tagline}>BOOK IT. GROOVE IT. LIVE IT.</p>
          <p className={styles.description}>
            Your premier destination for sports event bookings and unforgettable experiences.
          </p>
          <div className={styles.footerSocialIcons}>
            <motion.a
              href="https://www.instagram.com/grooviti/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              aria-label="Instagram"
            >
              <FaInstagram className={styles.icon} />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              aria-label="LinkedIn"
            >
              <FaLinkedin className={styles.icon} />
            </motion.a>

            <motion.a
              href="https://x.com/Groov_iti"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              aria-label="Twitter"
            >
              <FaTwitter className={styles.icon} />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          className={styles.footerContentCenter}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>COMPANY</h2>
          <ul className={styles.navLinks}>
            <li>
              <FaHome className={styles.navIcon} />
              <span>Home</span>
            </li>
            <li>
              <FaFootballBall className={styles.navIcon} />
              <span>Sports</span>
            </li>
            <li>
              <FaInfoCircle className={styles.navIcon} />
              <span>About Us</span>
            </li>
            <li>
              <FaEnvelope className={styles.navIcon} />
              <span>Contact Us</span>
            </li>
            <li>
              <FaShieldAlt className={styles.navIcon} />
              <span>Privacy Policy</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          className={styles.footerContentRight}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>GET IN TOUCH</h2>
          <ul className={styles.contactInfo}>
            <li>
              <FaPhone className={styles.contactIcon} style={{ transform: 'scaleX(-1)' }} />
              <a href="tel:+919404571327">+91 940-457-1327</a>
            </li>
            <li>
              <FaEnvelope className={styles.contactIcon} />
              <a href="mailto:groov.iti25@gmail.com">groov.iti25@gmail.com</a>
            </li>
          </ul>
        </motion.div>
      </div>

      <hr className={styles.divider} />
      <motion.div
        className={styles.footerBottom}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <p className={styles.footerCopyright}>
          Copyright &copy; {new Date().getFullYear()} grooviti.com - All Rights Reserved.
        </p>
        <div className={styles.legalLinks}>
          <a href="#">Terms of Service</a>
          <span>|</span>
          <a href="#">Privacy Policy</a>
          <span>|</span>
          <a href="#">Cookie Policy</a>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;