import React, { useState, useEffect } from "react";
import styles from "./EventDashboard.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaWallet,
  FaUsers,
  FaMoneyBillWave,
  FaPlus,
  FaEye,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";

export default function EventDashboard({ url }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventRevenue, setEventRevenue] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("organizerEmail");
      if (!email) {
        setLoading(false);
        return;
      }
      try {
        // Fetch events
        const eventsResponse = await axios.get(
          `${url}/api/event/my-events?email=${email}`
        );
        if (eventsResponse.data.success) {
          const sortedEvents = eventsResponse.data.events.reverse();
          setEvents(sortedEvents);
        }

        // Fetch actual revenue from bookings
        const revenueResponse = await axios.get(
          `${url}/api/booking/event-revenue?email=${email}`
        );
        if (revenueResponse.data.success) {
          setEventRevenue(revenueResponse.data.data || {});
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  // Compute dynamic stats
  const totalEvents = events.length;
  const totalBookings = events.reduce((acc, ev) => acc + (ev.ticketsSold || 0), 0);
  
  // Calculate total revenue from actual booking amounts
  const totalRevenue = Object.values(eventRevenue).reduce((acc, event) => {
    return acc + (event.totalRevenue || 0);
  }, 0);
  const totalParticipants = events.reduce(
    (acc, ev) => acc + (ev.attendees || ev.ticketsSold || 0),
    0
  );

  const summary = [
    {
      label: "Total Events",
      value: totalEvents,
      accent: "#7f9cf5",
      icon: <FaCalendarAlt />,
      desc: "All time hosted events",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      accent: "#85d6b5",
      icon: <FaWallet />,
      desc: "Confirmed ticket orders",
    },
    {
      label: "Revenue",
      value: `Rs. ${totalRevenue.toFixed(2)}`,
      accent: "#d5b7fb",
      icon: <FaMoneyBillWave />,
      desc: "Net estimated revenue",
    },
    {
      label: "Participants",
      value: totalParticipants,
      accent: "#ffa085",
      icon: <FaUsers />,
      desc: "Total people attended",
    },
  ];

  const recentEvents = events.slice(0, 4).map((ev, idx) => {
    const colors = ["#7f9cf5", "#d5b7fb", "#ffa085", "#85d6b5"];
    const accentColors = ["#edeffc", "#f6edfc", "#fcedef", "#ebf9f3"];
    return {
      name: ev.name,
      date: ev.date || ev.startDate || "TBD",
      attendees: ev.attendees || ev.ticketsSold || 0,
      status: ev.status || "Active",
      icon: <FaCalendarAlt color={colors[idx % colors.length]} />,
      accent: accentColors[idx % accentColors.length],
    };
  });

  const team = [
    {
      name: "Logged in as",
      role: "Event Organizer",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      online: true,
    },
  ];

  return (
    <div className={styles.dashboardMain}>
      <div className={styles.dashboardHeader}>
        <h2>Dashboard Overview</h2>
        <span>Welcome back! Here's what's happening with your events.</span>
      </div>
      <div className={styles.dashboardSummaryRow}>
        {summary.map((s, idx) => (
          <div
            key={idx}
            className={styles.summaryCard}
            style={{ borderColor: s.accent }}
          >
            <div
              className={styles.summaryIcon}
              style={{ background: s.accent }}
            >
              {s.icon}
            </div>
            <div className={styles.summaryMeta}>
              <div className={styles.summaryValue}>{loading ? "..." : s.value}</div>
              <div className={styles.summaryLabel}>{s.label}</div>
              <div className={styles.summaryDesc}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.dashboardContentRow}>
        <div className={styles.mainLeft}>
          <div className={`${styles.card} ${styles.recentEvents}`}>
            <div className={styles.cardHead}>
              <b>Recent Events</b>
              <Link className={styles.cardLink} to="/event/list">
                View All
              </Link>
            </div>
            <div className={styles.eventList}>
              {loading ? (
                <div style={{ padding: "20px", color: "#666" }}>Loading events...</div>
              ) : recentEvents.length === 0 ? (
                <div style={{ padding: "20px", color: "#666" }}>No events found.</div>
              ) : (
                recentEvents.map((ev, idx) => (
                  <div
                    className={styles.eventRow}
                    key={idx}
                    style={{ background: ev.accent }}
                  >
                    <span className={styles.eventIcon}>{ev.icon}</span>
                    <span>
                      <b>{ev.name}</b> <br />
                      <span className={styles.eventDate}>
                        {ev.date} &nbsp;•&nbsp; {ev.attendees} attendees
                      </span>
                    </span>
                    <span
                      className={`${styles.eventStatus} ${
                        styles["status" + ev.status]
                          ? styles["status" + ev.status]
                          : ""
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className={styles.mainRight}>
          <div className={`${styles.card} ${styles.quickActions}`}>
            <b>Quick Actions</b>
            <ul>
              <li>
                <Link to="/event/add" style={{color: "inherit", textDecoration: "none", display: "flex", alignItems: "center"}}>
                  <FaPlus className={styles.actionIcon} /> Create New Event
                </Link>
              </li>
              <li>
                <Link to="/event/orders" style={{color: "inherit", textDecoration: "none", display: "flex", alignItems: "center"}}>
                  <FaEye className={styles.actionIcon} /> View Bookings
                </Link>
              </li>
              <li>
                <Link to="/event/list" style={{color: "inherit", textDecoration: "none", display: "flex", alignItems: "center"}}>
                  <FaFileAlt className={styles.actionIcon} /> Manage Events
                </Link>
              </li>
              <li>
                <Link to="/event/settings" style={{color: "inherit", textDecoration: "none", display: "flex", alignItems: "center"}}>
                  <FaCog className={styles.actionIcon} /> Manage Settings
                </Link>
              </li>
            </ul>
          </div>
          <div className={`${styles.card} ${styles.teamBox}`}>
            <b>Team Details</b>
            <ul>
              {team.map((m, idx) => (
                <li key={idx}>
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className={styles.teamAvatar}
                  />
                  <div>
                    <span className={styles.teamName}>{m.name}</span>
                    <span className={styles.teamRole}>{m.role}</span>
                  </div>
                  <span
                    className={`${styles.statusDot}${
                      m.online ? " " + styles.online : " " + styles.offline
                    }`}
                  ></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
