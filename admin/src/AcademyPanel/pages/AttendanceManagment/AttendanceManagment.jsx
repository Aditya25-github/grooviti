import React, { useState } from "react";
import styles from "./AttendanceManagment.module.css";

const AttendanceManagement = () => {
  const [selectedDate, setSelectedDate] = useState("26/01/2025");
  const [selectedBatch, setSelectedBatch] = useState(
    "Football Training - Batch A"
  );
  const [selectedCoach, setSelectedCoach] = useState("Mike Johnson");

  const [students, setStudents] = useState([
    {
      id: "ST001",
      name: "Alex Johnson",
      avatar: "👨‍🎓",
      timeSlot: "6:00 AM - 8:00 AM",
      isPresent: true,
    },
    {
      id: "ST002",
      name: "Emma Davis",
      avatar: "👩‍🎓",
      timeSlot: "6:00 AM - 8:00 AM",
      isPresent: true,
    },
    {
      id: "ST003",
      name: "Michael Smith",
      avatar: "👨‍🎓",
      timeSlot: "6:00 AM - 8:00 AM",
      isPresent: false,
    },
    {
      id: "ST004",
      name: "Sophie Wilson",
      avatar: "👩‍🎓",
      timeSlot: "6:00 AM - 8:00 AM",
      isPresent: true,
    },
  ]);

  const totalStudents = students.length;
  const presentCount = students.filter((student) => student.isPresent).length;
  const absentCount = totalStudents - presentCount;

  const handleAttendanceChange = (studentId) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, isPresent: !student.isPresent }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, isPresent: true }))
    );
  };

  const saveAttendance = () => {
    // Handle save attendance logic here
    console.log("Attendance saved:", students);
    alert("Attendance saved successfully!");
  };

  return (
    <div className={styles.attendanceContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Attendance Management</h1>
        <p className={styles.description}>
          Mark attendance for students by selecting date and batch.
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.label}>Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Select Batch</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className={styles.select}
          >
            <option value="Football Training - Batch A">
              Football Training - Batch A
            </option>
            <option value="Football Training - Batch B">
              Football Training - Batch B
            </option>
            <option value="Basketball Training - Batch A">
              Basketball Training - Batch A
            </option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Coach</label>
          <select
            value={selectedCoach}
            onChange={(e) => setSelectedCoach(e.target.value)}
            className={styles.select}
          >
            <option value="Mike Johnson">Mike Johnson</option>
            <option value="Sarah Wilson">Sarah Wilson</option>
            <option value="David Brown">David Brown</option>
          </select>
        </div>
      </div>

      <div className={styles.statsAndActions}>
        <div className={styles.stats}>
          <span className={styles.stat}>
            Total Students: <strong>{totalStudents}</strong>
          </span>
          <span className={styles.stat}>
            Present: <strong>{presentCount}</strong>
          </span>
          <span className={styles.stat}>
            Absent: <strong>{absentCount}</strong>
          </span>
        </div>

        <div className={styles.actions}>
          <button onClick={markAllPresent} className={styles.markAllBtn}>
            Mark All Present
          </button>
          <button onClick={saveAttendance} className={styles.saveBtn}>
            Save Attendance
          </button>
        </div>
      </div>

      <div className={styles.studentList}>
        <h2 className={styles.listTitle}>Student Attendance List</h2>

        <div className={styles.studentsGrid}>
          {students.map((student) => (
            <div key={student.id} className={styles.studentCard}>
              <div className={styles.studentInfo}>
                <div className={styles.avatar}>{student.avatar}</div>
                <div className={styles.studentDetails}>
                  <h3 className={styles.studentName}>{student.name}</h3>
                  <p className={styles.studentId}>Student ID: {student.id}</p>
                </div>
              </div>

              <div className={styles.attendanceSection}>
                <span className={styles.timeSlot}>{student.timeSlot}</span>
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={student.isPresent}
                    onChange={() => handleAttendanceChange(student.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxLabel}>
                    {student.isPresent ? "Present" : "Absent"}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
