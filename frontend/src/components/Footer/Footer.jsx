import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
        
        {/* LEFT SECTION */}
        <motion.div
          className="footer-section"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="footer-logo">GROOVITI.</h2>
          <p>The ultimate platform for events, sports, and academy management.</p>

          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="https://www.instagram.com/grooviti/" target="_blank" rel="noreferrer">
              <img src={assets.instagram_icon} alt="Instagram" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </motion.div>

        {/* QUICK LINKS */}
        <motion.div
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><a href="https://www.sports.grooviti.com" target="_blank" rel="noreferrer">Sports</a></li>
            <li>Academy</li>
          </ul>
        </motion.div>

        {/* SUPPORT */}
        <motion.div
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </motion.div>

        {/* CONTACT INFO */}
        <motion.div
          className="footer-section"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h4>Contact Info</h4>
          <ul>
            <li>📧 <a href="mailto:groov.iti25@gmail.com">groov.iti25@gmail.com</a></li>
            <li>📞 <a href="tel:+919404571327">+91 940-457-1327</a></li>
            <li>📍 Ravet, PCMC</li>
          </ul>
        </motion.div>
      </div>

      <hr />
      <p className="footer-bottom">© 2025 Grooviti. All rights reserved.</p>
    </motion.footer>
  );
};

export default Footer;
