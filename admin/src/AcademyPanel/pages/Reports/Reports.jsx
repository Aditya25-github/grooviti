// File: Reports.jsx
import React, { useState } from "react";
import styles from "./Reports.module.css";
import {
  FaFileAlt,
  FaDownload,
  FaCalendarAlt,
  FaBell,
  FaClock,
  FaFileExport,
} from "react-icons/fa";

const mockReports = [
  {
    id: 1,
    category: "Performance",
    name: "Academy Performance Overview",
    description: "Overall academy metrics and KPIs",
  },
  {
    id: 2,
    category: "Performance",
    name: "Student Performance Report",
    description: "Individual student progress tracking",
  },
  {
    id: 3,
    category: "Performance",
    name: "Batch Performance Analysis",
    description: "Performance metrics by batch",
  },
  {
    id: 4,
    category: "Performance",
    name: "Coach Performance Report",
    description: "Staff and coach effectiveness",
  },
  {
    id: 5,
    category: "Financial",
    name: "Fee Collection Report",
    description: "Student fee payments and dues",
  },
  {
    id: 6,
    category: "Financial",
    name: "Revenue Analysis",
    description: "Monthly and quarterly revenue",
  },
  {
    id: 7,
    category: "Financial",
    name: "Outstanding Dues Report",
    description: "Pending payments and overdue fees",
  },
  {
    id: 8,
    category: "Financial",
    name: "Payment Method Analysis",
    description: "Payment modes and trends",
  },
  {
    id: 9,
    category: "Financial",
    name: "Expense Report",
    description: "Academy operational expenses",
  },
  {
    id: 10,
    category: "Student",
    name: "Student Enrollment Report",
    description: "New registrations and dropouts",
  },
  {
    id: 11,
    category: "Student",
    name: "Student Demographics",
    description: "Age, gender and location analysis",
  },
];

const Reports = () => {
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  const categorized = mockReports.reduce((acc, rpt) => {
    acc[rpt.category] = acc[rpt.category] || [];
    acc[rpt.category].push(rpt);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Reports & Analytics</h1>
          <p className={styles.subtitle}>
            Generate, view and download comprehensive reports for your academy
            operations.
          </p>
        </div>
        <div className={styles.controls}>
          <div className={styles.selectWrap}>
            <FaCalendarAlt className={styles.icon} />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={styles.select}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>
          <button className={styles.exportAll}>
            <FaFileExport className={styles.icon} />
            Export All
          </button>
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.statCard}>
          <FaFileAlt className={styles.statIcon} />
          <div>
            <div className={styles.statValue}>{mockReports.length}</div>
            <div className={styles.statLabel}>Total Reports</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <FaDownload className={styles.statIcon} />
          <div>
            <div className={styles.statValue}>156</div>
            <div className={styles.statLabel}>Downloaded</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <FaClock className={styles.statIcon} />
          <div>
            <div className={styles.statValue}>8</div>
            <div className={styles.statLabel}>Scheduled</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <FaBell className={styles.statIcon} />
          <div>
            <div className={styles.statValue}>3</div>
            <div className={styles.statLabel}>Alerts</div>
          </div>
        </div>
      </div>

      <div className={styles.categories}>
        {Object.entries(categorized).map(([cat, reports]) => (
          <div key={cat} className={styles.categoryBlock}>
            <h2 className={styles.categoryTitle}>{cat} Reports</h2>
            <div className={styles.reportList}>
              {reports.map((rpt) => (
                <div key={rpt.id} className={styles.reportCard}>
                  <div className={styles.reportInfo}>
                    <FaFileAlt className={styles.reportIcon} />
                    <div>
                      <div className={styles.reportName}>{rpt.name}</div>
                      <div className={styles.reportDesc}>{rpt.description}</div>
                    </div>
                  </div>
                  <button className={styles.downloadBtn}>
                    <FaDownload className={styles.icon} />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
