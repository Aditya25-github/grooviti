import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./BatchSchedule.module.css";

const BatchSchedule = ({ url }) => {
  /* ───────────────────────────
     State Management
  ─────────────────────────── */
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isViewScheduleOpen, setIsViewScheduleOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  /* ───────────────────────────
     State for filters
  ─────────────────────────── */
  const [sportFilter, setSportFilter] = useState("All Sports");
  const [timeFilter, setTimeFilter] = useState("All Time Slots");
  const [coachFilter, setCoachFilter] = useState("All Coaches");
  const [statusFilter, setStatusFilter] = useState("All Status");

  /* ───────────────────────────
     Form Data State
  ─────────────────────────── */
  const [formData, setFormData] = useState({
    sport: "",
    name: "",
    coach: "",
    days: [],
    timeFrom: "",
    timeTo: "",
    students: 0,
    status: "Active",
  });

  /* ───────────────────────────
     Authentication Helper
  ─────────────────────────── */
  const getAuthToken = () => {
    return (
      localStorage.getItem("academyToken") || localStorage.getItem("token")
    );
  };

  const getAxiosConfig = () => {
    const token = getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  /* ───────────────────────────
     API Functions
  ─────────────────────────── */
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/batches`, getAxiosConfig());
      setBatches(response.data);
      if (response.data.length > 0) {
        toast.success("Batches loaded successfully!");
      }
    } catch (error) {
      console.error("Failed to fetch batches:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 404) {
        toast.error(
          "Batches endpoint not found. Please check backend configuration."
        );
      } else {
        toast.error("Failed to load batches.");
      }
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchBatches();
    }
  }, [url]);

  /* ───────────────────────────
     Derived metrics
  ─────────────────────────── */
  const totalBatches = batches.length;
  const totalStudents = batches.reduce((sum, b) => sum + (b.students || 0), 0);
  const activeCoaches = new Set(
    batches.filter((b) => b.status === "Active").map((b) => b.coach)
  ).size;
  const weeklySessions = batches.reduce(
    (sum, b) => sum + (b.days?.length || 0),
    0
  );

  /* ───────────────────────────
     Helper Functions
  ─────────────────────────── */
  const parseTime = (timeString) => {
    if (!timeString) return { start: "", end: "" };
    const parts = timeString.split(" – ");
    if (parts.length === 2) {
      return { start: parts[0], end: parts[1] };
    }
    const altParts = timeString.split(" - ");
    if (altParts.length === 2) {
      return { start: altParts[0], end: altParts[1] };
    }
    return { start: "", end: "" };
  };

  /* ───────────────────────────
     Form Handlers
  ─────────────────────────── */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "days") {
        setFormData((prev) => ({
          ...prev,
          days: checked
            ? [...prev.days, value]
            : prev.days.filter((day) => day !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      sport: "",
      name: "",
      coach: "",
      days: [],
      timeFrom: "",
      timeTo: "",
      students: 0,
      status: "Active",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.sport ||
      !formData.name ||
      !formData.coach ||
      formData.days.length === 0 ||
      !formData.timeFrom ||
      !formData.timeTo
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Format the time string
      const timeString = `${formData.timeFrom} – ${formData.timeTo}`;

      const payload = {
        sport: formData.sport,
        name: formData.name,
        coach: formData.coach,
        days: formData.days,
        time: timeString,
        students: parseInt(formData.students) || 0,
        status: formData.status,
      };

      if (isEditing) {
        await axios.put(
          `${url}/api/batches/${editingId}`,
          payload,
          getAxiosConfig()
        );
        toast.success("Batch updated successfully!");
      } else {
        await axios.post(`${url}/api/batches`, payload, getAxiosConfig());
        toast.success("Batch created successfully!");
      }

      setIsModalOpen(false);
      resetForm();
      fetchBatches();
    } catch (error) {
      console.error("Failed to save batch:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid data provided.");
      } else {
        toast.error(
          isEditing ? "Failed to update batch." : "Failed to create batch."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ───────────────────────────
     Event Handlers
  ─────────────────────────── */
  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleEdit = (id) => {
    const batchToEdit = batches.find((b) => (b._id || b.id) === id);
    if (!batchToEdit) {
      toast.error("Batch not found for editing.");
      return;
    }

    const { start, end } = parseTime(batchToEdit.time);

    setFormData({
      sport: batchToEdit.sport || "",
      name: batchToEdit.name || "",
      coach: batchToEdit.coach || "",
      days: batchToEdit.days || [],
      timeFrom: start,
      timeTo: end,
      students: batchToEdit.students || 0,
      status: batchToEdit.status || "Active",
    });

    setIsEditing(true);
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleViewSchedule = (id) => {
    const batch = batches.find((b) => (b._id || b.id) === id);
    if (!batch) {
      toast.error("Batch not found.");
      return;
    }
    setSelectedBatch(batch);
    setIsViewScheduleOpen(true);
  };

  const handleCloseViewSchedule = () => {
    setIsViewScheduleOpen(false);
    setSelectedBatch(null);
  };

  const handleDeleteBatch = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this batch? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`${url}/api/batches/${id}`, getAxiosConfig());
        toast.success("Batch deleted successfully!");
        fetchBatches();
      } catch (error) {
        console.error("Delete failed:", error);
        if (error.response?.status === 404) {
          toast.error("Batch not found or already deleted.");
        } else if (error.response?.status === 401) {
          toast.error("Authentication failed. Please login again.");
        } else {
          toast.error("Failed to delete batch.");
        }
      }
    }
  };

  /* ───────────────────────────
     Filtering Logic
  ─────────────────────────── */
  const filteredBatches = batches.filter((batch) => {
    const matchesSport =
      sportFilter === "All Sports" || batch.sport === sportFilter;
    const matchesTime =
      timeFilter === "All Time Slots" ||
      (timeFilter === "Morning" && batch.time.includes("AM")) ||
      (timeFilter === "Afternoon" &&
        batch.time.includes("PM") &&
        !batch.time.includes("7:00") &&
        !batch.time.includes("8:00")) ||
      (timeFilter === "Evening" &&
        (batch.time.includes("7:00") || batch.time.includes("8:00")));
    const matchesCoach =
      coachFilter === "All Coaches" || batch.coach === coachFilter;
    const matchesStatus =
      statusFilter === "All Status" || batch.status === statusFilter;

    return matchesSport && matchesTime && matchesCoach && matchesStatus;
  });

  const statusClass = (status) =>
    status === "Active" ? styles.badgeActive : styles.badgeInactive;

  // Available days for selection
  const availableDays = [
    { value: "Monday", label: "Mon" },
    { value: "Tuesday", label: "Tue" },
    { value: "Wednesday", label: "Wed" },
    { value: "Thursday", label: "Thu" },
    { value: "Friday", label: "Fri" },
    { value: "Saturday", label: "Sat" },
    { value: "Sunday", label: "Sun" },
  ];

  /* ───────────────────────────
     UI Render
  ─────────────────────────── */
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Batch &amp; Schedule Management</h1>
          <p className={styles.subtitle}>
            Create and manage training batches, schedules and coach assignments.
          </p>
        </div>
        <button onClick={handleAddNew} className={styles.addBtn}>
          + Add New Batch
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Batches</div>
            <div className={styles.statValue}>
              {loading ? "..." : totalBatches}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Students</div>
            <div className={styles.statValue}>
              {loading ? "..." : totalStudents}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👨‍🏫</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Active Coaches</div>
            <div className={styles.statValue}>
              {loading ? "..." : activeCoaches}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Weekly Sessions</div>
            <div className={styles.statValue}>
              {loading ? "..." : weeklySessions}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersContainer}>
        <h3 className={styles.filtersTitle}>Filter Batches</h3>
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
              <option>Tennis</option>
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
              <option>Lisa Anderson</option>
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
      </div>

      {/* Batch List */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>
            Batch List ({filteredBatches.length} batches)
          </h2>
          {filteredBatches.length > 0 && (
            <p className={styles.resultsCount}>
              Showing {filteredBatches.length} of {totalBatches} batches
            </p>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <p>Loading batches...</p>
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>No batches found</h3>
            <p>
              No batches match your current filters or no batches have been
              created yet.
            </p>
            <button onClick={handleAddNew} className={styles.createFirstBtn}>
              Create Your First Batch
            </button>
          </div>
        ) : (
          <div className={styles.batchGrid}>
            {filteredBatches.map((batch) => (
              <div key={batch._id || batch.id} className={styles.batchCard}>
                <div className={styles.batchHeader}>
                  <div className={styles.batchTitleSection}>
                    <h3 className={styles.batchName}>{batch.name}</h3>
                    <span className={styles.sportTag}>{batch.sport}</span>
                  </div>
                  <span
                    className={`${styles.badge} ${statusClass(batch.status)}`}
                  >
                    {batch.status}
                  </span>
                </div>

                <div className={styles.batchDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>👥</span>
                    <span className={styles.detailText}>
                      {batch.students} Students
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>📅</span>
                    <span className={styles.detailText}>
                      {batch.days?.join(", ")}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>⏰</span>
                    <span className={styles.detailText}>{batch.time}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>👨‍🏫</span>
                    <span className={styles.detailText}>
                      Coach: {batch.coach}
                    </span>
                  </div>
                </div>

                <div className={styles.batchActions}>
                  <button
                    onClick={() => handleViewSchedule(batch._id || batch.id)}
                    className={styles.viewBtn}
                  >
                    View Schedule
                  </button>
                  <button
                    onClick={() => handleEdit(batch._id || batch.id)}
                    className={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBatch(batch._id || batch.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Batch Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {isEditing ? "Edit Batch" : "Create New Batch"}
              </h2>
              <button
                onClick={handleCloseModal}
                className={styles.closeBtn}
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGrid}>
                {/* Left Column */}
                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Sport Type *</label>
                    <select
                      name="sport"
                      value={formData.sport}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                      required
                    >
                      <option value="">Select Sport</option>
                      <option value="Football">Football</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Cricket">Cricket</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Swimming">Swimming</option>
                      <option value="Badminton">Badminton</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Batch Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="e.g. Football Training - Batch A"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Coach Name *</label>
                    <select
                      name="coach"
                      value={formData.coach}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                      required
                    >
                      <option value="">Select Coach</option>
                      <option value="Mike Johnson">Mike Johnson</option>
                      <option value="Sarah Wilson">Sarah Wilson</option>
                      <option value="David Brown">David Brown</option>
                      <option value="Lisa Anderson">Lisa Anderson</option>
                      <option value="John Smith">John Smith</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Initial Student Count
                    </label>
                    <input
                      type="number"
                      name="students"
                      value={formData.students}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Training Days *</label>
                    <div className={styles.checkboxGrid}>
                      {availableDays.map((day) => (
                        <label key={day.value} className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            name="days"
                            value={day.value}
                            checked={formData.days.includes(day.value)}
                            onChange={handleInputChange}
                            className={styles.checkbox}
                          />
                          <span className={styles.checkboxText}>
                            {day.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Start Time *</label>
                      <input
                        type="time"
                        name="timeFrom"
                        value={formData.timeFrom}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>End Time *</label>
                      <input
                        type="time"
                        name="timeTo"
                        value={formData.timeTo}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.cancelBtn}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update Batch"
                    : "Create Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Schedule Modal */}
      {isViewScheduleOpen && selectedBatch && (
        <div className={styles.modalOverlay} onClick={handleCloseViewSchedule}>
          <div
            className={styles.viewModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Batch Schedule Details</h2>
              <button
                onClick={handleCloseViewSchedule}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>

            <div className={styles.viewContent}>
              <div className={styles.batchOverview}>
                <div className={styles.overviewHeader}>
                  <h3 className={styles.batchTitle}>{selectedBatch.name}</h3>
                  <span
                    className={`${styles.statusBadge} ${statusClass(
                      selectedBatch.status
                    )}`}
                  >
                    {selectedBatch.status}
                  </span>
                </div>
                <div className={styles.sportInfo}>
                  <span className={styles.sportTag}>{selectedBatch.sport}</span>
                </div>
              </div>

              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleCard}>
                  <div className={styles.cardIcon}>👨‍🏫</div>
                  <div className={styles.cardContent}>
                    <h4 className={styles.cardTitle}>Coach</h4>
                    <p className={styles.cardValue}>{selectedBatch.coach}</p>
                  </div>
                </div>

                <div className={styles.scheduleCard}>
                  <div className={styles.cardIcon}>👥</div>
                  <div className={styles.cardContent}>
                    <h4 className={styles.cardTitle}>Students</h4>
                    <p className={styles.cardValue}>
                      {selectedBatch.students} enrolled
                    </p>
                  </div>
                </div>

                <div className={styles.scheduleCard}>
                  <div className={styles.cardIcon}>⏰</div>
                  <div className={styles.cardContent}>
                    <h4 className={styles.cardTitle}>Training Time</h4>
                    <p className={styles.cardValue}>{selectedBatch.time}</p>
                  </div>
                </div>

                <div className={styles.scheduleCard}>
                  <div className={styles.cardIcon}>📅</div>
                  <div className={styles.cardContent}>
                    <h4 className={styles.cardTitle}>Training Days</h4>
                    <p className={styles.cardValue}>
                      {selectedBatch.days?.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.weeklySchedule}>
                <h4 className={styles.sectionTitle}>Weekly Schedule</h4>
                <div className={styles.weekGrid}>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <div
                      key={day}
                      className={`${styles.dayCard} ${
                        selectedBatch.days?.includes(day)
                          ? styles.activeDay
                          : styles.inactiveDay
                      }`}
                    >
                      <div className={styles.dayName}>{day.slice(0, 3)}</div>
                      {selectedBatch.days?.includes(day) && (
                        <div className={styles.dayTime}>
                          {selectedBatch.time}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.additionalInfo}>
                <div className={styles.infoSection}>
                  <h4 className={styles.infoTitle}>Batch Information</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Created:</span>
                      <span className={styles.infoValue}>
                        {selectedBatch.createdAt
                          ? new Date(
                              selectedBatch.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Last Updated:</span>
                      <span className={styles.infoValue}>
                        {selectedBatch.updatedAt
                          ? new Date(
                              selectedBatch.updatedAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Batch ID:</span>
                      <span className={styles.infoValue}>
                        {(selectedBatch._id || selectedBatch.id)?.slice(-8) ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.viewModalFooter}>
              <button
                onClick={() =>
                  handleEdit(selectedBatch._id || selectedBatch.id)
                }
                className={styles.editFromViewBtn}
              >
                Edit Batch
              </button>
              <button
                onClick={handleCloseViewSchedule}
                className={styles.closeViewBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchSchedule;
