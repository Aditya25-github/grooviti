import React, { useState } from "react";
import styles from "./BatchSchedule.module.css";

const BatchSchedule = () => {
  /* ───────────────────────────
     Mock data
  ─────────────────────────── */
  const [batches, setBatches] = useState([
    {
      id: "BATCH01",
      sport: "Football",
      name: "Football Training - Batch A",
      coach: "Mike Johnson",
      days: ["Mon", "Wed", "Fri"],
      time: "6:00 – 8:00 AM",
      students: 15,
      status: "Active",
    },
    {
      id: "BATCH02",
      sport: "Basketball",
      name: "Basketball Training - Batch B",
      coach: "Sarah Wilson",
      days: ["Tue", "Thu", "Sat"],
      time: "5:00 – 7:00 PM",
      students: 12,
      status: "Active",
    },
    {
      id: "BATCH03",
      sport: "Cricket",
      name: "Cricket Training - Batch C",
      coach: "David Brown",
      days: ["Mon", "Thu"],
      time: "4:00 – 6:00 PM",
      students: 18,
      status: "Inactive",
    },
  ]);

  /* ───────────────────────────
     State for filters
  ─────────────────────────── */
  const [sportFilter, setSportFilter] = useState("All Sports");
  const [timeFilter, setTimeFilter] = useState("All Time Slots");
  const [coachFilter, setCoachFilter] = useState("All Coaches");
  const [statusFilter, setStatusFilter] = useState("All Status");

  /* ───────────────────────────
     Derived metrics
  ─────────────────────────── */
  const totalBatches = batches.length;
  const totalStudents = batches.reduce((sum, b) => sum + b.students, 0);
  const activeCoaches = new Set(batches.map((b) => b.coach)).size;
  const weeklySessions = batches.reduce((sum, b) => sum + b.days.length, 0);

  /* ───────────────────────────
     Helpers
  ─────────────────────────── */
  const handleAddNew = () => {
    alert("Open “Create Batch” modal (coming soon)");
  };

  const handleEdit = (id) => alert(`Edit batch ${id}`);
  const handleViewSch = (id) => alert(`View detailed schedule of ${id}`);

  const filteredBatches = batches.filter((b) => {
    const sport = sportFilter === "All Sports" || b.sport === sportFilter;
    const time = timeFilter === "All Time Slots" || b.time.includes(timeFilter);
    const coach = coachFilter === "All Coaches" || b.coach === coachFilter;
    const status = statusFilter === "All Status" || b.status === statusFilter;
    return sport && time && coach && status;
  });

  const statusClass = (status) =>
    status === "Active" ? styles.badgeActive : styles.badgeInactive;

  /* ───────────────────────────
     UI
  ─────────────────────────── */
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Batch &amp; Schedule Management</h1>
        <p className={styles.subtitle}>
          Create and manage training batches, schedules and coach assignments.
        </p>
        <button onClick={handleAddNew} className={styles.addBtn}>
          + Add New Batch
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Batches</div>
          <div className={styles.statValue}>{totalBatches}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Students</div>
          <div className={styles.statValue}>{totalStudents}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Coaches</div>
          <div className={styles.statValue}>{activeCoaches}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Weekly Sessions</div>
          <div className={styles.statValue}>{weeklySessions}</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Sport Type</label>
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className={styles.select}
          >
            <option>All Sports</option>
            <option>Football</option>
            <option>Basketball</option>
            <option>Cricket</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Time Slot</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className={styles.select}
          >
            <option>All Time Slots</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Coach</label>
          <select
            value={coachFilter}
            onChange={(e) => setCoachFilter(e.target.value)}
            className={styles.select}
          >
            <option>All Coaches</option>
            <option>Mike Johnson</option>
            <option>Sarah Wilson</option>
            <option>David Brown</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.select}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Batch List */}
      <div className={styles.listSection}>
        <h2 className={styles.sectionTitle}>Batch List</h2>

        {filteredBatches.length === 0 && (
          <p className={styles.noData}>No batches match your filters.</p>
        )}

        {filteredBatches.map((batch) => (
          <div key={batch.id} className={styles.batchCard}>
            <div className={styles.batchMain}>
              <div className={styles.batchInfo}>
                <h3 className={styles.batchName}>{batch.name}</h3>
                <p className={styles.batchMeta}>
                  {batch.students} Students • {batch.days.join(", ")} •{" "}
                  {batch.time}
                </p>
              </div>
              <span className={`${styles.badge} ${statusClass(batch.status)}`}>
                {batch.status}
              </span>
            </div>

            <div className={styles.batchSub}>
              <span className={styles.coach}>
                Coach: <strong>{batch.coach}</strong>
              </span>
              <div className={styles.cardActions}>
                <button
                  onClick={() => handleEdit(batch.id)}
                  className={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleViewSch(batch.id)}
                  className={styles.viewBtn}
                >
                  View Schedule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchSchedule;
