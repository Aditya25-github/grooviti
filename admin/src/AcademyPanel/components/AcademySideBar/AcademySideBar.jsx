import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./AcademySideBar.module.css";
import {
  FaTachometerAlt,
  FaUserFriends,
  FaMoneyBillWave,
  FaRegCreditCard,
  FaCalendarAlt,
  FaUsersCog,
  FaUserPlus,
  FaChartLine,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const AcademySideBar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.owner}>
        <img
          src="https://api.dicebear.com/9.x/micah/svg?seed=Destiny"
          alt="avatar"
          className={styles.avatar}
        />
        <div className={styles.info}>
          <div className={styles.name}>John Smith</div>
          <div className={styles.role}>Academy Owner</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink
              to="/academy/dashboard"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaTachometerAlt className={styles.icon} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/academy/attendance"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaUserFriends className={styles.icon} />
              <span>Attendance Management</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/academy/fee-collection"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaMoneyBillWave className={styles.icon} />
              <span>Fee Collection</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/academy/payment-tracking"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaRegCreditCard className={styles.icon} />
              <span>Payment Tracking</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/academy/batch-schedule"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaCalendarAlt className={styles.icon} />
              <span>Batch & Schedule</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/academy/coach-staff"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaUsersCog className={styles.icon} />
              <span>Coach & Staff Roles</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/academy/student-onboarding"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaUserPlus className={styles.icon} />
              <span>Student Onboarding</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/academy/performance-tracking"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaChartLine className={styles.icon} />
              <span>Performance Tracking</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/academy/reports"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaFileAlt className={styles.icon} />
              <span>Reports</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <footer className={styles.footer}>
        <NavLink
          to="/academy/academy-settings"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          <FaCog className={styles.icon} />
          <span>Settings</span>
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          <FaSignOutAlt className={styles.icon} />
          <span>Logout</span>
        </NavLink>
      </footer>
    </aside>
  );
};

export default AcademySideBar;
