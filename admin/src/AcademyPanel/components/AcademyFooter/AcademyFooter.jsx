import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./AcademyFooter.module.css";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const AcademyFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Brand Section */}
        <div className={styles.brandSection}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>🏆</div>
            <span className={styles.brandText}>Grooviti.Sports</span>
          </div>
          <p className={styles.brandDescription}>
            Complete sports academy management solution for training excellence.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>
              <FaFacebook />
            </a>
            <a
              href="https://x.com/Groov_iti"
              className={styles.socialLink}
              target="_blank"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/grooviti"
              className={styles.socialLink}
              target="_blank"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.linksSection}>
          <h3 className={styles.sectionTitle}>Quick Links</h3>
          <ul className={styles.linksList}>
            <li>
              <NavLink to="/academy/dashboard" className={styles.footerLink}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/academy/attendance" className={styles.footerLink}>
                Attendance
              </NavLink>
            </li>
            <li>
              <NavLink to="/academy/students" className={styles.footerLink}>
                Students
              </NavLink>
            </li>
            <li>
              <NavLink to="/academy/coaches" className={styles.footerLink}>
                Coaches
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className={styles.linksSection}>
          <h3 className={styles.sectionTitle}>Support</h3>
          <ul className={styles.linksList}>
            <li>
              <a href="#" className={styles.footerLink}>
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Contact Support
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.contactSection}>
          <h3 className={styles.sectionTitle}>Contact Us</h3>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              <span>+91 940-457-1327</span>
            </div>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <span>groov.iti25@gmail.com</span>
            </div>
            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>
                Grooviti Office, Malwale Nagar 2, Kiwale, Ravet,
                Pimpri-Chinchwad, Dehu Road, Maharashtra 412101
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <div className={styles.bottomContent}>
          <p className={styles.copyright}>
            © 2025 Grooviti. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>
              Privacy
            </a>
            <a href="#" className={styles.bottomLink}>
              Terms
            </a>
            <a href="#" className={styles.bottomLink}>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AcademyFooter;
