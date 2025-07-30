import React, { useState } from "react";
import styles from "./Analytics.module.css";
import {
  FaCalendarAlt,
  FaDownload,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaFilter,
} from "react-icons/fa";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("Last 6 months");
  const [chartType, setChartType] = useState("Revenue");

  // Mock analytics data
  const [analyticsData] = useState({
    totalRevenue: 245680,
    revenueChange: 15.2,
    growthRate: 23.4,
    growthChange: 3.1,
    totalBookings: 1847,
    bookingsChange: 8.7,
    avgBookingValue: 1330,
    avgValueChange: -2.1,
  });

  const [revenueData] = useState([
    { month: "Jan", revenue: 175000 },
    { month: "Feb", revenue: 195000 },
    { month: "Mar", revenue: 200000 },
    { month: "Apr", revenue: 225000 },
    { month: "May", revenue: 235000 },
    { month: "Jun", revenue: 245680 },
  ]);

  const [growthData] = useState([
    { quarter: "Q1", growth: 18 },
    { quarter: "Q2", growth: 22 },
    { quarter: "Q3", growth: 19 },
    { quarter: "Q4", growth: 23 },
  ]);

  const [bookingDistribution] = useState([
    { day: "Mon", bookings: 45 },
    { day: "Tue", bookings: 52 },
    { day: "Wed", bookings: 48 },
    { day: "Thu", bookings: 65 },
    { day: "Fri", bookings: 78 },
    { day: "Sat", bookings: 95 },
    { day: "Sun", bookings: 82 },
  ]);

  const [performanceMetrics] = useState({
    conversionRate: 78.5,
    customerRetention: 85.2,
    peakUtilization: 92.1,
  });

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
  const maxGrowth = Math.max(...growthData.map((d) => d.growth));
  const maxBookings = Math.max(...bookingDistribution.map((d) => d.bookings));

  const handleExport = (reportType) => {
    console.log(`Exporting ${reportType} report`);
    alert(`${reportType} report exported successfully!`);
  };

  const getChangeIcon = (change) => {
    return change > 0 ? <FaArrowUp /> : <FaArrowDown />;
  };

  const getChangeClass = (change) => {
    return change > 0 ? styles.positive : styles.negative;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Analytics Dashboard</h1>
          <p className={styles.description}>
            Comprehensive overview of booking revenue and growth metrics
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>
            <FaDownload className={styles.btnIcon} />
            Export
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controlsSection}>
        <div className={styles.timeRangeControl}>
          <label className={styles.controlLabel}>Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={styles.controlSelect}
          >
            <option value="Last 6 months">Last 6 months</option>
            <option value="Last 12 months">Last 12 months</option>
            <option value="This year">This year</option>
            <option value="Custom range">Custom range</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <FaMoneyBillWave className={styles.metricIcon} />
            <div
              className={`${styles.changeIndicator} ${getChangeClass(
                analyticsData.revenueChange
              )}`}
            >
              {getChangeIcon(analyticsData.revenueChange)}
              {Math.abs(analyticsData.revenueChange)}%
              <span className={styles.changeLabel}>vs last month</span>
            </div>
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>
              ₹{analyticsData.totalRevenue.toLocaleString()}
            </div>
            <div className={styles.metricLabel}>Total Revenue</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <FaChartLine className={styles.metricIcon} />
            <div
              className={`${styles.changeIndicator} ${getChangeClass(
                analyticsData.growthChange
              )}`}
            >
              {getChangeIcon(analyticsData.growthChange)}
              {Math.abs(analyticsData.growthChange)}%
              <span className={styles.changeLabel}>this quarter</span>
            </div>
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>
              {analyticsData.growthRate}%
            </div>
            <div className={styles.metricLabel}>Growth Rate</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <FaUsers className={styles.metricIcon} />
            <div
              className={`${styles.changeIndicator} ${getChangeClass(
                analyticsData.bookingsChange
              )}`}
            >
              {getChangeIcon(analyticsData.bookingsChange)}
              {Math.abs(analyticsData.bookingsChange)}%
              <span className={styles.changeLabel}>vs last month</span>
            </div>
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>
              {analyticsData.totalBookings.toLocaleString()}
            </div>
            <div className={styles.metricLabel}>Total Bookings</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <FaClock className={styles.metricIcon} />
            <div
              className={`${styles.changeIndicator} ${getChangeClass(
                analyticsData.avgValueChange
              )}`}
            >
              {getChangeIcon(analyticsData.avgValueChange)}
              {Math.abs(analyticsData.avgValueChange)}%
              <span className={styles.changeLabel}>vs last month</span>
            </div>
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>
              ₹{analyticsData.avgBookingValue.toLocaleString()}
            </div>
            <div className={styles.metricLabel}>Avg. Booking Value</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        {/* Revenue Trends */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Revenue Trends</h3>
            <div className={styles.chartControls}>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={styles.chartSelect}
              >
                <option value="Last 6 months">Last 6 months</option>
                <option value="Last 12 months">Last 12 months</option>
              </select>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.lineChart}>
              <svg className={styles.chartSvg} viewBox="0 0 500 200">
                <defs>
                  <linearGradient
                    id="revenueGradient"
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
                  fill="url(#revenueGradient)"
                  stroke="#10b981"
                  strokeWidth="3"
                  points={revenueData
                    .map(
                      (data, index) =>
                        `${(index / (revenueData.length - 1)) * 450 + 25},${
                          180 - (data.revenue / maxRevenue) * 140
                        }`
                    )
                    .join(" ")}
                />
                {revenueData.map((data, index) => (
                  <circle
                    key={index}
                    cx={(index / (revenueData.length - 1)) * 450 + 25}
                    cy={180 - (data.revenue / maxRevenue) * 140}
                    r="4"
                    fill="#10b981"
                  />
                ))}
              </svg>
              <div className={styles.chartXAxis}>
                {revenueData.map((data, index) => (
                  <span key={index} className={styles.axisLabel}>
                    {data.month}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Growth Analysis */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Growth Analysis</h3>
            <div className={styles.chartTabs}>
              <button className={`${styles.chartTab} ${styles.activeTab}`}>
                Monthly
              </button>
              <button className={styles.chartTab}>Quarterly</button>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.barChart}>
              {growthData.map((data, index) => (
                <div key={index} className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(data.growth / maxGrowth) * 120}px`,
                      background: `linear-gradient(to top, #3b82f6, #60a5fa)`,
                    }}
                  >
                    <div className={styles.barValue}>{data.growth}%</div>
                  </div>
                  <div className={styles.barLabel}>{data.quarter}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className={styles.lowerSection}>
        {/* Booking Distribution */}
        <div className={styles.distributionCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Booking Distribution</h3>
            <button className={styles.viewDetailsBtn}>View Details</button>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.areaChart}>
              <svg className={styles.chartSvg} viewBox="0 0 400 150">
                <defs>
                  <linearGradient
                    id="bookingGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="url(#bookingGradient)"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  points={`0,140 ${bookingDistribution
                    .map(
                      (data, index) =>
                        `${
                          (index / (bookingDistribution.length - 1)) * 380 + 10
                        },${130 - (data.bookings / maxBookings) * 100}`
                    )
                    .join(" ")} 390,140`}
                />
                {bookingDistribution.map((data, index) => (
                  <circle
                    key={index}
                    cx={(index / (bookingDistribution.length - 1)) * 380 + 10}
                    cy={130 - (data.bookings / maxBookings) * 100}
                    r="3"
                    fill="#8b5cf6"
                  />
                ))}
              </svg>
              <div className={styles.chartXAxis}>
                {bookingDistribution.map((data, index) => (
                  <span key={index} className={styles.axisLabel}>
                    {data.day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className={styles.performanceCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Performance Metrics</h3>
          </div>
          <div className={styles.metricsContainer}>
            <div className={styles.performanceMetric}>
              <div className={styles.performanceLabel}>Conversion Rate</div>
              <div className={styles.performanceValue}>
                {performanceMetrics.conversionRate}%
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${performanceMetrics.conversionRate}%`,
                    backgroundColor: "#10b981",
                  }}
                ></div>
              </div>
            </div>

            <div className={styles.performanceMetric}>
              <div className={styles.performanceLabel}>Customer Retention</div>
              <div className={styles.performanceValue}>
                {performanceMetrics.customerRetention}%
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${performanceMetrics.customerRetention}%`,
                    backgroundColor: "#3b82f6",
                  }}
                ></div>
              </div>
            </div>

            <div className={styles.performanceMetric}>
              <div className={styles.performanceLabel}>Peak Utilization</div>
              <div className={styles.performanceValue}>
                {performanceMetrics.peakUtilization}%
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${performanceMetrics.peakUtilization}%`,
                    backgroundColor: "#8b5cf6",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Export Options */}
      <div className={styles.exportSection}>
        <h2 className={styles.sectionTitle}>Data Export Options</h2>
        <div className={styles.exportCards}>
          <div className={styles.exportCard}>
            <div className={styles.exportHeader}>
              <h3 className={styles.exportTitle}>Revenue Report</h3>
              <div className={styles.exportActions}>
                <button
                  onClick={() => handleExport("CSV")}
                  className={styles.exportFormatBtn}
                >
                  <FaDownload className={styles.exportIcon} />
                  CSV
                </button>
                <button
                  onClick={() => handleExport("PDF")}
                  className={styles.exportFormatBtn}
                >
                  <FaDownload className={styles.exportIcon} />
                  PDF
                </button>
              </div>
            </div>
            <p className={styles.exportDescription}>
              Detailed revenue breakdown by time period
            </p>
            <button
              onClick={() => handleExport("Revenue Report")}
              className={styles.downloadBtn}
            >
              Download →
            </button>
          </div>

          <div className={styles.exportCard}>
            <div className={styles.exportHeader}>
              <h3 className={styles.exportTitle}>Growth Analysis</h3>
              <div className={styles.exportActions}>
                <button
                  onClick={() => handleExport("CSV")}
                  className={styles.exportFormatBtn}
                >
                  <FaDownload className={styles.exportIcon} />
                  CSV
                </button>
                <button
                  onClick={() => handleExport("PDF")}
                  className={styles.exportFormatBtn}
                >
                  <FaDownload className={styles.exportIcon} />
                  PDF
                </button>
              </div>
            </div>
            <p className={styles.exportDescription}>
              Growth metrics and trend analysis
            </p>
            <button
              onClick={() => handleExport("Growth Analysis")}
              className={styles.downloadBtn}
            >
              Download →
            </button>
          </div>

          <div className={styles.exportCard}>
            <div className={styles.exportHeader}>
              <h3 className={styles.exportTitle}>Booking Summary</h3>
              <div className={styles.exportActions}>
                <button
                  onClick={() => handleExport("CSV")}
                  className={styles.exportFormatBtn}
                >
                  <FaDownload className={styles.exportIcon} />
                  CSV
                </button>
                <button
                  onClick={() => handleExport("PDF")}
                  className={styles.exportFormatBtn}
                >
                  <FaDownload className={styles.exportIcon} />
                  PDF
                </button>
              </div>
            </div>
            <p className={styles.exportDescription}>
              Complete booking statistics and patterns
            </p>
            <button
              onClick={() => handleExport("Booking Summary")}
              className={styles.downloadBtn}
            >
              Download →
            </button>
          </div>

          <div className={styles.exportCard}>
            <div className={styles.exportHeader}>
              <h3 className={styles.exportTitle}>Export All</h3>
              <div className={styles.exportActions}>
                <button
                  onClick={() => handleExport("All Data")}
                  className={styles.exportAllBtn}
                >
                  <FaDownload className={styles.exportIcon} />
                  Export All
                </button>
              </div>
            </div>
            <p className={styles.exportDescription}>
              Download all analytics data in one package
            </p>
            <button
              onClick={() => handleExport("All Data")}
              className={styles.downloadBtn}
            >
              Download →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
