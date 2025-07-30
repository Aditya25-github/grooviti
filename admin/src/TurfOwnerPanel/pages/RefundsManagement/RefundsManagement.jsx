import React, { useState } from "react";
import styles from "./RefundsManagement.module.css";
import {
  FaPlus,
  FaEye,
  FaTimes,
  FaDownload,
  FaCheck,
  FaMoneyBillWave,
  FaClock,
  FaInfoCircle,
  FaCalendarAlt,
} from "react-icons/fa";

const RefundsManagement = () => {
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundFormData, setRefundFormData] = useState({
    bookingId: "",
    customerName: "",
    bookingDate: "",
    refundAmount: "",
    reason: "",
    comments: "",
  });

  // Mock refund data
  const [refunds] = useState([
    {
      id: "BK001234",
      customerName: "John Doe",
      amount: 2500,
      status: "Pending",
      requestDate: "2025-01-29",
      bookingDate: "2025-02-05",
      reason: "Personal Emergency",
      processingTime: "2 days ago",
    },
    {
      id: "BK001235",
      customerName: "Sarah Wilson",
      amount: 1800,
      status: "Approved",
      requestDate: "2025-01-28",
      bookingDate: "2025-02-02",
      reason: "Weather Conditions",
      processingTime: "3 days ago",
    },
    {
      id: "BK001236",
      customerName: "Mike Johnson",
      amount: 3200,
      status: "Rejected",
      requestDate: "2025-01-27",
      bookingDate: "2025-01-28",
      reason: "Late Cancellation",
      processingTime: "4 days ago",
    },
    {
      id: "BK001237",
      customerName: "Emma Davis",
      amount: 2200,
      status: "Approved",
      requestDate: "2025-01-26",
      bookingDate: "2025-01-30",
      reason: "Medical Emergency",
      processingTime: "5 days ago",
    },
    {
      id: "BK001238",
      customerName: "Alex Thompson",
      amount: 1500,
      status: "Pending",
      requestDate: "2025-01-25",
      bookingDate: "2025-02-01",
      reason: "Schedule Conflict",
      processingTime: "6 days ago",
    },
  ]);

  // Statistics
  const totalRequests = refunds.length;
  const pendingApproval = refunds.filter((r) => r.status === "Pending").length;
  const approved = refunds.filter((r) => r.status === "Approved").length;
  const rejected = refunds.filter((r) => r.status === "Rejected").length;
  const totalAmount = refunds.reduce((sum, r) => sum + r.amount, 0);

  const handleInputChange = (field, value) => {
    setRefundFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitRefund = (e) => {
    e.preventDefault();
    console.log("Submitting refund request:", refundFormData);
    alert("Refund request submitted successfully!");
    setRefundFormData({
      bookingId: "",
      customerName: "",
      bookingDate: "",
      refundAmount: "",
      reason: "",
      comments: "",
    });
    setShowRefundForm(false);
  };

  const handleCancelForm = () => {
    setRefundFormData({
      bookingId: "",
      customerName: "",
      bookingDate: "",
      refundAmount: "",
      reason: "",
      comments: "",
    });
    setShowRefundForm(false);
  };

  const handleViewDetails = (refundId) => {
    console.log("View refund details:", refundId);
    alert(`Opening details for refund ${refundId}`);
  };

  const handleGenerateRefund = (refundId) => {
    console.log("Generate refund:", refundId);
    alert(`Processing refund for ${refundId}`);
  };

  const handleCancelRefund = (refundId) => {
    console.log("Cancel refund:", refundId);
    if (
      window.confirm("Are you sure you want to cancel this refund request?")
    ) {
      alert(`Refund ${refundId} cancelled`);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return styles.statusApproved;
      case "Pending":
        return styles.statusPending;
      case "Rejected":
        return styles.statusRejected;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <FaCheck />;
      case "Pending":
        return <FaClock />;
      case "Rejected":
        return <FaTimes />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Refunds Management</h1>
          <p className={styles.description}>
            Manage turf booking cancellations and refund requests
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={() => setShowRefundForm(true)}
            className={styles.newRefundBtn}
          >
            <FaPlus className={styles.btnIcon} />
            New Refund Request
          </button>
        </div>
      </div>

      {/* Refund Request Guidelines */}
      <div className={styles.guidelinesSection}>
        <div className={styles.guidelinesHeader}>
          <FaInfoCircle className={styles.guidelinesIcon} />
          <h2 className={styles.guidelinesTitle}>Refund Request Guidelines</h2>
        </div>
        <ul className={styles.guidelinesList}>
          <li>
            Refund requests must be submitted at least 24 hours before the
            booking time
          </li>
          <li>
            Turf owner will be automatically notified of your refund request
          </li>
          <li>Processing time: 3-5 business days after approval</li>
        </ul>
      </div>

      {/* Refund Form Modal */}
      {showRefundForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Submit Refund Request</h3>
              <button onClick={handleCancelForm} className={styles.closeBtn}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmitRefund} className={styles.refundForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Booking ID</label>
                  <input
                    type="text"
                    placeholder="Enter booking ID"
                    value={refundFormData.bookingId}
                    onChange={(e) =>
                      handleInputChange("bookingId", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Customer Name</label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={refundFormData.customerName}
                    onChange={(e) =>
                      handleInputChange("customerName", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Booking Date</label>
                  <div className={styles.dateInputWrapper}>
                    <input
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={refundFormData.bookingDate}
                      onChange={(e) =>
                        handleInputChange("bookingDate", e.target.value)
                      }
                      className={styles.input}
                      required
                    />
                    <FaCalendarAlt className={styles.dateIcon} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Refund Amount</label>
                  <input
                    type="number"
                    placeholder="₹0.00"
                    value={refundFormData.refundAmount}
                    onChange={(e) =>
                      handleInputChange("refundAmount", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Reason for Refund</label>
                <select
                  value={refundFormData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="">Select reason</option>
                  <option value="Personal Emergency">Personal Emergency</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Weather Conditions">Weather Conditions</option>
                  <option value="Schedule Conflict">Schedule Conflict</option>
                  <option value="Facility Issues">Facility Issues</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Additional Comments</label>
                <textarea
                  placeholder="Provide additional details about the refund request..."
                  value={refundFormData.comments}
                  onChange={(e) =>
                    handleInputChange("comments", e.target.value)
                  }
                  className={styles.textarea}
                  rows="4"
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>
                  Submit Refund Request
                </button>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Recent Refund Requests */}
        <div className={styles.refundsSection}>
          <h2 className={styles.sectionTitle}>Recent Refund Requests</h2>

          <div className={styles.refundsList}>
            {refunds.map((refund) => (
              <div key={refund.id} className={styles.refundCard}>
                <div className={styles.refundHeader}>
                  <div className={styles.refundId}>#{refund.id}</div>
                  <div
                    className={`${styles.refundStatus} ${getStatusClass(
                      refund.status
                    )}`}
                  >
                    {getStatusIcon(refund.status)}
                    {refund.status}
                  </div>
                </div>

                <div className={styles.refundDetails}>
                  <div className={styles.customerInfo}>
                    <div className={styles.customerName}>
                      {refund.customerName}
                    </div>
                    <div className={styles.refundAmount}>
                      ₹{refund.amount.toLocaleString()}
                    </div>
                  </div>

                  <div className={styles.refundMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Request Date:</span>
                      <span>{refund.requestDate}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Booking Date:</span>
                      <span>{refund.bookingDate}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Reason:</span>
                      <span>{refund.reason}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Processing:</span>
                      <span>{refund.processingTime}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.refundActions}>
                  <button
                    onClick={() => handleViewDetails(refund.id)}
                    className={styles.actionBtn}
                  >
                    <FaEye className={styles.actionIcon} />
                    View Details
                  </button>
                  {refund.status === "Approved" && (
                    <button
                      onClick={() => handleGenerateRefund(refund.id)}
                      className={styles.generateBtn}
                    >
                      <FaMoneyBillWave className={styles.actionIcon} />
                      Generate Refund
                    </button>
                  )}
                  {refund.status === "Pending" && (
                    <button
                      onClick={() => handleCancelRefund(refund.id)}
                      className={styles.cancelRefundBtn}
                    >
                      <FaTimes className={styles.actionIcon} />
                      Cancel Refund
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Status Overview */}
        <div className={styles.overviewSection}>
          <h2 className={styles.sectionTitle}>Refund Status Overview</h2>

          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{totalRequests}</div>
              <div className={styles.statLabel}>Total Requests</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>{pendingApproval}</div>
              <div className={styles.statLabel}>Pending Approval</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>{approved}</div>
              <div className={styles.statLabel}>Approved</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>{rejected}</div>
              <div className={styles.statLabel}>Rejected</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>
                ₹{totalAmount.toLocaleString()}
              </div>
              <div className={styles.statLabel}>Total Amount</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.quickTitle}>Quick Actions</h3>
        <div className={styles.quickButtons}>
          <button className={styles.quickBtn}>
            <FaMoneyBillWave className={styles.quickIcon} />
            Generate Refund
          </button>
          <button className={styles.quickBtn}>
            <FaTimes className={styles.quickIcon} />
            Cancel Refund
          </button>
          <button className={styles.quickBtn}>
            <FaEye className={styles.quickIcon} />
            View Details
          </button>
          <button className={styles.quickBtn}>
            <FaDownload className={styles.quickIcon} />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundsManagement;
