import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import styles from "./StudentOnboarding.module.css";

const StudentOnboarding = ({ url }) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // New state for view management
  const [currentView, setCurrentView] = useState("onboarding"); // "onboarding" or "studentsList"
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // New states for table functionality
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    guardianName: "",
    guardianPhone: "",
    address: "",
    preferredSport: "",
    experienceLevel: "",
    preferredTimeSlot: "",
    availableDays: [],
    medicalConditions: "",
    emergencyContact: "",
  });

  const [matchingBatches, setMatchingBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  // Get auth token
  const getAuthToken = () => {
    return (
      localStorage.getItem("academyToken") || localStorage.getItem("token")
    );
  };

  // Create axios config with auth header
  const getAxiosConfig = () => {
    const token = getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch students data
  useEffect(() => {
    fetchStudents();
  }, [url]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${url}/api/academy-student`,
        getAxiosConfig()
      );
      setStudents(response.data);
      toast.success("Students data loaded successfully!");
    } catch (error) {
      console.error("Failed to fetch students:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to load students data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate dynamic statistics
  const calculateStatistics = () => {
    const totalStudents = students.length;
    const assignedToBatches = students.filter(
      (student) => student.selectedBatch && student.selectedBatch.trim() !== ""
    ).length;
    const pendingOnboarding = students.filter(
      (student) => !student.selectedBatch || student.selectedBatch.trim() === ""
    ).length;
    const waitingList = students.filter(
      (student) =>
        student.status === "Waiting" ||
        (!student.selectedBatch && student.preferredSport)
    ).length;

    return {
      totalStudents,
      assignedToBatches,
      pendingOnboarding,
      waitingList,
    };
  };

  const statistics = calculateStatistics();

  // Handle statistics card clicks
  const handleStatClick = (type) => {
    let studentsToShow = [];
    switch (type) {
      case "total":
        studentsToShow = students;
        break;
      case "assigned":
        studentsToShow = students.filter(
          (s) => s.selectedBatch && s.selectedBatch.trim() !== ""
        );
        break;
      case "pending":
        studentsToShow = students.filter(
          (s) => !s.selectedBatch || s.selectedBatch.trim() === ""
        );
        break;
      case "waiting":
        studentsToShow = students.filter(
          (s) =>
            s.status === "Waiting" || (!s.selectedBatch && s.preferredSport)
        );
        break;
      default:
        studentsToShow = students;
    }
    setFilteredStudents(studentsToShow);
    setFilterType(type);
    setCurrentPage(1);
    setSearchTerm("");
    setSortConfig({ key: null, direction: "asc" });
    setCurrentView("studentsList");
  };

  // Back to onboarding
  const handleBack = () => {
    setCurrentView("onboarding");
    setFilteredStudents([]);
    setFilterType("");
    setSearchTerm("");
    setSortConfig({ key: null, direction: "asc" });
    setCurrentPage(1);
  };

  // Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = React.useMemo(() => {
    if (!sortConfig.key) return filteredStudents;
    return [...filteredStudents].sort((a, b) => {
      let aVal = a[sortConfig.key] || "";
      let bVal = b[sortConfig.key] || "";
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = sortedStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get sort icon
  const getSortIcon = (column) => {
    if (sortConfig.key !== column)
      return <FaSort className={styles.sortIcon} />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className={styles.sortIcon} />
    ) : (
      <FaSortDown className={styles.sortIcon} />
    );
  };

  // Filter students based on search
  useEffect(() => {
    if (currentView !== "studentsList") return;

    let filtered = [];
    switch (filterType) {
      case "total":
        filtered = [...students];
        break;
      case "assigned":
        filtered = students.filter(
          (s) => s.selectedBatch && s.selectedBatch.trim() !== ""
        );
        break;
      case "pending":
        filtered = students.filter(
          (s) => !s.selectedBatch || s.selectedBatch.trim() === ""
        );
        break;
      case "waiting":
        filtered = students.filter(
          (s) =>
            s.status === "Waiting" || (!s.selectedBatch && s.preferredSport)
        );
        break;
      default:
        filtered = [...students];
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((s) => {
        const combined =
          `${s.firstName} ${s.lastName} ${s.email} ${s.preferredSport} ${s.guardianName}`.toLowerCase();
        return combined.includes(term);
      });
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students, filterType, currentView]);

  // Delete student
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(
          `${url}/api/academy-student/${id}`,
          getAxiosConfig()
        );
        toast.success("Student deleted successfully!");
        const newStudents = students.filter((s) => s._id !== id);
        setStudents(newStudents);
        const newFiltered = filteredStudents.filter((s) => s._id !== id);
        setFilteredStudents(newFiltered);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          toast.error("Authentication failed. Please login again.");
        } else {
          toast.error("Failed to delete student.");
        }
      }
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "dateOfBirth" && value) {
      const isoDate = new Date(value).toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, dateOfBirth: isoDate }));
      return;
    }

    if (type === "checkbox") {
      if (name === "availableDays") {
        setFormData((prev) => ({
          ...prev,
          availableDays: checked
            ? [...prev.availableDays, value]
            : prev.availableDays.filter((day) => day !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const findMatchingBatches = () => {
    const mockBatches = [
      {
        id: "FB01",
        name: "Football Training - Batch A",
        time: "6:00 - 8:00 AM",
        days: ["Mon", "Wed", "Fri"],
      },
      {
        id: "FB02",
        name: "Football Training - Batch B",
        time: "5:00 - 7:00 PM",
        days: ["Tue", "Thu", "Sat"],
      },
    ];

    setMatchingBatches(mockBatches);
    toast.info(`Found ${mockBatches.length} matching batches!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        selectedBatch,
      };

      const response = await axios.post(
        `${url}/api/academy-student`,
        payload,
        getAxiosConfig()
      );

      toast.success("✅ Student registered successfully!");

      // Update students list
      setStudents((prev) => [...prev, response.data]);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        phone: "",
        guardianName: "",
        guardianPhone: "",
        address: "",
        preferredSport: "",
        experienceLevel: "",
        preferredTimeSlot: "",
        availableDays: [],
        medicalConditions: "",
        emergencyContact: "",
      });

      setMatchingBatches([]);
      setSelectedBatch("");
    } catch (error) {
      console.error("Student registration failed:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error(
          `❌ Failed to register student: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Excel file uploaded:", file.name);
      toast.info("Excel file processing... (Feature coming soon)");
    }
  };

  const exportTemplate = () => {
    toast.success("Excel template downloaded!");
  };

  const getFilterTitle = () => {
    switch (filterType) {
      case "total":
        return "All Students";
      case "assigned":
        return "Students Assigned to Batches";
      case "pending":
        return "Students Pending Onboarding";
      case "waiting":
        return "Students on Waiting List";
      default:
        return "Students List";
    }
  };

  // Render Students List View with Table
  if (currentView === "studentsList") {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={handleBack} className={styles.backBtn}>
            <FaArrowLeft /> Back to Onboarding
          </button>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>{getFilterTitle()}</h1>
            <p className={styles.count}>
              Showing {currentStudents.length} of {sortedStudents.length}{" "}
              students
            </p>
          </div>
        </div>

        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search students by name, email, sport, or guardian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.studentsTable}>
            <thead className={styles.tableHeader}>
              <tr>
                <th
                  className={styles.sortableHeader}
                  onClick={() => handleSort("firstName")}
                >
                  Name {getSortIcon("firstName")}
                </th>
                <th
                  className={styles.sortableHeader}
                  onClick={() => handleSort("email")}
                >
                  Email {getSortIcon("email")}
                </th>
                <th>Phone</th>
                <th
                  className={styles.sortableHeader}
                  onClick={() => handleSort("preferredSport")}
                >
                  Sport {getSortIcon("preferredSport")}
                </th>
                <th
                  className={styles.sortableHeader}
                  onClick={() => handleSort("experienceLevel")}
                >
                  Experience {getSortIcon("experienceLevel")}
                </th>
                <th>Guardian</th>
                <th>Batch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                >
                  <td className={styles.nameCell}>
                    <div className={styles.studentName}>
                      {student.firstName} {student.lastName}
                    </div>
                    <div className={styles.studentId}>
                      ID: {student._id.slice(-6)}
                    </div>
                  </td>
                  <td className={styles.emailCell}>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>
                    <span className={styles.sportTag}>
                      {student.preferredSport}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.experienceTag} ${
                        styles[student.experienceLevel?.toLowerCase()]
                      }`}
                    >
                      {student.experienceLevel}
                    </span>
                  </td>
                  <td>
                    <div className={styles.guardianInfo}>
                      <div>{student.guardianName}</div>
                      <div className={styles.guardianPhone}>
                        {student.guardianPhone}
                      </div>
                    </div>
                  </td>
                  <td>
                    {student.selectedBatch ? (
                      <span className={styles.batchTag}>
                        {student.selectedBatch}
                      </span>
                    ) : (
                      <span className={styles.noBatch}>Not Assigned</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        student.selectedBatch ? styles.assigned : styles.pending
                      }`}
                    >
                      {student.selectedBatch ? "Assigned" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.actionBtn} title="View Details">
                        <FaEye />
                      </button>
                      <button className={styles.actionBtn} title="Edit Student">
                        <FaEdit />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(student._id)}
                        title="Delete Student"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedStudents.length === 0 && (
            <div className={styles.emptyState}>
              <h3>No students found</h3>
              <p>Try adjusting your search criteria or add new students.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`${styles.pageBtn} ${
                  currentPage === index + 1 ? styles.activePage : ""
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageBtn}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render Main Onboarding View
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Student Onboarding</h1>
        <p className={styles.description}>
          Add new students and assign them to appropriate batches based on their
          preferences.
        </p>
      </div>

      {/* Dynamic Statistics */}
      <div className={styles.statsSection}>
        <div
          className={`${styles.statCard} ${styles.clickable}`}
          onClick={() => handleStatClick("total")}
          title="Click to view all students"
        >
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Students</div>
            <div className={styles.statValue}>
              {loading ? "..." : statistics.totalStudents}
            </div>
          </div>
        </div>

        <div
          className={`${styles.statCard} ${styles.clickable}`}
          onClick={() => handleStatClick("pending")}
          title="Click to view pending students"
        >
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending Onboarding</div>
            <div className={styles.statValue}>
              {loading ? "..." : statistics.pendingOnboarding}
            </div>
          </div>
        </div>

        <div
          className={`${styles.statCard} ${styles.clickable}`}
          onClick={() => handleStatClick("assigned")}
          title="Click to view assigned students"
        >
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Assigned to Batches</div>
            <div className={styles.statValue}>
              {loading ? "..." : statistics.assignedToBatches}
            </div>
          </div>
        </div>

        <div
          className={`${styles.statCard} ${styles.clickable}`}
          onClick={() => handleStatClick("waiting")}
          title="Click to view waiting list"
        >
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Waiting List</div>
            <div className={styles.statValue}>
              {loading ? "..." : statistics.waitingList}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${
            activeTab === "manual" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("manual")}
        >
          Manual Registration
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "bulk" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("bulk")}
        >
          Bulk Upload
        </button>
      </div>

      {activeTab === "manual" && (
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.registrationForm}>
            <div className={styles.formGrid}>
              {/* Left Column - Student Registration Form */}
              <div className={styles.formColumn}>
                <h2 className={styles.sectionTitle}>
                  Student Registration Form
                </h2>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Guardian/Parent Name</label>
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter guardian name"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Guardian Phone</label>
                    <input
                      type="tel"
                      name="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Guardian phone number"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Enter complete address"
                    rows="3"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Medical Conditions (if any)
                  </label>
                  <textarea
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Mention any medical conditions or allergies"
                    rows="2"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Emergency Contact</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Emergency contact person & number"
                    required
                  />
                </div>
              </div>

              {/* Right Column - Sport Preferences & Batch Assignment */}
              <div className={styles.formColumn}>
                <h2 className={styles.sectionTitle}>
                  Sport Preferences &amp; Batch Assignment
                </h2>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Preferred Sport</label>
                  <select
                    name="preferredSport"
                    value={formData.preferredSport}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select Preferred Sport</option>
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Tennis">Tennis</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select Experience Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Preferred Time Slot</label>
                  <select
                    name="preferredTimeSlot"
                    value={formData.preferredTimeSlot}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select Time Preference</option>
                    <option value="Morning">Morning (6:00 - 9:00 AM)</option>
                    <option value="Afternoon">
                      Afternoon (2:00 - 5:00 PM)
                    </option>
                    <option value="Evening">Evening (5:00 - 8:00 PM)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Available Days</label>
                  <div className={styles.checkboxGroup}>
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ].map((day) => (
                      <label key={day} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="availableDays"
                          value={day}
                          checked={formData.availableDays.includes(day)}
                          onChange={handleInputChange}
                          className={styles.checkbox}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={findMatchingBatches}
                  className={styles.findBtn}
                  disabled={
                    !formData.preferredSport || !formData.preferredTimeSlot
                  }
                >
                  🔍 Find Matching Batches
                </button>

                {matchingBatches.length > 0 && (
                  <div className={styles.batchResults}>
                    <h3 className={styles.batchTitle}>Available Batches</h3>
                    {matchingBatches.map((batch) => (
                      <div key={batch.id} className={styles.batchCard}>
                        <input
                          type="radio"
                          id={batch.id}
                          name="selectedBatch"
                          value={batch.id}
                          onChange={(e) => setSelectedBatch(e.target.value)}
                          className={styles.radio}
                        />
                        <label htmlFor={batch.id} className={styles.batchLabel}>
                          <div className={styles.batchName}>{batch.name}</div>
                          <div className={styles.batchMeta}>
                            {batch.time} • {batch.days.join(", ")}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                <button type="submit" className={styles.submitBtn}>
                  ➕ Add New Student
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {activeTab === "bulk" && (
        <div className={styles.bulkSection}>
          <div className={styles.bulkUpload}>
            <h2 className={styles.sectionTitle}>Bulk Student Upload</h2>
            <p className={styles.bulkDescription}>
              Upload multiple students at once using an Excel file. Download the
              template to get started.
            </p>

            <div className={styles.uploadActions}>
              <button onClick={exportTemplate} className={styles.templateBtn}>
                📥 Download Template
              </button>

              <div className={styles.fileUpload}>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className={styles.fileInput}
                  id="excelUpload"
                />
                <label htmlFor="excelUpload" className={styles.uploadBtn}>
                  📤 Upload Excel File
                </label>
              </div>
            </div>

            <div className={styles.uploadInstructions}>
              <h3>Instructions:</h3>
              <ul>
                <li>Download the Excel template with required columns</li>
                <li>Fill in student information row by row</li>
                <li>Ensure all required fields are completed</li>
                <li>Upload the completed file for batch processing</li>
                <li>Review and approve students before final enrollment</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOnboarding;
