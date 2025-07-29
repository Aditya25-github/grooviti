import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./TurfSideBar.module.css";
import {
  FaTachometerAlt,
  FaList,
  FaCalendarCheck,
  FaClock,
  FaTag,
  FaUsers,
  FaChartLine,
  FaComments,
  FaUndo,
  FaChartBar,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const TurfSideBar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.owner}>
        <img
          src="https://api.dicebear.com/9.x/micah/svg?seed=TurfOwner"
          alt="avatar"
          className={styles.avatar}
        />
        <div className={styles.info}>
          <div className={styles.name}>Mike Wilson</div>
          <div className={styles.role}>Turf Owner</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink
              to="/turf/dashboard"
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
              to="/turf/listings"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaList className={styles.icon} />
              <span>Turf Listings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/turf/bookings"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaCalendarCheck className={styles.icon} />
              <span>Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/turf/slot-management"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaClock className={styles.icon} />
              <span>Slot Management</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/turf/pricing"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaTag className={styles.icon} />
              <span>Pricing</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/turf/staff"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaUsers className={styles.icon} />
              <span>Staff</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/turf/revenue"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaChartLine className={styles.icon} />
              <span>Revenue</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/turf/feedback"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaComments className={styles.icon} />
              <span>Feedback</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/turf/refunds"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaUndo className={styles.icon} />
              <span>Refunds</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/turf/analytics"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FaChartBar className={styles.icon} />
              <span>Analytics</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/turf/reports"
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
          to="/turf/settings"
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

export default TurfSideBar;
