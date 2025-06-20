import React from "react";
import "./Footer.css";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets.js";

const Footer = () => {
  return (
    <motion.footer
      className="footer"
      id="footer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="footer-content">
        <motion.div
          className="footer-content-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <img className="logo" src={assets.logo1} alt="Grooviti Logo" />
          <p>BOOK IT. GROOVE IT. LIVE IT.</p>
          <div className="footer-social-icons">
            <motion.a
              href="https://www.instagram.com/grooviti/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src={assets.instagram_icon} alt="Instagram" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </motion.a>
            <motion.a
              href="https://x.com/Groov_iti"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src={assets.twitter_icon} alt="Twitter" />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          className="footer-content-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About-Us</li>
            <li>Contact-Us</li>
            <li>Privacy-policy</li>
          </ul>
        </motion.div>

        <motion.div
          className="footer-content-right"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>
              <a href="tel:+919404571327">+91 940-457-1327</a>
            </li>
            <li>
              <a href="mailto:groov.iti25@gmail.com">groov.iti25@gmail.com</a>
            </li>
          </ul>
        </motion.div>
      </div>

      <hr />
      <motion.p
        className="footer-copyright"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Copyright 2025 &copy; grooviti.com - All Rights Reserved.
      </motion.p>
    </motion.footer>
  );
};

export default Footer;
