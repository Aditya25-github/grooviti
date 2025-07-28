import React, { useEffect, useState } from "react";
import styles from "./NotificationsPage.module.css";
import axios from "axios";
import { toast } from "react-toastify";

const NotificationsPage = ({ url, token }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.notifications || []);
      } catch (error) {
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [url, token]);

  return (
    <div className={styles.container}>
      <h1>Notifications</h1>
      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications to display.</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`${styles.notificationItem} ${
                notif.read ? styles.read : styles.unread
              }`}
            >
              <p>{notif.message}</p>
              <span className={styles.date}>
                {new Date(notif.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
