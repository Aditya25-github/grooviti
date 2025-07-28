import React, { useState } from "react";
import styles from "./PerformanceTracking.module.css";

const PerformanceTracking = () => {
  const [selectedBatch, setSelectedBatch] = useState("All Students");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Last 30 Days");

  const [performanceData] = useState({
    avgSprintTime: 24.5,
    sprintGrowth: 12,
    overallPerformance: 87,
    performanceGrowth: 8,
    goalsAchieved: 156,
    goalsGrowth: 15,
    trainingSessions: 28,
    totalSessions: 30,
    sessionPercentage: 92,
  });

  const [sprintTrendData] = useState([
    { week: "Week 1", time: 26.2 },
    { week: "Week 2", time: 25.8 },
    { week: "Week 3", time: 25.0 },
    { week: "Week 4", time: 24.5 },
  ]);

  const [activityData] = useState([
    { activity: "Sprint", score: 85 },
    { activity: "Endurance", score: 78 },
    { activity: "Technique", score: 92 },
    { activity: "Strength", score: 88 },
  ]);

  const [students, setStudents] = useState([
    {
      id: "ST001",
      name: "John Smith",
      avatar: "👨‍🎓",
      batch: "Football A",
      sport: "Track & Field",
      sprintTime: 23.2,
      sprintChange: -0.3,
      endurance: 85,
      technique: 78,
      overallScore: 92,
      trend: "up",
    },
    {
      id: "ST002",
      name: "Sarah Johnson",
      avatar: "👩‍🎓",
      batch: "Basketball B",
      sport: "Swimming",
      sprintTime: 25.8,
      sprintChange: 0.2,
      endurance: 72,
      technique: 88,
      overallScore: 76,
      trend: "down",
    },
    {
      id: "ST003",
      name: "Mike Davis",
      avatar: "👨‍🎓",
      batch: "Football A",
      sport: "Football",
      sprintTime: 22.1,
      sprintChange: -0.5,
      endurance: 90,
      technique: 85,
      overallScore: 95,
      trend: "up",
    },
    {
      id: "ST004",
      name: "Emma Wilson",
      avatar: "👩‍🎓",
      batch: "Cricket C",
      sport: "Cricket",
      sprintTime: 26.4,
      sprintChange: 0.1,
      endurance: 68,
      technique: 82,
      overallScore: 73,
      trend: "stable",
    },
  ]);

  const maxSprintTime = Math.max(...sprintTrendData.map((d) => d.time));
  const maxActivityScore = Math.max(...activityData.map((d) => d.score));

  const filteredStudents = students.filter((student) => {
    if (selectedBatch === "All Students") return true;
    return student.batch === selectedBatch;
  });

  const batches = ["All Students", ...new Set(students.map((s) => s.batch))];

  const handleViewDetails = (studentId) => {
    console.log("View details for student:", studentId);
    alert(`Opening detailed performance view for student ${studentId}`);
  };

  const handleEdit = (studentId) => {
    console.log("Edit student:", studentId);
    alert(`Opening edit form for student ${studentId}`);
  };

  const handleAddAssessment = () => {
    console.log("Add new assessment");
    alert("Opening new assessment form...");
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      case "stable":
        return "→";
      default:
        return "→";
    }
  };

  const getTrendClass = (trend) => {
    switch (trend) {
      case "up":
        return styles.trendUp;
      case "down":
        return styles.trendDown;
      case "stable":
        return styles.trendStable;
      default:
        return styles.trendStable;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Student Performance Tracking</h1>
          <p className={styles.description}>
            Monitor and analyze student progress across various activities
          </p>
        </div>
        <div className={styles.headerControls}>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className={styles.select}
          >
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className={styles.select}
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 60 Days">Last 60 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Performance Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏃‍♂️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {performanceData.avgSprintTime}s
            </div>
            <div className={styles.statLabel}>Average Sprint Time</div>
            <div className={styles.growth}>
              +{performanceData.sprintGrowth}%
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {performanceData.overallPerformance}%
            </div>
            <div className={styles.statLabel}>Overall Performance</div>
            <div className={styles.growth}>
              +{performanceData.performanceGrowth}%
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {performanceData.goalsAchieved}
            </div>
            <div className={styles.statLabel}>Goals Achieved</div>
            <div className={styles.growth}>+{performanceData.goalsGrowth}%</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {performanceData.trainingSessions}/{performanceData.totalSessions}
            </div>
            <div className={styles.statLabel}>Training Sessions</div>
            <div className={styles.growth}>
              {performanceData.sessionPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Sprint Performance Trend</h3>
            <div className={styles.chartTabs}>
              <button className={`${styles.chartTab} ${styles.activeTab}`}>
                Weekly
              </button>
              <button className={styles.chartTab}>Monthly</button>
            </div>
          </div>
          <div className={styles.lineChart}>
            {sprintTrendData.map((data, index) => (
              <div key={index} className={styles.chartPoint}>
                <div
                  className={styles.point}
                  style={{
                    bottom: `${
                      ((maxSprintTime - data.time) / (maxSprintTime - 24)) * 100
                    }%`,
                  }}
                >
                  <div className={styles.pointValue}>{data.time}s</div>
                </div>
                <div className={styles.pointLabel}>{data.week}</div>
              </div>
            ))}
            <svg className={styles.chartLine}>
              <polyline
                points={sprintTrendData
                  .map(
                    (data, index) =>
                      `${(index / (sprintTrendData.length - 1)) * 100},${
                        100 -
                        ((maxSprintTime - data.time) / (maxSprintTime - 24)) *
                          100
                      }`
                  )
                  .join(" ")}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Activity Performance</h3>
          </div>
          <div className={styles.barChart}>
            {activityData.map((data, index) => (
              <div key={index} className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${(data.score / maxActivityScore) * 100}%`,
                  }}
                >
                  <div className={styles.barValue}>{data.score}%</div>
                </div>
                <div className={styles.barLabel}>{data.activity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Student Performance */}
      <div className={styles.studentsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Individual Student Performance
          </h2>
          <button onClick={handleAddAssessment} className={styles.addBtn}>
            + Add Assessment
          </button>
        </div>

        <div className={styles.studentsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Student</div>
            <div className={styles.headerCell}>Sprint Time</div>
            <div className={styles.headerCell}>Endurance</div>
            <div className={styles.headerCell}>Technique</div>
            <div className={styles.headerCell}>Overall Score</div>
            <div className={styles.headerCell}>Trend</div>
            <div className={styles.headerCell}>Actions</div>
          </div>

          {filteredStudents.map((student) => (
            <div key={student.id} className={styles.tableRow}>
              <div className={styles.studentInfo}>
                <div className={styles.avatar}>{student.avatar}</div>
                <div className={styles.studentDetails}>
                  <div className={styles.studentName}>{student.name}</div>
                  <div className={styles.studentMeta}>{student.sport}</div>
                </div>
              </div>

              <div className={styles.sprintData}>
                <div className={styles.sprintTime}>{student.sprintTime}s</div>
                <div
                  className={`${styles.sprintChange} ${
                    student.sprintChange < 0 ? styles.positive : styles.negative
                  }`}
                >
                  {student.sprintChange > 0 ? "+" : ""}
                  {student.sprintChange}s
                </div>
              </div>

              <div className={styles.progressCell}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${student.endurance}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {student.endurance}%
                </span>
              </div>

              <div className={styles.progressCell}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${student.technique}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {student.technique}%
                </span>
              </div>

              <div className={styles.scoreCell}>
                <span className={styles.overallScore}>
                  {student.overallScore}/100
                </span>
              </div>

              <div
                className={`${styles.trendCell} ${getTrendClass(
                  student.trend
                )}`}
              >
                <span className={styles.trendIcon}>
                  {getTrendIcon(student.trend)}
                </span>
              </div>

              <div className={styles.actionsCell}>
                <button
                  onClick={() => handleViewDetails(student.id)}
                  className={styles.actionBtn}
                >
                  View Details
                </button>
                <button
                  onClick={() => handleEdit(student.id)}
                  className={styles.editBtn}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceTracking;
