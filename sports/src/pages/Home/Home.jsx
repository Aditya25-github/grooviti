// SportsHomepage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const sports = [
  { name: "Badminton", image: "/images/badminton.jpg" },
  { name: "Football", image: "/images/football.jpg" },
  { name: "Cricket", image: "/images/cricket.jpg" },
  { name: "Swimming", image: "/images/swimming.jpg" },
  { name: "Tennis", image: "/images/tennis.jpg" },
  { name: "Table Tennis", image: "/images/tabletennis.jpg" },
];

const SportsHomepage = () => {
  const navigate = useNavigate();

  const handleSportClick = (sport) => {
    navigate(`/sports/${sport.toLowerCase()}`);
  };

  return (
    <div className={styles.homepage}>
      <header className={styles.sportsHeader}>
        <h2>Popular Sports</h2>
      </header>

      <div className={styles.sportsContainer}>
        {sports.map((sport) => (
          <div
            key={sport.name}
            className={styles.sportCard}
            onClick={() => handleSportClick(sport.name)}
          >
            <img src={sport.image} alt={sport.name} />
            <p>{sport.name}</p>
          </div>
        ))}
      </div>

      {/* <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerContentLeft}>
            <img className={styles.logo} src="/images/logo.png" alt="Grooviti Logo" />
            <p>BOOK IT. GROOVE IT. LIVE IT.</p>
            <div className={styles.footerSocialIcons}>
              <a href="https://www.instagram.com/grooviti/" target="_blank" rel="noopener noreferrer">
                <img src="/images/instagram.png" alt="Instagram" />
              </a>
              <a href="#">
                <img src="/images/linkedin.png" alt="LinkedIn" />
              </a>
              <a href="https://x.com/Groov_iti" target="_blank" rel="noopener noreferrer">
                <img src="/images/twitter.png" alt="Twitter" />
              </a>
            </div>
          </div>

          <div className={styles.footerContentCenter}>
            <h2>COMPANY</h2>
            <ul>
              <li>Home</li>
              <li>About-Us</li>
              <li>Contact-Us</li>
              <li>Privacy-policy</li>
            </ul>
          </div>

          <div className={styles.footerContentRight}>
            <h2>GET IN TOUCH</h2>
            <ul>
              <li><a href="tel:‪+919404571327‬">‪+91 940-457-1327‬</a></li>
              <li><a href="mailto:groov.iti25@gmail.com">groov.iti25@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <hr />
        <p className={styles.footerCopyright}>
          Copyright 2025 &copy; grooviti.com - All Rights Reserved.
        </p>
      </footer>*/}
    </div> 
  );
};

export default SportsHomepage;