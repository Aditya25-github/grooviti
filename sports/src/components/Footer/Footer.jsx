import React from "react";
import styles from "./Footer.module.css";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h1 className={styles.title}>Grooviti</h1>
            <p className={styles.description}>
              Your ultimate destination for sports venue booking and academy enrollment.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <FaInstagram className={styles.socialIcon} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <FaLinkedin className={styles.socialIcon} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <FaTwitter className={styles.socialIcon} />
              </a>
            </div>
          </div>

          <div className={styles.links}>
            <div className={styles.linksColumn}>
              <h2 className={styles.linksHeading}>Quick Links</h2>
              <div className={styles.linkList}>
                <a href="#" className={styles.linkItem}>Home</a>
                <a href="Venues" className={styles.linkItem}>Venues</a>
                <a href="academy" className={styles.linkItem}>Academies</a>
                <a href="AboutUs" className={styles.linkItem}>About Us</a>
              </div>
            </div>
            <div className={styles.linksColumn}>
              <h2 className={styles.linksHeading}>&nbsp;</h2>
              <div className={styles.linkList}>
                <a href="#" className={styles.linkItem}>Help Center</a>
                <a href="#" className={styles.linkItem}>Contact Us</a>
                <a href="#" className={styles.linkItem}>Privacy Policy</a>
                <a href="#" className={styles.linkItem}>Terms of Service</a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.copyright}>
          © 2024 Grooviti. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;