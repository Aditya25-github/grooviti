import React, { useState, useEffect } from "react";
import styles from "./AttendanceManagment.module.css";
import axios from "axios";
import { toast } from "react-toastify";

const AttendanceManagement = ({ url }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedCoach, setSelectedCoach] = useState("Mike Johnson");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      // If "All Batches" is selected, directly fetch students without checking attendance
      if (selectedBatch === "All Batches") {
        fetchStudentsOnly();
        return;
      }

      const res = await axios.get(`${url}/api/attendance/record`, {
        ...getAxiosConfig(),
        params: { date: selectedDate, batch: selectedBatch },
      });

      // If attendance exists, populate with existing data
      if (res.data && res.data.students) {
        // Map the attendance data to frontend format
        const studentsWithAttendance = await Promise.all(
          res.data.students.map(async (attendanceRecord) => {
            try {
              // Get full student details
              const studentRes = await axios.get(
                `${url}/api/academy-student/${attendanceRecord.student}`,
                getAxiosConfig()
              );

              return {
                studentId: attendanceRecord.student,
                name: `${studentRes.data.firstName} ${studentRes.data.lastName}`,
                avatar:
                  studentRes.data.avatar ||
                  `https://api.dicebear.com/9.x/micah/svg?seed=${studentRes.data.firstName}`,
                timeSlot: studentRes.data.preferredTimeSlot || "N/A",
                batch: studentRes.data.selectedBatch || "N/A",
                isPresent: attendanceRecord.isPresent,
              };
            } catch (error) {
              console.error("Error fetching student details:", error);
              return {
                studentId: attendanceRecord.student,
                name: "Unknown Student",
                avatar: "",
                timeSlot: "N/A",
                batch: "N/A",
                isPresent: attendanceRecord.isPresent,
              };
            }
          })
        );

        setStudents(studentsWithAttendance);
        setSelectedCoach(res.data.coach || selectedCoach);
        toast.success("Attendance record loaded successfully!");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        console.log("No attendance record found, loading student list...");
        fetchStudentsOnly();
      } else {
        console.error("Error fetching attendance:", err);
        toast.error("Failed to load attendance data.");
        fetchStudentsOnly();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsOnly = async () => {
    try {
      setLoading(true);

      const params = {
        date: selectedDate,
      };

      if (selectedBatch !== "All Batches") {
        params.batch = selectedBatch;
      }

      const res = await axios.get(`${url}/api/attendance/students`, {
        ...getAxiosConfig(),
        params,
      });

      let studentsData = [];
      if (res.data && res.data.students) {
        studentsData = res.data.students;
      } else if (Array.isArray(res.data)) {
        studentsData = res.data;
      }

      if (studentsData.length === 0) {
        toast.info(
          selectedBatch === "All Batches"
            ? "No students found in any batch."
            : "No students found for the selected batch."
        );
        setStudents([]);
        return;
      }

      const studentsWithStatus = studentsData.map((student) => ({
        studentId: student.studentId || student._id,
        name: student.name || `${student.firstName} ${student.lastName}`,
        avatar:
          student.avatar ||
          `https://api.dicebear.com/9.x/micah/svg?seed=${
            student.name || student.firstName
          }`,
        timeSlot: student.timeSlot || student.preferredTimeSlot || "N/A",
        batch: student.batch || student.selectedBatch || "N/A",
        isPresent: true,
      }));

      setStudents(studentsWithStatus);
      toast.success(
        `Loaded ${studentsWithStatus.length} students for attendance.`
      );
    } catch (error) {
      console.error("Error fetching students:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to load students.");
      }
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedBatch) {
      fetchAttendance();
    }
  }, [selectedDate, selectedBatch]);

  const totalStudents = students.length;
  const presentCount = students.filter((s) => s.isPresent).length;
  const absentCount = totalStudents - presentCount;

  const handleAttendanceChange = (studentId) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.studentId === studentId
          ? { ...student, isPresent: !student.isPresent }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, isPresent: true }))
    );
    toast.success("All students marked as present!");
  };

  const markAllAbsent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, isPresent: false }))
    );
    toast.success("All students marked as absent!");
  };

  const saveAttendance = async () => {
    if (students.length === 0) {
      toast.warning("No students to save attendance for.");
      return;
    }

    if (selectedBatch === "All Batches") {
      toast.warning(
        "Please select a specific batch to save attendance. 'All Batches' is for viewing only."
      );
      return;
    }

    try {
      setLoading(true);
      const payload = {
        date: selectedDate,
        batch: selectedBatch,
        coach: selectedCoach,
        students: students.map((student) => ({
          studentId: student.studentId,
          isPresent: student.isPresent,
        })),
      };

      await axios.post(`${url}/api/attendance`, payload, getAxiosConfig());
      toast.success("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to save attendance. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>Attendance Management</h1>
        <p className={styles.subtitle}>
          Mark attendance for students by selecting date and batch.
        </p>
      </div>

      {/* Controls Section */}
      <div className={styles.controlsSection}>
        <div className={styles.controlsGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.dateInput}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Select Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All Batches">All Batches</option>
              <option value="Football Training - Batch A">
                Football Training - Batch A
              </option>
              <option value="Football Training - Batch B">
                Football Training - Batch B
              </option>
              <option value="Basketball Training - Batch A">
                Basketball Training - Batch A
              </option>
              <option value="Cricket Training - Batch A">
                Cricket Training - Batch A
              </option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Coach</label>
            <select
              value={selectedCoach}
              onChange={(e) => setSelectedCoach(e.target.value)}
              className={styles.selectInput}
              disabled={selectedBatch === "All Batches"}
            >
              <option value="Mike Johnson">Mike Johnson</option>
              <option value="Sarah Wilson">Sarah Wilson</option>
              <option value="David Brown">David Brown</option>
              <option value="Lisa Anderson">Lisa Anderson</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics and Actions Section */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Students:</span>
            <span className={styles.statValue}>{totalStudents}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Present:</span>
            <span className={`${styles.statValue} ${styles.present}`}>
              {presentCount}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Absent:</span>
            <span className={`${styles.statValue} ${styles.absent}`}>
              {absentCount}
            </span>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button
            onClick={markAllPresent}
            className={styles.markAllPresentBtn}
            disabled={selectedBatch === "All Batches"}
          >
            Mark All Present
          </button>
          <button
            onClick={saveAttendance}
            className={styles.saveAttendanceBtn}
            disabled={loading || selectedBatch === "All Batches"}
          >
            {loading ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>

      {/* Notice for All Batches */}
      {selectedBatch === "All Batches" && (
        <div className={styles.notice}>
          <p>
            <strong>Note:</strong> You are viewing students from all batches. To
            save attendance, please select a specific batch.
          </p>
        </div>
      )}

      {/* Student List Section */}
      {loading ? (
        <div className={styles.loadingState}>
          <p>Loading students...</p>
        </div>
      ) : (
        <div className={styles.studentListSection}>
          <h2 className={styles.sectionTitle}>Student Attendance List</h2>

          {students.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No Students Found</h3>
              <p>
                {selectedBatch === "All Batches"
                  ? "No students are assigned to any batch or no students exist for this date."
                  : "No students are assigned to the selected batch or no students exist for this date."}
              </p>
            </div>
          ) : (
            <div className={styles.studentGrid}>
              {students.map((student, index) => (
                <div key={student.studentId} className={styles.studentCard}>
                  <div className={styles.studentHeader}>
                    <div className={styles.studentAvatar}>
                      <img
                        src={student.avatar}
                        alt={student.name}
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/9.x/micah/svg?seed=${student.name}`;
                        }}
                      />
                    </div>
                    <div className={styles.studentInfo}>
                      <h3 className={styles.studentName}>{student.name}</h3>
                      <p className={styles.studentId}>
                        Student ID:{" "}
                        {student.studentId?.slice(-6) || `ST00${index + 1}`}
                      </p>
                      {selectedBatch === "All Batches" && (
                        <p className={styles.studentBatch}>
                          Batch: {student.batch}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.attendanceInfo}>
                    <div className={styles.timeSlot}>{student.timeSlot}</div>
                    <div className={styles.attendanceToggle}>
                      <label className={styles.toggleContainer}>
                        <input
                          type="checkbox"
                          checked={student.isPresent}
                          onChange={() =>
                            handleAttendanceChange(student.studentId)
                          }
                          className={styles.toggleInput}
                          disabled={selectedBatch === "All Batches"}
                        />
                        <span
                          className={`${styles.toggleLabel} ${
                            student.isPresent ? styles.present : styles.absent
                          }`}
                        >
                          {student.isPresent ? "Present" : "Absent"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
