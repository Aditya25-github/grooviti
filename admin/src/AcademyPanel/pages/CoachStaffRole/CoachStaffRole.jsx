import React, { useState } from "react";
import styles from "./CoachStaffRole.module.css";

const CoachStaffRole = () => {
  /* ───────────────────────────
     Mock data
  ─────────────────────────── */
  const [staff, setStaff] = useState([
    {
      id: "COA001",
      name: "Mike Johnson",
      avatar: "👨‍🏫",
      role: "Head Coach – Football",
      sport: "Football",
      experience: "Senior",
      joined: "15 Jan 2023",
      salary: 3200,
      batches: ["Football A", "Football B"],
      status: "Active",
    },
    {
      id: "COA002",
      name: "Sarah Wilson",
      avatar: "👩‍🏫",
      role: "Head Coach – Basketball",
      sport: "Basketball",
      experience: "Senior",
      joined: "22 Mar 2023",
      salary: 2800,
      batches: ["Basketball B", "Basketball C"],
      status: "Active",
    },
    {
      id: "SUP003",
      name: "David Brown",
      avatar: "🧑‍💼",
      role: "Equipment Manager",
      sport: "Multi-Sport",
      experience: "Mid-Level",
      joined: "10 Feb 2024",
      salary: 1500,
      batches: [],
      status: "Inactive",
    },
  ]);

  /* ───────────────────────────
     State for filters
  ─────────────────────────── */
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [sportFilter, setSportFilter] = useState("All Sports");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [statusFilter, setStatusFilter] = useState("All Status");

  /* ───────────────────────────
     Derived metrics
  ─────────────────────────── */
  const totalCoaches = staff.filter((s) => s.role.includes("Coach")).length;
  const supportStaff = staff.length - totalCoaches;
  const monthlyPayroll = staff.reduce((sum, s) => sum + s.salary, 0);
  const activeStaff = staff.filter((s) => s.status === "Active").length;

  /* ───────────────────────────
     Helpers
  ─────────────────────────── */
  const toggleStatus = (id) =>
    setStaff((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
          : p
      )
    );

  const handleAssignBatch = (id) => {
    const batch = prompt("Enter batch to assign (e.g., Football C):");
    if (!batch) return;
    setStaff((prev) =>
      prev.map((p) =>
        p.id === id && !p.batches.includes(batch)
          ? { ...p, batches: [...p.batches, batch] }
          : p
      )
    );
  };

  const openAddModal = () => alert("Open “Add Staff” modal (coming soon)");
  const handleEdit = (id) => alert(`Edit staff ${id}`);
  const handleProfile = (id) => alert(`Open profile of ${id}`);

  const badgeClass = (status) =>
    status === "Active" ? styles.badgeActive : styles.badgeInactive;

  const filteredStaff = staff.filter((p) => {
    const role = roleFilter === "All Roles" || p.role.includes(roleFilter);
    const sport = sportFilter === "All Sports" || p.sport === sportFilter;
    const level = levelFilter === "All Levels" || p.experience === levelFilter;
    const status = statusFilter === "All Status" || p.status === statusFilter;
    return role && sport && level && status;
  });

  /* ───────────────────────────
     UI
  ─────────────────────────── */
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Coach &amp; Staff Management</h1>
        <p className={styles.subtitle}>
          Assign coaches to batches, track performance and manage salaries.
        </p>
        <button onClick={openAddModal} className={styles.addBtn}>
          + Add New Staff
        </button>
      </div>

      {/* Quick Stats */}
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Coaches</div>
          <div className={styles.statValue}>{totalCoaches}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Support Staff</div>
          <div className={styles.statValue}>{supportStaff}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Monthly Payroll</div>
          <div className={styles.statValue}>
            ₹{monthlyPayroll.toLocaleString()}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Staff</div>
          <div className={styles.statValue}>{activeStaff}</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Role Type</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={styles.select}
          >
            <option>All Roles</option>
            <option>Coach</option>
            <option>Support</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Sport Specialization</label>
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
          <label className={styles.filterLabel}>Experience Level</label>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className={styles.select}
          >
            <option>All Levels</option>
            <option>Junior</option>
            <option>Mid-Level</option>
            <option>Senior</option>
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

      {/* Staff Directory */}
      <div className={styles.directory}>
        <h2 className={styles.sectionTitle}>Staff Directory</h2>

        {filteredStaff.length === 0 && (
          <p className={styles.noData}>No staff match your filters.</p>
        )}

        {filteredStaff.map((p) => (
          <div key={p.id} className={styles.card}>
            <div className={styles.cardMain}>
              <div className={styles.info}>
                <div className={styles.avatar}>{p.avatar}</div>
                <div className={styles.details}>
                  <h3 className={styles.name}>{p.name}</h3>
                  <p className={styles.meta}>
                    {p.role} • Joined {p.joined}
                  </p>
                </div>
              </div>

              <div className={styles.rightBlock}>
                <span className={`${styles.badge} ${badgeClass(p.status)}`}>
                  {p.status}
                </span>
                <div className={styles.salary}>₹{p.salary}/mo</div>
              </div>
            </div>

            <div className={styles.cardSub}>
              <div className={styles.batchLine}>
                <span>Batches:</span>
                {p.batches.length ? (
                  p.batches.map((b) => (
                    <span key={b} className={styles.batchTag}>
                      {b}
                    </span>
                  ))
                ) : (
                  <span className={styles.noBatch}>–</span>
                )}
                <button
                  onClick={() => handleAssignBatch(p.id)}
                  className={styles.assignBtn}
                >
                  + Assign
                </button>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(p.id)}
                  className={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleProfile(p.id)}
                  className={styles.viewBtn}
                >
                  View Profile
                </button>
                <button
                  onClick={() => toggleStatus(p.id)}
                  className={styles.statusBtn}
                >
                  {p.status === "Active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachStaffRole;
