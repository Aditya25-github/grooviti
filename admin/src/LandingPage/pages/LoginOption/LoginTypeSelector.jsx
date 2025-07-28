import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaFutbol, FaGraduationCap } from "react-icons/fa";
import styles from "./LoginTypeSelector.module.css";

const LoginTypeSelector = () => {
  const navigate = useNavigate();

  const handleLoginClick = (type) => {
    navigate(`/login/${type}`);
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Choose Your Login Type</h1>
        <p className={styles.subtitle}>
          Select your role to access your personalized dashboard
        </p>
      </header>

      <div className={styles.options}>
        <div className={styles.card}>
          <div className={`${styles.iconWrapper} ${styles.event}`}>
            <FaCalendarAlt className={styles.icon} />
          </div>
          <h2 className={styles.cardTitle}>Event Host</h2>
          <p className={styles.cardDesc}>
            Manage and organize sports events, tournaments, and competitions
          </p>
          <button
            className={styles.button}
            onClick={() => handleLoginClick("event")}
          >
            Log in as Event Host
          </button>
        </div>

        <div className={styles.card}>
          <div className={`${styles.iconWrapper} ${styles.turf}`}>
            <FaFutbol className={styles.icon} />
          </div>
          <h2 className={styles.cardTitle}>Turf Owner</h2>
          <p className={styles.cardDesc}>
            Manage your sports facilities, bookings, and venue operations
          </p>
          <button
            className={styles.button}
            onClick={() => handleLoginClick("turf")}
          >
            Log in as Turf Owner
          </button>
        </div>

        <div className={styles.card}>
          <div className={`${styles.iconWrapper} ${styles.academy}`}>
            <FaGraduationCap className={styles.icon} />
          </div>
          <h2 className={styles.cardTitle}>Academy Owner</h2>
          <p className={styles.cardDesc}>
            Oversee training programs, student progress, and academy management
          </p>
          <button
            className={styles.button}
            onClick={() => handleLoginClick("academy")}
          >
            Log in as Academy Owner
          </button>
        </div>
      </div>
    </main>
  );
};
export default LoginTypeSelector;
