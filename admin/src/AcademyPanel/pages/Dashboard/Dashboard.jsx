import React, { useState } from "react";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  // Mock data for the dashboard
  const [stats] = useState({
    totalStudents: 248,
    studentsChange: 12,
    activeCoaches: 15,
    attendanceRate: 92,
    monthlyRevenue: 45000,
    revenueChange: 8,
    upcomingEvents: 3,
    newEnrollments: 6,
  });

  const [revenueData] = useState([
    { month: "Jan", amount: 32000, students: 180 },
    { month: "Feb", amount: 38000, students: 195 },
    { month: "Mar", amount: 35000, students: 210 },
    { month: "Apr", amount: 42000, students: 225 },
    { month: "May", amount: 45000, students: 248 },
  ]);

  const [attendanceData] = useState([
    { day: "Mon", rate: 88 },
    { day: "Tue", rate: 92 },
    { day: "Wed", rate: 95 },
    { day: "Thu", rate: 89 },
    { day: "Sat", rate: 96 },
    { day: "Sun", rate: 85 },
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: "enrollment",
      message: "New student Alex Johnson enrolled in Football Batch A",
      time: "2 minutes ago",
      icon: "👥",
    },
    {
      id: 2,
      type: "payment",
      message: "Payment of ₹2,500 received from Emma Davis",
      time: "15 minutes ago",
      icon: "💰",
    },
    {
      id: 3,
      type: "schedule",
      message: "Basketball training scheduled for tomorrow 6 AM",
      time: "1 hour ago",
      icon: "📅",
    },
    {
      id: 4,
      type: "achievement",
      message: "Mike Wilson completed Advanced Cricket Training",
      time: "2 hours ago",
      icon: "🏆",
    },
  ]);

  const [upcomingSchedule] = useState([
    {
      id: 1,
      sport: "Football",
      batch: "Batch A",
      time: "6:00 - 8:00 AM",
      coach: "Mike Johnson",
      students: 25,
      status: "confirmed",
    },
    {
      id: 2,
      sport: "Basketball",
      batch: "Batch B",
      time: "5:00 - 7:00 PM",
      coach: "Sarah Wilson",
      students: 18,
      status: "confirmed",
    },
    {
      id: 3,
      sport: "Cricket",
      batch: "Batch C",
      time: "4:00 - 6:00 PM",
      coach: "David Brown",
      students: 22,
      status: "pending",
    },
  ]);

  const maxRevenue = Math.max(...revenueData.map((d) => d.amount));
  const maxAttendance = Math.max(...attendanceData.map((d) => d.rate));

  const getGrowthIcon = (change) => {
    return change > 0 ? "📈" : change < 0 ? "📉" : "➡️";
  };

  const getGrowthClass = (change) => {
    return change > 0
      ? styles.positive
      : change < 0
      ? styles.negative
      : styles.neutral;
  };

  return (
    <div className={styles.dashboard}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.title}>Academy Dashboard</h1>
            <p className={styles.subtitle}>
              Welcome back! Here's what's happening at your academy today.
            </p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.timeSelector}>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={styles.select}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <button className={styles.primaryBtn}>📊 Generate Report</button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statTrend}>
              <span
                className={`${styles.trendIndicator} ${getGrowthClass(
                  stats.studentsChange
                )}`}
              >
                {getGrowthIcon(stats.studentsChange)} +{stats.studentsChange}
              </span>
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {stats.totalStudents.toLocaleString()}
            </div>
            <div className={styles.statLabel}>Total Students</div>
            <div className={styles.statSubtext}>
              +{stats.studentsChange} this month
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statTrend}>
              <span className={`${styles.trendIndicator} ${styles.positive}`}>
                📈 +2%
              </span>
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.attendanceRate}%</div>
            <div className={styles.statLabel}>Attendance Rate</div>
            <div className={styles.statSubtext}>This week average</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statTrend}>
              <span
                className={`${styles.trendIndicator} ${getGrowthClass(
                  stats.revenueChange
                )}`}
              >
                {getGrowthIcon(stats.revenueChange)} +{stats.revenueChange}%
              </span>
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              ₹{(stats.monthlyRevenue / 1000).toFixed(0)}k
            </div>
            <div className={styles.statLabel}>Monthly Revenue</div>
            <div className={styles.statSubtext}>
              +{stats.revenueChange}% from last month
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>👨‍🏫</div>
            <div className={styles.statTrend}>
              <span className={`${styles.trendIndicator} ${styles.positive}`}>
                ✓ All available
              </span>
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.activeCoaches}</div>
            <div className={styles.statLabel}>Active Coaches</div>
            <div className={styles.statSubtext}>All available</div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics Section */}
      <div className={styles.analyticsGrid}>
        {/* Revenue Chart */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Revenue Trends</h3>
            <div className={styles.chartToggle}>
              <button
                className={`${styles.toggleBtn} ${
                  selectedMetric === "revenue" ? styles.active : ""
                }`}
                onClick={() => setSelectedMetric("revenue")}
              >
                Revenue
              </button>
              <button
                className={`${styles.toggleBtn} ${
                  selectedMetric === "students" ? styles.active : ""
                }`}
                onClick={() => setSelectedMetric("students")}
              >
                Students
              </button>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.barChart}>
              {revenueData.map((data, index) => (
                <div key={index} className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(data.amount / maxRevenue) * 100}%`,
                      background: `linear-gradient(to top, #3b82f6, #60a5fa)`,
                    }}
                  >
                    <div className={styles.barValue}>
                      {selectedMetric === "revenue"
                        ? `₹${(data.amount / 1000).toFixed(0)}k`
                        : data.students}
                    </div>
                  </div>
                  <div className={styles.barLabel}>{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Chart */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Weekly Attendance</h3>
            <div className={styles.currentRate}>
              <span className={styles.rateValue}>{stats.attendanceRate}%</span>
              <span className={styles.rateLabel}>Current</span>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.lineChart}>
              <svg className={styles.chartSvg} viewBox="0 0 400 150">
                <defs>
                  <linearGradient
                    id="attendanceGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="url(#attendanceGradient)"
                  stroke="#10b981"
                  strokeWidth="3"
                  points={attendanceData
                    .map(
                      (data, index) =>
                        `${(index / (attendanceData.length - 1)) * 380 + 10},${
                          150 - (data.rate / maxAttendance) * 120
                        }`
                    )
                    .join(" ")}
                />
                {attendanceData.map((data, index) => (
                  <circle
                    key={index}
                    cx={(index / (attendanceData.length - 1)) * 380 + 10}
                    cy={150 - (data.rate / maxAttendance) * 120}
                    r="4"
                    fill="#10b981"
                  />
                ))}
              </svg>
              <div className={styles.chartLabels}>
                {attendanceData.map((data, index) => (
                  <span key={index} className={styles.chartLabel}>
                    {data.day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section Grid */}
      <div className={styles.lowerGrid}>
        {/* Recent Activities */}
        <div className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Activities</h3>
            <button className={styles.viewAllBtn}>View All</button>
          </div>
          <div className={styles.activityList}>
            {recentActivities.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>{activity.icon}</div>
                <div className={styles.activityContent}>
                  <p className={styles.activityMessage}>{activity.message}</p>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className={styles.scheduleCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Today's Schedule</h3>
            <button className={styles.addBtn}>+ Add Session</button>
          </div>
          <div className={styles.scheduleList}>
            {upcomingSchedule.map((session) => (
              <div key={session.id} className={styles.scheduleItem}>
                <div className={styles.scheduleTime}>
                  <div className={styles.timeSlot}>{session.time}</div>
                  <div
                    className={`${styles.sessionStatus} ${
                      styles[session.status]
                    }`}
                  >
                    {session.status}
                  </div>
                </div>
                <div className={styles.sessionDetails}>
                  <div className={styles.sessionTitle}>
                    {session.sport} - {session.batch}
                  </div>
                  <div className={styles.sessionInfo}>
                    Coach: {session.coach} • {session.students} students
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActionsCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
          </div>
          <div className={styles.actionGrid}>
            <button className={styles.actionBtn}>
              <div className={styles.actionIcon}>👥</div>
              <span>Add Student</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.actionIcon}>📅</div>
              <span>Schedule Class</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.actionIcon}>💰</div>
              <span>Collect Fee</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.actionIcon}>📊</div>
              <span>View Reports</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.actionIcon}>👨‍🏫</div>
              <span>Manage Staff</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.actionIcon}>⚙️</div>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
