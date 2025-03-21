import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="logo" src={assets.logo} alt="" />
          <p>GROOVE IT. BOOK IT. LIVE IT.</p>
          <div className="footer-social-icons">
            <a
              href="https://www.instagram.com/grooviti/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.instagram_icon} alt="Instagram" />
            </a>
            <img src={assets.linkedin_icon} alt="" />
            <a
              href="https://x.com/Groov_iti"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About-Us</li>
            <li>Contact-Us</li>
            <li>Privacy-policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91 940-457-1327</li>
            <li>groov.iti25@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 &copy; grooviti.com - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
