import React from "react";
import styles from "./AcademyNavbar.module.css";

const AcademyNavbar = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Grooviti.Sports</div>
      <nav className={styles.nav}>
        <a href="https://grooviti.com/about" target="_blank">
          About
        </a>
        <a href="https://grooviti.com/ContactUs" target="_blank">
          Contact
        </a>
        <a href="https://grooviti.com/" target="_blank">
          Help
        </a>
      </nav>
    </header>
  );
};

export default AcademyNavbar;
