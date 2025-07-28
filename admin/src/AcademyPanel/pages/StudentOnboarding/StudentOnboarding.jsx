import React, { useState } from "react";
import styles from "./StudentOnboarding.module.css";

const StudentOnboarding = () => {
  const [activeTab, setActiveTab] = useState("manual");
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

  const [students, setStudents] = useState([
    {
      id: "ST001",
      name: "Alex Johnson",
      sport: "Football",
      status: "Assigned",
      batch: "Football A",
      joinDate: "2025-01-15",
    },
    {
      id: "ST002",
      name: "Emma Davis",
      sport: "Basketball",
      status: "Pending",
      batch: null,
      joinDate: "2025-01-20",
    },
  ]);

  const [matchingBatches, setMatchingBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  // Statistics
  const totalStudents = 147;
  const pendingOnboarding = 8;
  const assignedToBatches = 125;
  const waitingList = 14;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

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
    // Mock batch matching logic
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student registration data:", formData);
    alert("Student registered successfully!");

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
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Excel file uploaded:", file.name);
      alert("Excel file processing... (Feature coming soon)");
    }
  };

  const exportTemplate = () => {
    alert("Excel template downloaded!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Student Onboarding</h1>
        <p className={styles.description}>
          Add new students and assign them to appropriate batches based on their
          preferences.
        </p>
      </div>

      {/* Statistics */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Students</div>
            <div className={styles.statValue}>{totalStudents}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending Onboarding</div>
            <div className={styles.statValue}>{pendingOnboarding}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Assigned to Batches</div>
            <div className={styles.statValue}>{assignedToBatches}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Waiting List</div>
            <div className={styles.statValue}>{waitingList}</div>
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
