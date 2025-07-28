import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./TurfNavbar.module.css";
import { FaBell, FaSearch, FaUser } from "react-icons/fa";

const TurfNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        {/* Logo Section */}
        <div className={styles.brand}>
          <div className={styles.logoIcon}>⚽</div>
          <span className={styles.brandText}>TurfManager</span>
        </div>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <NavLink
            to="/turf/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/turf/bookings"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Bookings
          </NavLink>
          <NavLink
            to="/turf/facilities"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Facilities
          </NavLink>
          <NavLink
            to="/turf/reports"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Reports
          </NavLink>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Search */}
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search bookings..."
              className={styles.searchInput}
            />
          </div>

          {/* Notifications */}
          <button className={styles.iconButton}>
            <FaBell className={styles.icon} />
            <span className={styles.badge}>3</span>
          </button>

          {/* Profile */}
          <div className={styles.profile}>
            <img
              src="https://api.dicebear.com/9.x/micah/svg?seed=TurfOwner"
              alt="Profile"
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>Mike Wilson</span>
              <span className={styles.profileRole}>Turf Owner</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TurfNavbar;
