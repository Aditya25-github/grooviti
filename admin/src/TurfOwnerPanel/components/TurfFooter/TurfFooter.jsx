import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./TurfFooter.module.css";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const TurfFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Brand Section */}
        <div className={styles.brandSection}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>⚽</div>
            <span className={styles.brandText}>Grooviti.Sports</span>
          </div>
          <p className={styles.brandDescription}>
            Complete turf management solution for sports facility owners.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>
              <FaFacebook />
            </a>
            <a href="#" className={styles.socialLink}>
              <FaTwitter />
            </a>
            <a href="#" className={styles.socialLink}>
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.linksSection}>
          <h3 className={styles.sectionTitle}>Quick Links</h3>
          <ul className={styles.linksList}>
            <li>
              <NavLink to="/turf/dashboard" className={styles.footerLink}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/turf/bookings" className={styles.footerLink}>
                Bookings
              </NavLink>
            </li>
            <li>
              <NavLink to="/turf/facilities" className={styles.footerLink}>
                Facilities
              </NavLink>
            </li>
            <li>
              <NavLink to="/turf/reports" className={styles.footerLink}>
                Reports
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
              <span>+1 (555) 123-4567</span>
            </div>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <span>support@turfmanager.com</span>
            </div>
            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>123 Sports Avenue, City, State 12345</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <div className={styles.bottomContent}>
          <p className={styles.copyright}>
            © 2025 TurfManager. All rights reserved.
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

export default TurfFooter;
