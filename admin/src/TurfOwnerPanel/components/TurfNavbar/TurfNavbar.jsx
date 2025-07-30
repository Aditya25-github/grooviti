import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./TurfNavbar.module.css";
import {
  FaBell,
  FaSearch,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

const TurfNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      message: "New booking confirmed for Turf A",
      time: "5m ago",
      unread: true,
    },
    {
      id: 2,
      message: "Payment received ₹2,000 from John Doe",
      time: "15m ago",
      unread: true,
    },
    {
      id: 3,
      message: "Turf B maintenance completed",
      time: "1h ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        {/* Logo Section */}
        <div className={styles.brand}>
          <div className={styles.logoIcon}>⚽</div>
          <span className={styles.brandText}>Grooviti.Sports</span>
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
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Search */}
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
            />
          </div>

          {/* Notifications */}
          <div className={styles.notificationWrapper}>
            <button
              className={styles.iconButton}
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <FaBell className={styles.icon} />
              {unreadCount > 0 && (
                <span className={styles.badge}>{unreadCount}</span>
              )}
            </button>

            {isNotificationOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <h3 className={styles.dropdownTitle}>Notifications</h3>
                  <span className={styles.notificationCount}>
                    {unreadCount} new
                  </span>
                </div>
                <div className={styles.notificationList}>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`${styles.notificationItem} ${
                        notification.unread ? styles.unread : ""
                      }`}
                    >
                      <p className={styles.notificationText}>
                        {notification.message}
                      </p>
                      <span className={styles.notificationTime}>
                        {notification.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.dropdownFooter}>
                  <button className={styles.viewAllBtn}>View All</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className={styles.profileWrapper}>
            <button
              className={styles.profileButton}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img
                src="https://api.dicebear.com/9.x/micah/svg?seed=TurfOwner"
                alt="Profile"
                className={styles.profileImage}
              />
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>Aditya Divate</span>
                <span className={styles.profileRole}>Turf Owner</span>
              </div>
              <FaChevronDown className={styles.chevron} />
            </button>

            {isProfileOpen && (
              <div className={styles.dropdown}>
                <div className={styles.profileDropdown}>
                  <div className={styles.profileHeader}>
                    <img
                      src="https://api.dicebear.com/9.x/micah/svg?seed=TurfOwner"
                      alt="Profile"
                      className={styles.profileImageLarge}
                    />
                    <div>
                      <div className={styles.profileNameLarge}>
                        Aditya Divate
                      </div>
                      <div className={styles.profileEmail}>
                        adityadivate@gmail.com
                      </div>
                    </div>
                  </div>

                  <div className={styles.profileMenu}>
                    <button className={styles.menuItem}>
                      <FaUser className={styles.menuIcon} />
                      <span>My Profile</span>
                    </button>
                    <button className={styles.menuItem}>
                      <FaCog className={styles.menuIcon} />
                      <span>Settings</span>
                    </button>
                    <hr className={styles.menuDivider} />
                    <button className={styles.menuItem}>
                      <FaSignOutAlt className={styles.menuIcon} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TurfNavbar;
