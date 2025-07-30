import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./TurfSideBar.module.css";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
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
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const TurfSideBar = () => {
  const navigate = useNavigate();
  const { setToken, setUserRole } = useContext(StoreContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("turfToken");
    localStorage.removeItem("userType");
    setToken(null);
    setUserRole(null);
    navigate("/turf/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        !event.target.closest(`.${styles.sidebar}`) &&
        !event.target.closest(`.${styles.hamburgerBtn}`)
      ) {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className={styles.hamburgerBtn}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          isMobileMenuOpen ? styles.sidebarOpen : ""
        }`}
      >
        {/* Mobile Close Button */}
        <button
          className={styles.mobileCloseBtn}
          onClick={closeMobileMenu}
          aria-label="Close mobile menu"
        >
          <FaTimes />
        </button>

        <div className={styles.owner}>
          <img
            src="https://api.dicebear.com/9.x/micah/svg?seed=TurfOwner"
            alt="avatar"
            className={styles.avatar}
          />
          <div className={styles.info}>
            <div className={styles.name}>Aditya Divate</div>
            <div className={styles.role}>Turf Owner</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink
                to="/turf/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <FaTachometerAlt className={styles.icon} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/turf/listings"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <FaList className={styles.icon} />
                <span>Turf Listings</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/turf/bookings"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <FaCalendarCheck className={styles.icon} />
                <span>Bookings</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/turf/slot-management"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <FaClock className={styles.icon} />
                <span>Slot Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/turf/pricing"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <FaTag className={styles.icon} />
                <span>Pricing</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/turf/staff"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <FaUsers className={styles.icon} />
                <span>Staff</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/turf/revenue"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <FaChartLine className={styles.icon} />
                <span>Revenue</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/turf/feedback"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <FaComments className={styles.icon} />
                <span>Feedback</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/turf/refunds"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <FaUndo className={styles.icon} />
                <span>Refunds</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/turf/analytics"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <FaChartBar className={styles.icon} />
                <span>Analytics</span>
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
            onClick={closeMobileMenu}
          >
            <FaCog className={styles.icon} />
            <span>Settings</span>
          </NavLink>
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className={styles.navLink}
          >
            <FaSignOutAlt className={styles.icon} />
            <span>Logout</span>
          </button>
        </footer>
      </aside>
    </>
  );
};

export default TurfSideBar;
