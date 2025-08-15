import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./CoachStaffRole.module.css";

const CoachStaffRole = ({ url }) => {
  /* ───────────────────────────
     State Management
  ─────────────────────────── */
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  /* ───────────────────────────
     State for filters
  ─────────────────────────── */
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [sportFilter, setSportFilter] = useState("All Sports");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [statusFilter, setStatusFilter] = useState("All Status");

  /* ───────────────────────────
     Form Data State
  ─────────────────────────── */
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    role: "",
    sport: "",
    experience: "",
    joined: "",
    salary: "",
    batches: [],
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
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${url}/api/coach-staff`,
        getAxiosConfig()
      );
      setStaff(response.data);
      if (response.data.length > 0) {
        toast.success("Staff data loaded successfully!");
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 404) {
        toast.error(
          "Staff endpoint not found. Please check backend configuration."
        );
      } else {
        toast.error("Failed to load staff data.");
      }
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchStaff();
    }
  }, [url]);

  /* ───────────────────────────
     Derived metrics
  ─────────────────────────── */
  const totalCoaches = staff.filter((s) => s.role.includes("Coach")).length;
  const supportStaff = staff.length - totalCoaches;
  const monthlyPayroll = staff.reduce((sum, s) => sum + (s.salary || 0), 0);
  const activeStaff = staff.filter((s) => s.status === "Active").length;

  /* ───────────────────────────
     Form Handlers
  ─────────────────────────── */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "batches") {
        setFormData((prev) => ({
          ...prev,
          batches: checked
            ? [...prev.batches, value]
            : prev.batches.filter((batch) => batch !== value),
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
      name: "",
      avatar: "",
      role: "",
      sport: "",
      experience: "",
      joined: "",
      salary: "",
      batches: [],
      status: "Active",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.role ||
      !formData.sport ||
      !formData.experience ||
      !formData.joined ||
      !formData.salary
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.name,
        avatar: formData.avatar || getDefaultAvatar(formData.role),
        role: formData.role,
        sport: formData.sport,
        experience: formData.experience,
        joined: formData.joined,
        salary: parseFloat(formData.salary),
        batches: formData.batches,
        status: formData.status,
      };

      if (isEditing) {
        await axios.put(
          `${url}/api/coach-staff/${editingId}`,
          payload,
          getAxiosConfig()
        );
        toast.success("Staff member updated successfully!");
      } else {
        await axios.post(`${url}/api/coach-staff`, payload, getAxiosConfig());
        toast.success("Staff member added successfully!");
      }

      setIsModalOpen(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      console.error("Failed to save staff:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid data provided.");
      } else {
        toast.error(
          isEditing
            ? "Failed to update staff member."
            : "Failed to add staff member."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ───────────────────────────
     Helper Functions
  ─────────────────────────── */
  const getDefaultAvatar = (role) => {
    if (role.includes("Coach")) {
      return role.includes("Head") ? "👨‍🏫" : "🧑‍🏫";
    }
    return "🧑‍💼";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  /* ───────────────────────────
     Event Handlers
  ─────────────────────────── */
  const openAddModal = () => {
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
    const staffToEdit = staff.find((s) => (s._id || s.id) === id);
    if (!staffToEdit) {
      toast.error("Staff member not found for editing.");
      return;
    }

    // Format joined date for input
    const joinedDate = new Date(staffToEdit.joined).toISOString().split("T")[0];

    setFormData({
      name: staffToEdit.name || "",
      avatar: staffToEdit.avatar || "",
      role: staffToEdit.role || "",
      sport: staffToEdit.sport || "",
      experience: staffToEdit.experience || "",
      joined: joinedDate,
      salary: staffToEdit.salary?.toString() || "",
      batches: staffToEdit.batches || [],
      status: staffToEdit.status || "Active",
    });

    setIsEditing(true);
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleProfile = (id) => {
    const staffMember = staff.find((s) => (s._id || s.id) === id);
    if (!staffMember) {
      toast.error("Staff member not found.");
      return;
    }
    setSelectedStaff(staffMember);
    setIsViewProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsViewProfileOpen(false);
    setSelectedStaff(null);
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `${url}/api/coach-staff/${id}/toggle-status`,
        {},
        getAxiosConfig()
      );
      toast.success("Staff status updated successfully!");
      fetchStaff();
    } catch (error) {
      console.error("Failed to toggle status:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to update staff status.");
      }
    }
  };

  const handleAssignBatch = async (id) => {
    const batch = prompt("Enter batch to assign (e.g., Football C):");
    if (!batch) return;

    try {
      await axios.patch(
        `${url}/api/coach-staff/${id}/assign-batch`,
        { batch },
        getAxiosConfig()
      );
      toast.success(`Batch "${batch}" assigned successfully!`);
      fetchStaff();
    } catch (error) {
      console.error("Failed to assign batch:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Failed to assign batch.");
      } else {
        toast.error("Failed to assign batch.");
      }
    }
  };

  const handleRemoveBatch = async (staffId, batch) => {
    if (window.confirm(`Remove "${batch}" from this staff member?`)) {
      try {
        await axios.patch(
          `${url}/api/coach-staff/${staffId}/remove-batch`,
          { batch },
          getAxiosConfig()
        );
        toast.success(`Batch "${batch}" removed successfully!`);
        fetchStaff();
      } catch (error) {
        console.error("Failed to remove batch:", error);
        toast.error("Failed to remove batch.");
      }
    }
  };

  const handleDeleteStaff = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this staff member? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`${url}/api/coach-staff/${id}`, getAxiosConfig());
        toast.success("Staff member deleted successfully!");
        fetchStaff();
      } catch (error) {
        console.error("Delete failed:", error);
        if (error.response?.status === 404) {
          toast.error("Staff member not found or already deleted.");
        } else {
          toast.error("Failed to delete staff member.");
        }
      }
    }
  };

  /* ───────────────────────────
     Filtering Logic
  ─────────────────────────── */
  const filteredStaff = staff.filter((p) => {
    const role = roleFilter === "All Roles" || p.role.includes(roleFilter);
    const sport = sportFilter === "All Sports" || p.sport === sportFilter;
    const level = levelFilter === "All Levels" || p.experience === levelFilter;
    const status = statusFilter === "All Status" || p.status === statusFilter;
    return role && sport && level && status;
  });

  const badgeClass = (status) =>
    status === "Active" ? styles.badgeActive : styles.badgeInactive;

  // Available batches for assignment
  const availableBatches = [
    "Football A",
    "Football B",
    "Football C",
    "Basketball A",
    "Basketball B",
    "Basketball C",
    "Cricket A",
    "Cricket B",
    "Tennis A",
  ];

  /* ───────────────────────────
     UI Render
  ─────────────────────────── */
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Coach &amp; Staff Management</h1>
          <p className={styles.subtitle}>
            Assign coaches to batches, track performance and manage salaries.
          </p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          + Add New Staff
        </button>
      </div>

      {/* Quick Stats */}
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👨‍🏫</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Coaches</div>
            <div className={styles.statValue}>
              {loading ? "..." : totalCoaches}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🧑‍💼</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Support Staff</div>
            <div className={styles.statValue}>
              {loading ? "..." : supportStaff}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Monthly Payroll</div>
            <div className={styles.statValue}>
              {loading ? "..." : formatSalary(monthlyPayroll)}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Active Staff</div>
            <div className={styles.statValue}>
              {loading ? "..." : activeStaff}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersContainer}>
        <h3 className={styles.filtersTitle}>Filter Staff</h3>
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
              <option>Tennis</option>
              <option>Multi-Sport</option>
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
      </div>

      {/* Staff Directory */}
      <div className={styles.directory}>
        <div className={styles.directoryHeader}>
          <h2 className={styles.sectionTitle}>
            Staff Directory ({filteredStaff.length} members)
          </h2>
          {filteredStaff.length > 0 && (
            <p className={styles.resultsCount}>
              Showing {filteredStaff.length} of {staff.length} staff members
            </p>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <p>Loading staff members...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👥</div>
            <h3>No staff members found</h3>
            <p>
              No staff members match your current filters or no staff have been
              added yet.
            </p>
            <button onClick={openAddModal} className={styles.createFirstBtn}>
              Add Your First Staff Member
            </button>
          </div>
        ) : (
          filteredStaff.map((p) => (
            <div key={p._id || p.id} className={styles.card}>
              <div className={styles.cardMain}>
                <div className={styles.info}>
                  <div className={styles.avatar}>
                    {p.avatar || getDefaultAvatar(p.role)}
                  </div>
                  <div className={styles.details}>
                    <h3 className={styles.name}>{p.name}</h3>
                    <p className={styles.meta}>
                      {p.role} • Joined {formatDate(p.joined)}
                    </p>
                    <p className={styles.experience}>
                      {p.experience} Level • {p.sport}
                    </p>
                  </div>
                </div>

                <div className={styles.rightBlock}>
                  <span className={`${styles.badge} ${badgeClass(p.status)}`}>
                    {p.status}
                  </span>
                  <div className={styles.salary}>
                    {formatSalary(p.salary)}/mo
                  </div>
                </div>
              </div>

              <div className={styles.cardSub}>
                <div className={styles.batchLine}>
                  <span className={styles.batchLabel}>Batches:</span>
                  <div className={styles.batchTags}>
                    {p.batches && p.batches.length ? (
                      p.batches.map((b) => (
                        <span key={b} className={styles.batchTag}>
                          {b}
                          <button
                            onClick={() => handleRemoveBatch(p._id || p.id, b)}
                            className={styles.removeBatchBtn}
                            title="Remove batch"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className={styles.noBatch}>
                        No batches assigned
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAssignBatch(p._id || p.id)}
                    className={styles.assignBtn}
                  >
                    + Assign
                  </button>
                </div>

                <div className={styles.actions}>
                  <button
                    onClick={() => handleEdit(p._id || p.id)}
                    className={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleProfile(p._id || p.id)}
                    className={styles.viewBtn}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => toggleStatus(p._id || p.id)}
                    className={styles.statusBtn}
                  >
                    {p.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(p._id || p.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Staff Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
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
                    <label className={styles.formLabel}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Head Coach – Football">
                        Head Coach – Football
                      </option>
                      <option value="Head Coach – Basketball">
                        Head Coach – Basketball
                      </option>
                      <option value="Head Coach – Cricket">
                        Head Coach – Cricket
                      </option>
                      <option value="Head Coach – Tennis">
                        Head Coach – Tennis
                      </option>
                      <option value="Assistant Coach">Assistant Coach</option>
                      <option value="Equipment Manager">
                        Equipment Manager
                      </option>
                      <option value="Fitness Trainer">Fitness Trainer</option>
                      <option value="Administrative Staff">
                        Administrative Staff
                      </option>
                      <option value="Support Staff">Support Staff</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Sport Specialization *
                    </label>
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
                      <option value="Multi-Sport">Multi-Sport</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Experience Level *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                      required
                    >
                      <option value="">Select Experience</option>
                      <option value="Junior">Junior (0-2 years)</option>
                      <option value="Mid-Level">Mid-Level (3-5 years)</option>
                      <option value="Senior">Senior (5+ years)</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Joining Date *</label>
                    <input
                      type="date"
                      name="joined"
                      value={formData.joined}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Monthly Salary (₹) *
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="25000"
                      min="0"
                      step="100"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Avatar Emoji</label>
                    <input
                      type="text"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="👨‍🏫 (optional)"
                      maxLength="2"
                    />
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
                      : "Adding..."
                    : isEditing
                    ? "Update Staff"
                    : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {isViewProfileOpen && selectedStaff && (
        <div className={styles.modalOverlay} onClick={handleCloseProfile}>
          <div
            className={styles.profileModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Staff Profile</h2>
              <button onClick={handleCloseProfile} className={styles.closeBtn}>
                ×
              </button>
            </div>

            <div className={styles.profileContent}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                  {selectedStaff.avatar || getDefaultAvatar(selectedStaff.role)}
                </div>
                <div className={styles.profileInfo}>
                  <h3 className={styles.profileName}>{selectedStaff.name}</h3>
                  <p className={styles.profileRole}>{selectedStaff.role}</p>
                  <span
                    className={`${styles.profileBadge} ${badgeClass(
                      selectedStaff.status
                    )}`}
                  >
                    {selectedStaff.status}
                  </span>
                </div>
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Sport:</span>
                    <span className={styles.detailValue}>
                      {selectedStaff.sport}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Experience:</span>
                    <span className={styles.detailValue}>
                      {selectedStaff.experience} Level
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Joined:</span>
                    <span className={styles.detailValue}>
                      {formatDate(selectedStaff.joined)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Salary:</span>
                    <span className={styles.detailValue}>
                      {formatSalary(selectedStaff.salary)}/month
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Staff ID:</span>
                    <span className={styles.detailValue}>
                      {selectedStaff.staffId ||
                        (selectedStaff._id || selectedStaff.id)?.slice(-6)}
                    </span>
                  </div>
                </div>

                <div className={styles.batchesSection}>
                  <h4 className={styles.sectionSubtitle}>Assigned Batches</h4>
                  <div className={styles.profileBatches}>
                    {selectedStaff.batches &&
                    selectedStaff.batches.length > 0 ? (
                      selectedStaff.batches.map((batch) => (
                        <span key={batch} className={styles.profileBatchTag}>
                          {batch}
                        </span>
                      ))
                    ) : (
                      <p className={styles.noBatchesText}>
                        No batches assigned
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.profileFooter}>
              <button
                onClick={() =>
                  handleEdit(selectedStaff._id || selectedStaff.id)
                }
                className={styles.editFromProfileBtn}
              >
                Edit Profile
              </button>
              <button
                onClick={handleCloseProfile}
                className={styles.closeProfileBtn}
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

export default CoachStaffRole;
