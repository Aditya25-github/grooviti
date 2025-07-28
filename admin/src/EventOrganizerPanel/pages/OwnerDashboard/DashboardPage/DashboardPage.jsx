import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardPage.module.css";

const DashboardPage = ({ userName = "User", role = "Turf Owner" }) => {
  const navigate = useNavigate();

  // You can replace these with real data fetched from API
  const summary = {
    totalTurfs: 5,
    totalBookings: 20,
    totalRevenue: 15000,
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Welcome back, {userName}!</h1>
      <p className={styles.subtitle}>Here's your {role} dashboard overview.</p>

      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h2>{summary.totalTurfs}</h2>
          <p>Turfs Listed</p>
        </div>
        <div className={styles.card}>
          <h2>{summary.totalBookings}</h2>
          <p>Total Bookings</p>
        </div>
        <div className={styles.card}>
          <h2>₹{summary.totalRevenue.toLocaleString()}</h2>
          <p>Total Revenue</p>
        </div>
      </div>

      <div className={styles.quickLinks}>
        <h3>Quick Actions</h3>
        <div className={styles.linksGrid}>
          <button
            className={styles.actionBtn}
            onClick={() => navigate("/addturf")}
          >
            Add New Turf
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => navigate("/bookinglist")}
          >
            View Bookings
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => navigate("/profile")}
          >
            Manage Profile
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => navigate("/reviews")}
          >
            View Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
