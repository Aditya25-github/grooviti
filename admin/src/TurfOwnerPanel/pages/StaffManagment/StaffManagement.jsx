import React, { useState } from "react";
import styles from "./StaffManagement.module.css";
import {
  FaUser,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaDownload,
  FaFilter,
} from "react-icons/fa";

const StaffManagement = () => {
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock staff data
  const [staff] = useState([
    {
      id: "EMP001",
      name: "John Smith",
      email: "john@turfmanager.com",
      phone: "+91 98765 43210",
      position: "Manager",
      department: "Management",
      joinDate: "2023-01-15",
      status: "Active",
      salary: 45000,
      avatar: "https://api.dicebear.com/9.x/micah/svg?seed=John",
      workSchedule: "Full-time",
      lastActive: "2 hours ago",
    },
    {
      id: "EMP002",
      name: "Sarah Johnson",
      email: "sarah@turfmanager.com",
      phone: "+91 87654 32109",
      position: "Supervisor",
      department: "Maintenance",
      joinDate: "2023-03-22",
      status: "Active",
      salary: 35000,
      avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Sarah",
      workSchedule: "Full-time",
      lastActive: "1 hour ago",
    },
    {
      id: "EMP003",
      name: "Mike Wilson",
      email: "mike@turfmanager.com",
      phone: "+91 76543 21098",
      position: "Guard",
      department: "Security",
      joinDate: "2023-02-10",
      status: "On Leave",
      salary: 25000,
      avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Mike",
      workSchedule: "Night Shift",
      lastActive: "1 day ago",
    },
    {
      id: "EMP004",
      name: "Emma Davis",
      email: "emma@turfmanager.com",
      phone: "+91 65432 10987",
      position: "Receptionist",
      department: "Administration",
      joinDate: "2023-05-18",
      status: "Active",
      salary: 28000,
      avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Emma",
      workSchedule: "Day Shift",
      lastActive: "30 minutes ago",
    },
    {
      id: "EMP005",
      name: "Alex Thompson",
      email: "alex@turfmanager.com",
      phone: "+91 54321 09876",
      position: "Maintenance Staff",
      department: "Maintenance",
      joinDate: "2023-04-05",
      status: "Active",
      salary: 22000,
      avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Alex",
      workSchedule: "Full-time",
      lastActive: "3 hours ago",
    },
  ]);

  // Statistics
  const totalStaff = staff.length;
  const activeStaff = staff.filter((s) => s.status === "Active").length;
  const onLeaveStaff = staff.filter((s) => s.status === "On Leave").length;
  const totalSalary = staff.reduce((sum, s) => sum + s.salary, 0);

  const handleAddStaff = () => {
    console.log("Add new staff member");
    alert("Opening add staff form...");
  };

  const handleViewStaff = (staffId) => {
    console.log("View staff:", staffId);
    alert(`Opening staff details for ${staffId}`);
  };

  const handleEditStaff = (staffId) => {
    console.log("Edit staff:", staffId);
    alert(`Opening edit form for ${staffId}`);
  };

  const handleDeleteStaff = (staffId) => {
    console.log("Delete staff:", staffId);
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      alert(`Staff member ${staffId} deleted`);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return styles.statusActive;
      case "On Leave":
        return styles.statusOnLeave;
      case "Inactive":
        return styles.statusInactive;
      default:
        return styles.statusDefault;
    }
  };

  const filteredStaff = staff.filter((member) => {
    const departmentMatch =
      departmentFilter === "All Departments" ||
      member.department === departmentFilter;
    const statusMatch =
      statusFilter === "All Status" || member.status === statusFilter;
    const searchMatch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase());
    return departmentMatch && statusMatch && searchMatch;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Staff Management</h1>
          <p className={styles.description}>
            Manage your turf staff members, their roles, and performance
            efficiently
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>
            <FaDownload className={styles.btnIcon} />
            Export
          </button>
          <button onClick={handleAddStaff} className={styles.addBtn}>
            <FaPlus className={styles.btnIcon} />
            Add Staff
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totalStaff}</div>
            <div className={styles.statLabel}>Total Staff</div>
            <div className={styles.statGrowth}>All employees</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{activeStaff}</div>
            <div className={styles.statLabel}>Active Staff</div>
            <div className={styles.statGrowth}>Currently working</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏖️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{onLeaveStaff}</div>
            <div className={styles.statLabel}>On Leave</div>
            <div className={styles.statGrowth}>Temporary absence</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              ₹{(totalSalary / 1000).toFixed(0)}k
            </div>
            <div className={styles.statLabel}>Total Payroll</div>
            <div className={styles.statGrowth}>Monthly expenses</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search staff by name, email, or position..."
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
            <option value="Management">Management</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Security">Security</option>
            <option value="Administration">Administration</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff List */}
      <div className={styles.staffSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Staff Members ({filteredStaff.length})
          </h2>
        </div>

        <div className={styles.staffGrid}>
          {filteredStaff.map((member) => (
            <div key={member.id} className={styles.staffCard}>
              <div className={styles.cardHeader}>
                <div className={styles.staffAvatar}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className={styles.avatarImage}
                  />
                </div>
                <div
                  className={`${styles.staffStatus} ${getStatusClass(
                    member.status
                  )}`}
                >
                  {member.status}
                </div>
              </div>

              <div className={styles.staffInfo}>
                <h3 className={styles.staffName}>{member.name}</h3>
                <p className={styles.staffPosition}>{member.position}</p>
                <p className={styles.staffDepartment}>{member.department}</p>
              </div>

              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <FaPhone className={styles.contactIcon} />
                  <span>{member.phone}</span>
                </div>
                <div className={styles.contactItem}>
                  <FaEnvelope className={styles.contactIcon} />
                  <span>{member.email}</span>
                </div>
              </div>

              <div className={styles.staffDetails}>
                <div className={styles.detailItem}>
                  <FaCalendarAlt className={styles.detailIcon} />
                  <div>
                    <div className={styles.detailLabel}>Join Date</div>
                    <div className={styles.detailValue}>{member.joinDate}</div>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FaClock className={styles.detailIcon} />
                  <div>
                    <div className={styles.detailLabel}>Schedule</div>
                    <div className={styles.detailValue}>
                      {member.workSchedule}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.salaryInfo}>
                <div className={styles.salary}>
                  ₹{member.salary.toLocaleString()}/month
                </div>
                <div className={styles.lastActive}>
                  Last active: {member.lastActive}
                </div>
              </div>

              <div className={styles.cardActions}>
                <button
                  onClick={() => handleViewStaff(member.id)}
                  className={styles.actionBtn}
                  title="View Details"
                >
                  <FaEye className={styles.actionIcon} />
                </button>
                <button
                  onClick={() => handleEditStaff(member.id)}
                  className={styles.actionBtn}
                  title="Edit Staff"
                >
                  <FaEdit className={styles.actionIcon} />
                </button>
                <button
                  onClick={() => handleDeleteStaff(member.id)}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  title="Delete Staff"
                >
                  <FaTrash className={styles.actionIcon} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className={styles.noResults}>
            <p>No staff members found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.quickTitle}>Quick Actions</h3>
        <div className={styles.quickButtons}>
          <button className={styles.quickBtn}>
            📊 Generate Payroll Report
          </button>
          <button className={styles.quickBtn}>📅 Manage Schedules</button>
          <button className={styles.quickBtn}>🏖️ Track Leave Requests</button>
          <button className={styles.quickBtn}>📈 Performance Reviews</button>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
