import React, { useEffect, useState } from "react";
import styles from "./StaffManagement.module.css";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaFilter,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaDownload,
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify"; // Added toast import

const StaffManagement = ({ url }) => {
  // Removed user prop
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Form state - Removed createdBy completely
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    status: "Active",
    salary: "",
    workSchedule: "",
    avatar: "",
  });

  // Get auth token from localStorage (adjust based on your auth implementation)
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Create axios config with auth header
  const getAxiosConfig = () => {
    const token = getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
      },
    };
  };

  // Fetch staff data from backend
  useEffect(() => {
    fetchStaff();
  }, [url]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/staff`, getAxiosConfig());
      setStaff(res.data);
      setFilteredStaff(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        toast.error("Authentication failed. Please login again."); // Added toast
      } else {
        setError("Failed to fetch staff data.");
        toast.error("Failed to fetch staff data."); // Added toast
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter staff based on search, department, and status
  useEffect(() => {
    let filtered = staff;

    if (departmentFilter !== "All Departments") {
      filtered = filtered.filter((s) => s.department === departmentFilter);
    }

    if (statusFilter !== "All Status") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStaff(filtered);
  }, [searchTerm, departmentFilter, statusFilter, staff]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new staff - Updated with toast notifications
  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${url}/api/staff`,
        formData,
        getAxiosConfig()
      );
      setStaff((prev) => [...prev, res.data]);
      setShowAddModal(false);
      resetForm();
      toast.success("Staff member added successfully!"); // Replaced alert with toast.success
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again."); // Replaced alert with toast.error
      } else {
        toast.error("Failed to add staff member. Please try again."); // Replaced alert with toast.error
      }
    }
  };

  // Edit staff - Updated with toast notifications
  const handleEditStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${url}/api/staff/${selectedStaff._id}`,
        formData,
        getAxiosConfig()
      );
      setStaff((prev) =>
        prev.map((s) => (s._id === selectedStaff._id ? res.data : s))
      );
      setShowEditModal(false);
      resetForm();
      setSelectedStaff(null);
      toast.success("Staff member updated successfully!"); // Replaced alert with toast.success
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again."); // Replaced alert with toast.error
      } else {
        toast.error("Failed to update staff member. Please try again."); // Replaced alert with toast.error
      }
    }
  };

  // Delete staff - Updated with toast notifications
  const handleDeleteStaff = async () => {
    try {
      await axios.delete(
        `${url}/api/staff/${selectedStaff._id}`,
        getAxiosConfig()
      );
      setStaff((prev) => prev.filter((s) => s._id !== selectedStaff._id));
      setShowDeleteModal(false);
      setSelectedStaff(null);
      toast.success("Staff member deleted successfully!"); // Replaced alert with toast.success
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again."); // Replaced alert with toast.error
      } else {
        toast.error("Failed to delete staff member. Please try again."); // Replaced alert with toast.error
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      status: "Active",
      salary: "",
      workSchedule: "",
      avatar: "",
    });
  };

  // Open modals
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openViewModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowViewModal(true);
  };

  const openEditModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone || "",
      position: staffMember.position || "",
      department: staffMember.department || "",
      status: staffMember.status,
      salary: staffMember.salary || "",
      workSchedule: staffMember.workSchedule || "",
      avatar: staffMember.avatar || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDeleteModal(true);
  };

  // Get unique departments and statuses
  const departments = [
    ...new Set(staff.map((s) => s.department).filter(Boolean)),
  ];
  const statuses = [...new Set(staff.map((s) => s.status))];

  // Calculate statistics
  const totalStaff = staff.length;
  const activeStaff = staff.filter((s) => s.status === "Active").length;
  const onLeaveStaff = staff.filter((s) => s.status === "On Leave").length;
  const inactiveStaff = staff.filter((s) => s.status === "Inactive").length;
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Staff Management</h1>
          <p className={styles.description}>
            Manage your turf staff members efficiently
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>
            <FaDownload className={styles.btnIcon} />
            Export
          </button>
          <button className={styles.addBtn} onClick={openAddModal}>
            <FaPlus className={styles.btnIcon} />
            Add Staff
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUsers />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totalStaff}</div>
            <div className={styles.statLabel}>Total Staff</div>
            <div className={styles.statGrowth}>All team members</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUserCheck />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{activeStaff}</div>
            <div className={styles.statLabel}>Active Staff</div>
            <div className={styles.statGrowth}>Currently working</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUserClock />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{onLeaveStaff}</div>
            <div className={styles.statLabel}>On Leave</div>
            <div className={styles.statGrowth}>Temporary absence</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUserTimes />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{inactiveStaff}</div>
            <div className={styles.statLabel}>Inactive</div>
            <div className={styles.statGrowth}>Not working</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="All Departments">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="All Status">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Section */}
      <div className={styles.staffSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Staff Members</h2>
        </div>

        {loading ? (
          <div className={styles.noResults}>
            <p>Loading staff members...</p>
          </div>
        ) : error ? (
          <div className={styles.noResults}>
            <p className={styles.error}>{error}</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className={styles.noResults}>
            <FaUsers
              style={{
                fontSize: "48px",
                color: "#d1d5db",
                marginBottom: "16px",
              }}
            />
            <h3>No Staff Detected</h3>
            <p>You haven't added any staff members yet.</p>
            <button
              className={styles.addBtn}
              onClick={openAddModal}
              style={{ marginTop: "16px" }}
            >
              <FaPlus className={styles.btnIcon} />
              Add New Staff
            </button>
          </div>
        ) : (
          <div className={styles.staffGrid}>
            {filteredStaff.map((member) => (
              <div key={member._id} className={styles.staffCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.staffAvatar}>
                    <img
                      src={
                        member.avatar ||
                        `https://api.dicebear.com/9.x/micah/svg?seed=${member.name}`
                      }
                      alt={member.name}
                      className={styles.avatarImage}
                    />
                  </div>
                  <span
                    className={`${styles.staffStatus} ${
                      member.status === "Active"
                        ? styles.statusActive
                        : member.status === "On Leave"
                        ? styles.statusOnLeave
                        : styles.statusInactive
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className={styles.staffInfo}>
                  <h3 className={styles.staffName}>{member.name}</h3>
                  <p className={styles.staffPosition}>{member.position}</p>
                  <p className={styles.staffDepartment}>{member.department}</p>
                </div>

                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <FaEnvelope className={styles.contactIcon} />
                    <span>{member.email}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <FaPhone className={styles.contactIcon} />
                    <span>{member.phone || "N/A"}</span>
                  </div>
                </div>

                <div className={styles.staffDetails}>
                  <div className={styles.detailItem}>
                    <FaCalendarAlt className={styles.detailIcon} />
                    <div>
                      <div className={styles.detailLabel}>Joined</div>
                      <div className={styles.detailValue}>
                        {new Date(member.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <FaClock className={styles.detailIcon} />
                    <div>
                      <div className={styles.detailLabel}>Schedule</div>
                      <div className={styles.detailValue}>
                        {member.workSchedule || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.salaryInfo}>
                  <div className={styles.salary}>₹{member.salary || "N/A"}</div>
                  <div className={styles.lastActive}>
                    Last Active: {member.lastActive || "N/A"}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => openViewModal(member)}
                    title="View Details"
                  >
                    <FaEye className={styles.actionIcon} />
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => openEditModal(member)}
                    title="Edit Staff"
                  >
                    <FaEdit className={styles.actionIcon} />
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => openDeleteModal(member)}
                    title="Delete Staff"
                  >
                    <FaTrash className={styles.actionIcon} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.quickTitle}>Quick Actions</h3>
        <div className={styles.quickButtons}>
          <button className={styles.quickBtn} onClick={openAddModal}>
            Add New Staff Member
          </button>
          <button
            className={styles.quickBtn}
            onClick={() => setStatusFilter("Active")}
          >
            View Active Staff
          </button>
          <button
            className={styles.quickBtn}
            onClick={() => setStatusFilter("On Leave")}
          >
            View Staff on Leave
          </button>
          <button className={styles.quickBtn} onClick={fetchStaff}>
            Refresh Staff List
          </button>
        </div>
      </div>

      {/* All your existing modals remain the same - just remove the user prop references */}
      {/* Add Staff Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Add New Staff Member</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Work Schedule</label>
                  <input
                    type="text"
                    name="workSchedule"
                    value={formData.workSchedule}
                    onChange={handleInputChange}
                    placeholder="e.g., 9 AM - 5 PM"
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Avatar URL</label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Keep all other modals exactly as they were */}
      {/* View Staff Modal */}
      {showViewModal && selectedStaff && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Staff Details</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowViewModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className={styles.viewModal}>
              <div className={styles.viewHeader}>
                <img
                  src={
                    selectedStaff.avatar ||
                    `https://api.dicebear.com/9.x/micah/svg?seed=${selectedStaff.name}`
                  }
                  alt={selectedStaff.name}
                  className={styles.viewAvatar}
                />
                <div className={styles.viewInfo}>
                  <h3>{selectedStaff.name}</h3>
                  <p className={styles.viewPosition}>
                    {selectedStaff.position}
                  </p>
                  <span
                    className={`${styles.staffStatus} ${
                      selectedStaff.status === "Active"
                        ? styles.statusActive
                        : selectedStaff.status === "On Leave"
                        ? styles.statusOnLeave
                        : styles.statusInactive
                    }`}
                  >
                    {selectedStaff.status}
                  </span>
                </div>
              </div>
              <div className={styles.viewDetails}>
                <div className={styles.viewSection}>
                  <h4>Contact Information</h4>
                  <div className={styles.viewItem}>
                    <FaEnvelope />
                    <span>{selectedStaff.email}</span>
                  </div>
                  <div className={styles.viewItem}>
                    <FaPhone />
                    <span>{selectedStaff.phone || "N/A"}</span>
                  </div>
                </div>
                <div className={styles.viewSection}>
                  <h4>Work Information</h4>
                  <div className={styles.viewItem}>
                    <FaMapMarkerAlt />
                    <span>{selectedStaff.department || "N/A"}</span>
                  </div>
                  <div className={styles.viewItem}>
                    <FaCalendarAlt />
                    <span>
                      Joined:{" "}
                      {new Date(selectedStaff.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.viewItem}>
                    <FaClock />
                    <span>{selectedStaff.workSchedule || "N/A"}</span>
                  </div>
                </div>
                <div className={styles.viewSection}>
                  <h4>Additional Information</h4>
                  <div className={styles.viewItem}>
                    <span>Salary: ₹{selectedStaff.salary || "N/A"}</span>
                  </div>
                  <div className={styles.viewItem}>
                    <span>
                      Last Active: {selectedStaff.lastActive || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && selectedStaff && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Edit Staff Member</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditStaff} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Work Schedule</label>
                  <input
                    type="text"
                    name="workSchedule"
                    value={formData.workSchedule}
                    onChange={handleInputChange}
                    placeholder="e.g., 9 AM - 5 PM"
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Avatar URL</label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Update Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStaff && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.deleteModal}`}>
            <div className={styles.modalHeader}>
              <h2>Delete Staff Member</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className={styles.deleteContent}>
              <div className={styles.warningIcon}>
                <FaTrash />
              </div>
              <h3>Are you sure?</h3>
              <p>
                You are about to delete <strong>{selectedStaff.name}</strong>{" "}
                from your staff list. This action cannot be undone.
              </p>
              <div className={styles.staffPreview}>
                <img
                  src={
                    selectedStaff.avatar ||
                    `https://api.dicebear.com/9.x/micah/svg?seed=${selectedStaff.name}`
                  }
                  alt={selectedStaff.name}
                  className={styles.previewAvatar}
                />
                <div>
                  <div className={styles.previewName}>{selectedStaff.name}</div>
                  <div className={styles.previewPosition}>
                    {selectedStaff.position}
                  </div>
                  <div className={styles.previewDepartment}>
                    {selectedStaff.department}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.deleteConfirmBtn}
                onClick={handleDeleteStaff}
              >
                Delete Staff Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
