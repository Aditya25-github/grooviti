import React from "react";
import styles from "./Footer.module.css";
import assets from "../../assets/sports_assets/assets.js";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.div
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
          <img className={styles.logo} src={assets.logo} alt="Grooviti Logo" />
          <p>BOOK IT. GROOVE IT. LIVE IT.</p>
          <div className={styles.footerSocialIcons}>
  <motion.a
    href="https://www.instagram.com/grooviti/"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Inline Instagram SVG */}
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#fff" viewBox="0 0 24 24">
      <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zM12 7a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 .001 6.001A3 3 0 0 1 12 9zm4.5-3a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
    </svg>
  </motion.a>

  <motion.a
    href="https://www.linkedin.com/"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Inline LinkedIn SVG */}
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#fff" viewBox="0 0 24 24">
      <path d="M19 0h-14C2.238 0 0 2.238 0 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5V5c0-2.762-2.238-5-5-5zM7 19H4v-9h3v9zM5.5 8.5c-.966 0-1.75-.784-1.75-1.75S4.534 5 5.5 5s1.75.784 1.75 1.75S6.466 8.5 5.5 8.5zM20 19h-3v-4.5c0-1.1-.9-2-2-2s-2 .9-2 2V19h-3v-9h3v1.5c.7-1.1 2-1.5 3.5-1.5 2.5 0 4.5 2 4.5 4.5V19z"/>
    </svg>
  </motion.a>

  <motion.a
    href="https://x.com/Groov_iti"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Inline Twitter/X SVG */}
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#fff" viewBox="0 0 24 24">
      <path d="M22.25 0h-3.967l-5.553 7.25L6.25 0H0l8.667 11.417L0 24h3.967l6.25-8.167L17.75 24H24l-9.333-12.25L22.25 0z"/>
    </svg>
  </motion.a>
</div>
        </motion.div>

        <motion.div
          className={styles.footerContentCenter}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2>COMPANY</h2>
          <ul>
            <li><img src={assets.home} alt="Home" /> Home</li>
            <li><img src={assets.ball} alt="Sports" /> Sports</li>
            <li><img src={assets.about} alt="About Us" /> About Us</li>
            <li><img src={assets.contact} alt="Contact Us" /> Contact Us</li>
            <li><img src={assets.privacy} alt="Privacy" /> Privacy Policy</li>
          </ul>
        </motion.div>

        <motion.div
          className={styles.footerContentRight}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><a href="tel:+919404571327">+91 940-457-1327</a></li>
            <li><a href="mailto:groov.iti25@gmail.com">groov.iti25@gmail.com</a></li>
          </ul>
        </motion.div>
      </div>

      <hr />
      <motion.p
        className={styles.footerCopyright}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Copyright 2025 &copy; grooviti.com - All Rights Reserved.
      </motion.p>
    </motion.div>
  );
};

export default Footer;
