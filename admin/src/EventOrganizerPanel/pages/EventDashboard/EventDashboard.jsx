import React from "react";
import styles from "./EventDashboard.module.css";
import {
  FaCalendarAlt,
  FaWallet,
  FaUsers,
  FaMoneyBillWave,
  FaPlus,
  FaEye,
  FaFileAlt,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";

const summary = [
  {
    label: "Total Events",
    value: 142,
    accent: "#7f9cf5",
    icon: <FaCalendarAlt />,
    desc: "+12% from last month",
  },
  {
    label: "Total Bookings",
    value: 3247,
    accent: "#85d6b5",
    icon: <FaWallet />,
    desc: "+8% from last month",
  },
  {
    label: "Revenue",
    value: "$89,432",
    accent: "#d5b7fb",
    icon: <FaMoneyBillWave />,
    desc: "+15% from last month",
  },
  {
    label: "Participants",
    value: 12847,
    accent: "#ffa085",
    icon: <FaUsers />,
    desc: "+22% from last month",
  },
];

const recentEvents = [
  {
    name: "Summer Music Festival",
    date: "July 15, 2024",
    attendees: 1247,
    status: "Active",
    icon: <FaCalendarAlt color="#7f9cf5" />,
    accent: "#edeffc",
  },
  {
    name: "Tech Conference 2024",
    date: "Aug 22, 2024",
    attendees: 892,
    status: "Upcoming",
    icon: <FaWallet color="#d5b7fb" />,
    accent: "#f6edfc",
  },
  {
    name: "Art Exhibition",
    date: "June 10, 2024",
    attendees: 456,
    status: "Completed",
    icon: <FaFileAlt color="#ffa085" />,
    accent: "#fcedef",
  },
];

const team = [
  {
    name: "Sarah Wilson",
    role: "Event Manager",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    online: true,
  },
  {
    name: "Mike Johnson",
    role: "Marketing Lead",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    online: true,
  },
  {
    name: "Emma Davis",
    role: "Operations",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    online: false,
  },
];

export default function EventDashboard() {
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
              <div className={styles.summaryValue}>{s.value}</div>
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
              <a className={styles.cardLink} href="/">
                View All
              </a>
            </div>
            <div className={styles.eventList}>
              {recentEvents.map((ev, idx) => (
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
              ))}
            </div>
          </div>
        </div>
        <div className={styles.mainRight}>
          <div className={`${styles.card} ${styles.quickActions}`}>
            <b>Quick Actions</b>
            <ul>
              <li>
                <FaPlus className={styles.actionIcon} /> Create New Event
              </li>
              <li>
                <FaEye className={styles.actionIcon} /> View Bookings
              </li>
              <li>
                <FaFileAlt className={styles.actionIcon} /> Generate Report
              </li>
              <li>
                <FaCog className={styles.actionIcon} /> Manage Settings
              </li>
            </ul>
          </div>
          <div className={`${styles.card} ${styles.teamBox}`}>
            <b>Team Members</b>
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
