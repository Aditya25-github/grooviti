import React, { useState } from "react";
import styles from "./TurfDashboard.module.css";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data for the dashboard
  const [stats] = useState({
    todayRevenue: 12450,
    revenueChange: 12.8,
    activeBookings: 24,
    pendingConfirmations: 4,
    slotFillRate: 78,
    fillRateChange: 3.2,
    customerRating: 4.8,
    totalReviews: 342,
  });

  const [turfRevenueData] = useState([
    { turf: "Turf A", amount: 15000 },
    { turf: "Turf B", amount: 12000 },
    { turf: "Turf C", amount: 18000 },
    { turf: "Turf D", amount: 14000 },
  ]);

  const [peakHourData] = useState([
    { hour: "6AM", bookings: 5 },
    { hour: "8AM", bookings: 8 },
    { hour: "10AM", bookings: 12 },
    { hour: "12PM", bookings: 15 },
    { hour: "2PM", bookings: 18 },
    { hour: "4PM", bookings: 22 },
    { hour: "6PM", bookings: 25 },
    { hour: "8PM", bookings: 20 },
  ]);

  const [bookingsByTime] = useState([
    { time: "6AM", today: 3, yesterday: 5 },
    { time: "8AM", today: 6, yesterday: 4 },
    { time: "10AM", today: 8, yesterday: 7 },
    { time: "12PM", today: 12, yesterday: 10 },
    { time: "2PM", today: 15, yesterday: 13 },
    { time: "4PM", today: 18, yesterday: 16 },
    { time: "6PM", today: 20, yesterday: 18 },
    { time: "8PM", today: 16, yesterday: 15 },
    { time: "10PM", today: 8, yesterday: 9 },
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: "booking",
      message: "New booking confirmed for Turf A at 6:00 PM",
      time: "2 mins ago",
      icon: "📅",
    },
    {
      id: 2,
      type: "payment",
      message: "Payment received ₹2,000 from John Doe",
      time: "5 mins ago",
      icon: "💰",
    },
    {
      id: 3,
      type: "cancellation",
      message: "Booking cancelled for Turf B at 4:00 PM",
      time: "15 mins ago",
      icon: "❌",
    },
    {
      id: 4,
      type: "review",
      message: "New 5-star review received for Turf C",
      time: "1 hour ago",
      icon: "⭐",
    },
  ]);

  const maxTurfRevenue = Math.max(...turfRevenueData.map((d) => d.amount));
  const maxPeakHour = Math.max(...peakHourData.map((d) => d.bookings));
  const maxBookingTime = Math.max(
    ...bookingsByTime.map((d) => Math.max(d.today, d.yesterday))
  );

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
    alert(`${action} functionality coming soon!`);
  };

  return (
    <div className={styles.dashboard}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.title}>Dashboard Overview</h1>
            <p className={styles.subtitle}>
              Monitor your turf operations and performance metrics.
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
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statTrend}>
              <span className={styles.trendUp}>📈 +{stats.revenueChange}%</span>
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              ₹{stats.todayRevenue.toLocaleString()}
            </div>
            <div className={styles.statLabel}>Today's Revenue</div>
            <div className={styles.statSubtext}>
              +{stats.revenueChange}% vs yesterday
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statTrend}>
              <span className={styles.trendInfo}>
                ℹ️ {stats.pendingConfirmations} pending
              </span>
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.activeBookings}</div>
            <div className={styles.statLabel}>Active Bookings</div>
            <div className={styles.statSubtext}>
              {stats.pendingConfirmations} pending confirmations
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statTrend}>
              <span className={styles.trendUp}>
                📈 +{stats.fillRateChange}%
              </span>
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.slotFillRate}%</div>
            <div className={styles.statLabel}>Slot Fill Rate</div>
            <div className={styles.statSubtext}>
              +{stats.fillRateChange}% this week
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statTrend}>
              <span className={styles.trendGood}>⭐ Excellent</span>
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.customerRating}</div>
            <div className={styles.statLabel}>Customer Rating</div>
            <div className={styles.statSubtext}>
              {stats.totalReviews} reviews this month
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Turf-wise Revenue */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Turf-wise Revenue</h3>
            <div className={styles.chartPeriod}>Last 7 days</div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.barChart}>
              {turfRevenueData.map((data, index) => (
                <div key={index} className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(data.amount / maxTurfRevenue) * 100}%`,
                      background: `linear-gradient(to top, #10b981, #34d399)`,
                    }}
                  >
                    <div className={styles.barValue}>
                      ₹{(data.amount / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div className={styles.barLabel}>{data.turf}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Hour Analysis */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Peak Hour Analysis</h3>
            <div className={styles.viewDetails}>View Details</div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.lineChart}>
              <svg className={styles.chartSvg} viewBox="0 0 400 150">
                <defs>
                  <linearGradient
                    id="peakHourGradient"
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
                  fill="url(#peakHourGradient)"
                  stroke="#10b981"
                  strokeWidth="3"
                  points={peakHourData
                    .map(
                      (data, index) =>
                        `${(index / (peakHourData.length - 1)) * 380 + 10},${
                          150 - (data.bookings / maxPeakHour) * 120
                        }`
                    )
                    .join(" ")}
                />
                {peakHourData.map((data, index) => (
                  <circle
                    key={index}
                    cx={(index / (peakHourData.length - 1)) * 380 + 10}
                    cy={150 - (data.bookings / maxPeakHour) * 120}
                    r="4"
                    fill="#10b981"
                  />
                ))}
              </svg>
              <div className={styles.chartLabels}>
                {peakHourData.map((data, index) => (
                  <span key={index} className={styles.chartLabel}>
                    {data.hour}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className={styles.lowerGrid}>
        {/* Bookings by Time of Day */}
        <div className={styles.bookingsChart}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Bookings by Time of Day</h3>
            <div className={styles.chartTabs}>
              <button className={`${styles.chartTab} ${styles.activeTab}`}>
                Today
              </button>
              <button className={styles.chartTab}>Yesterday</button>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.timeBookingsChart}>
              {bookingsByTime.map((data, index) => (
                <div key={index} className={styles.timeSlot}>
                  <div className={styles.timeLabel}>{data.time}</div>
                  <div className={styles.bookingBars}>
                    <div
                      className={styles.todayBar}
                      style={{
                        height: `${(data.today / maxBookingTime) * 80}px`,
                      }}
                    >
                      <span className={styles.barTooltip}>{data.today}</span>
                    </div>
                    <div
                      className={styles.yesterdayBar}
                      style={{
                        height: `${(data.yesterday / maxBookingTime) * 80}px`,
                      }}
                    >
                      <span className={styles.barTooltip}>
                        {data.yesterday}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActionsCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
          </div>
          <div className={styles.actionGrid}>
            <button
              onClick={() => handleQuickAction("New Booking")}
              className={styles.actionBtn}
            >
              <div className={styles.actionIcon}>➕</div>
              <span>New Booking</span>
            </button>
            <button
              onClick={() => handleQuickAction("Download Reports")}
              className={styles.actionBtn}
            >
              <div className={styles.actionIcon}>📥</div>
              <span>Download Reports</span>
            </button>
            <button
              onClick={() => handleQuickAction("Manage Slots")}
              className={styles.actionBtn}
            >
              <div className={styles.actionIcon}>👨‍💼</div>
              <span>Manage Slots</span>
            </button>
            <button
              onClick={() => handleQuickAction("Send Notifications")}
              className={styles.actionBtn}
            >
              <div className={styles.actionIcon}>👥</div>
              <span>Send Notifications</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Activity</h3>
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
      </div>
    </div>
  );
};

export default Dashboard;
