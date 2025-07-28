import React, { useState } from "react";
import styles from "./PaymentTracking.module.css";

const PaymentTracking = () => {
  const [selectedMonth, setSelectedMonth] = useState("January 2025");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("All Methods");

  const [monthlyData] = useState([
    { month: "Sep", amount: 45000, students: 18 },
    { month: "Oct", amount: 52000, students: 21 },
    { month: "Nov", amount: 48000, students: 19 },
    { month: "Dec", amount: 55000, students: 22 },
    { month: "Jan", amount: 62000, students: 25 },
  ]);

  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: "PAY001",
      studentId: "ST001",
      studentName: "Alex Johnson",
      avatar: "👨‍🎓",
      amount: 2000,
      paymentMethod: "Online",
      paymentDate: "Jan 25, 2025",
      transactionId: "TXN789012345",
      status: "Completed",
      feeType: "Monthly Fee",
    },
    {
      id: "PAY002",
      studentId: "ST002",
      studentName: "Emma Davis",
      avatar: "👩‍🎓",
      amount: 2500,
      paymentMethod: "Cash",
      paymentDate: "Jan 24, 2025",
      transactionId: "CASH240125",
      status: "Completed",
      feeType: "Monthly Fee",
    },
    {
      id: "PAY003",
      studentId: "ST003",
      studentName: "Michael Smith",
      avatar: "👨‍🎓",
      amount: 1800,
      paymentMethod: "Card",
      paymentDate: "Jan 23, 2025",
      transactionId: "CARD456789",
      status: "Completed",
      feeType: "Monthly Fee",
    },
    {
      id: "PAY004",
      studentId: "ST004",
      studentName: "Sophie Wilson",
      avatar: "👩‍🎓",
      amount: 500,
      paymentMethod: "Online",
      paymentDate: "Jan 22, 2025",
      transactionId: "TXN567890123",
      status: "Failed",
      feeType: "Registration Fee",
    },
    {
      id: "PAY005",
      studentId: "ST005",
      studentName: "David Brown",
      avatar: "👨‍🎓",
      amount: 2500,
      paymentMethod: "Online",
      paymentDate: "Jan 21, 2025",
      transactionId: "TXN345678901",
      status: "Completed",
      feeType: "Monthly Fee",
    },
  ]);

  const currentMonthRevenue = monthlyData[monthlyData.length - 1]?.amount || 0;
  const previousMonthRevenue = monthlyData[monthlyData.length - 2]?.amount || 0;
  const revenueGrowth = previousMonthRevenue
    ? (
        ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
        100
      ).toFixed(1)
    : 0;

  const totalTransactions = paymentHistory.length;
  const successfulPayments = paymentHistory.filter(
    (payment) => payment.status === "Completed"
  ).length;
  const successRate = ((successfulPayments / totalTransactions) * 100).toFixed(
    1
  );

  const paymentMethodStats = paymentHistory.reduce((acc, payment) => {
    if (payment.status === "Completed") {
      acc[payment.paymentMethod] =
        (acc[payment.paymentMethod] || 0) + payment.amount;
    }
    return acc;
  }, {});

  const maxAmount = Math.max(...monthlyData.map((data) => data.amount));

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return styles.statusCompleted;
      case "Failed":
        return styles.statusFailed;
      case "Pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  const exportData = () => {
    console.log("Exporting payment data...");
    alert("Payment data exported successfully!");
  };

  const filteredPayments = paymentHistory.filter((payment) => {
    const methodMatch =
      selectedPaymentMethod === "All Methods" ||
      payment.paymentMethod === selectedPaymentMethod;
    return methodMatch;
  });

  return (
    <div className={styles.trackingContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Payment Tracking</h1>
        <p className={styles.description}>
          Track and analyze student payment history and revenue trends.
        </p>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>₹</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>This Month Revenue</div>
            <div className={styles.statValue}>
              ₹{currentMonthRevenue.toLocaleString()}
            </div>
            <div className={styles.growth}>
              {revenueGrowth > 0 ? "+" : ""}
              {revenueGrowth}% from last month
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Success Rate</div>
            <div className={styles.statValue}>{successRate}%</div>
            <div className={styles.growth}>
              {successfulPayments} of {totalTransactions} transactions
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💳</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Top Payment Method</div>
            <div className={styles.statValue}>
              {Object.keys(paymentMethodStats).reduce(
                (a, b) =>
                  paymentMethodStats[a] > paymentMethodStats[b] ? a : b,
                "Online"
              )}
            </div>
            <div className={styles.growth}>
              ₹{Math.max(...Object.values(paymentMethodStats)).toLocaleString()}{" "}
              collected
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartSection}>
        <h2 className={styles.chartTitle}>Monthly Revenue Trend</h2>
        <div className={styles.chart}>
          {monthlyData.map((data, index) => (
            <div key={index} className={styles.chartBar}>
              <div
                className={styles.bar}
                style={{ height: `${(data.amount / maxAmount) * 100}%` }}
              >
                <div className={styles.barValue}>
                  ₹{(data.amount / 1000).toFixed(0)}k
                </div>
              </div>
              <div className={styles.barLabel}>{data.month}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.label}>Select Month</label>
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

        <div className={styles.controlGroup}>
          <label className={styles.label}>Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className={styles.select}
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Payment Method</label>
          <select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className={styles.select}
          >
            <option value="All Methods">All Methods</option>
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <button onClick={exportData} className={styles.exportBtn}>
          Export Data
        </button>
      </div>

      <div className={styles.paymentSection}>
        <h2 className={styles.sectionTitle}>Recent Payment History</h2>

        <div className={styles.paymentList}>
          {filteredPayments.map((payment) => (
            <div key={payment.id} className={styles.paymentCard}>
              <div className={styles.paymentMain}>
                <div className={styles.studentInfo}>
                  <div className={styles.avatar}>{payment.avatar}</div>
                  <div className={styles.studentDetails}>
                    <h3 className={styles.studentName}>
                      {payment.studentName}
                    </h3>
                    <p className={styles.studentMeta}>
                      Student ID: {payment.studentId} • {payment.feeType}
                    </p>
                  </div>
                </div>

                <div className={styles.paymentDetails}>
                  <div className={styles.amount}>
                    ₹{payment.amount.toLocaleString()}
                  </div>
                  <div
                    className={`${styles.status} ${getStatusClass(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </div>
                </div>
              </div>

              <div className={styles.paymentMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Payment Method:</span>
                  <span className={styles.metaValue}>
                    {payment.paymentMethod}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Date:</span>
                  <span className={styles.metaValue}>
                    {payment.paymentDate}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Transaction ID:</span>
                  <span className={styles.metaValue}>
                    {payment.transactionId}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentTracking;
