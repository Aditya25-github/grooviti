import React, { useState } from "react";
import styles from "./FeeCollection.module.css";

const FeeCollection = () => {
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedMonth, setSelectedMonth] = useState("January 2025");

  const [students, setStudents] = useState([
    {
      id: "ST001",
      name: "Alex Johnson",
      avatar: "👨‍🎓",
      training: "Football Training",
      amount: 2000,
      status: "Paid",
      paymentDate: "Jan 15, 2025",
    },
    {
      id: "ST002",
      name: "Emma Davis",
      avatar: "👩‍🎓",
      training: "Basketball Training",
      amount: 2500,
      status: "Overdue",
      paymentDate: null,
    },
    {
      id: "ST003",
      name: "Michael Smith",
      avatar: "👨‍🎓",
      training: "Cricket Training",
      amount: 1800,
      status: "Paid",
      paymentDate: "Jan 20, 2025",
    },
    {
      id: "ST004",
      name: "Sophie Wilson",
      avatar: "👩‍🎓",
      training: "Football Training",
      amount: 2000,
      status: "Pending",
      paymentDate: null,
    },
    {
      id: "ST005",
      name: "David Brown",
      avatar: "👨‍🎓",
      training: "Basketball Training",
      amount: 2500,
      status: "Paid",
      paymentDate: "Jan 18, 2025",
    },
  ]);

  const totalRevenue = students
    .filter((student) => student.status === "Paid")
    .reduce((sum, student) => sum + student.amount, 0);

  const paidStudents = students.filter(
    (student) => student.status === "Paid"
  ).length;
  const pendingCount = students.filter(
    (student) => student.status === "Pending" || student.status === "Overdue"
  ).length;

  const handleSendReminder = (studentId) => {
    console.log("Sending reminder to student:", studentId);
    alert("Reminder sent successfully!");
  };

  const generateInvoice = () => {
    console.log("Generating invoice...");
    alert("Invoice generated successfully!");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return styles.statusPaid;
      case "Overdue":
        return styles.statusOverdue;
      case "Pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  const filteredStudents = students.filter((student) => {
    const batchMatch =
      selectedBatch === "All Batches" ||
      student.training.includes(selectedBatch);
    const statusMatch =
      selectedStatus === "All Status" || student.status === selectedStatus;
    return batchMatch && statusMatch;
  });

  return (
    <div className={styles.feeContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Fee Collection</h1>
        <p className={styles.description}>
          Manage student fees and track payment status.
        </p>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>₹</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Revenue</div>
            <div className={styles.statValue}>
              ₹{totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✓</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Paid Students</div>
            <div className={styles.statValue}>{paidStudents}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚠</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending</div>
            <div className={styles.statValue}>{pendingCount}</div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.label}>Select Batch</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className={styles.select}
          >
            <option value="All Batches">All Batches</option>
            <option value="Football">Football Training</option>
            <option value="Basketball">Basketball Training</option>
            <option value="Cricket">Cricket Training</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Payment Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.select}
          >
            <option value="All Status">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className={styles.select}
          >
            <option value="January 2025">January 2025</option>
            <option value="February 2025">February 2025</option>
            <option value="March 2025">March 2025</option>
            <option value="December 2024">December 2024</option>
          </select>
        </div>

        <button onClick={generateInvoice} className={styles.generateBtn}>
          Generate Invoice
        </button>
      </div>

      <div className={styles.studentSection}>
        <h2 className={styles.sectionTitle}>Student Payment List</h2>

        <div className={styles.studentList}>
          {filteredStudents.map((student) => (
            <div key={student.id} className={styles.studentCard}>
              <div className={styles.studentInfo}>
                <div className={styles.avatar}>{student.avatar}</div>
                <div className={styles.studentDetails}>
                  <h3 className={styles.studentName}>{student.name}</h3>
                  <p className={styles.studentMeta}>
                    Student ID: {student.id} • {student.training}
                  </p>
                </div>
              </div>

              <div className={styles.paymentInfo}>
                <div className={styles.amount}>
                  ₹{student.amount.toLocaleString()}
                </div>
                <div
                  className={`${styles.status} ${getStatusClass(
                    student.status
                  )}`}
                >
                  {student.status}
                </div>
                {student.status === "Overdue" ? (
                  <button
                    onClick={() => handleSendReminder(student.id)}
                    className={styles.reminderBtn}
                  >
                    Send Reminder
                  </button>
                ) : student.paymentDate ? (
                  <div className={styles.paymentDate}>
                    {student.paymentDate}
                  </div>
                ) : (
                  <div className={styles.paymentDate}>-</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeeCollection;
