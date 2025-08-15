import React, { useEffect, useState } from "react";
import styles from "./TurfBooking.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaEdit,
  FaTimes,
  FaDownload,
  FaPlus,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaCreditCard,
  FaSave,
} from "react-icons/fa";

const TurfBooking = ({ url }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("Today");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [turfFilter, setTurfFilter] = useState("All Turfs");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newBookingData, setNewBookingData] = useState({
    customerName: "",
    customerPhone: "",
    date: "",
    timeSlot: "",
    amount: "",
    status: "Pending",
    paymentStatus: "Pending",
    turf: "",
    duration: "1 hour",
  });
  const [updating, setUpdating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [availableTurfs, setAvailableTurfs] = useState([]);
  const [turfLoading, setTurfLoading] = useState(false);

  const timeSlots = [
    "07:00 - 08:00",
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
  ];

  useEffect(() => {
    fetchBookings();
    fetchAvailableTurfs();
  }, [dateRange]);

  const fetchAvailableTurfs = async () => {
    setTurfLoading(true);
    try {
      const token = localStorage.getItem("turfOwnerToken");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      console.log("Fetching turfs with token:", token.substring(0, 20) + "...");

      const res = await axios.get(`${url}/api/turfs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Turfs API Response:", res.data);

      // Handle different response structures
      let turfsData = [];
      if (Array.isArray(res.data)) {
        turfsData = res.data;
      } else if (res.data.turfs && Array.isArray(res.data.turfs)) {
        turfsData = res.data.turfs;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        turfsData = res.data.data;
      } else if (res.data.success && res.data.turfs) {
        turfsData = res.data.turfs;
      }

      console.log("Processed turfs data:", turfsData);

      setAvailableTurfs(turfsData);

      if (turfsData.length === 0) {
        toast.info("No turfs found. Please add turfs first.");
      }
    } catch (err) {
      console.error("Failed to fetch turfs:", err);
      console.error("Error response:", err.response?.data);

      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        toast.error("Access denied. You don't have permission to view turfs.");
      } else {
        toast.error("Failed to fetch turfs. Please try again.");
      }

      setAvailableTurfs([]);
    } finally {
      setTurfLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    let path = "";
    const today = new Date().toISOString().slice(0, 10);

    switch (dateRange) {
      case "Today":
        path = "/today";
        break;
      case "Yesterday":
        const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
        path = `/date/${y}`;
        break;
      case "This Week":
        const startW = new Date();
        startW.setDate(startW.getDate() - startW.getDay());
        const endW = new Date(startW);
        endW.setDate(endW.getDate() + 6);
        path = `/range?start=${startW.toISOString().slice(0, 10)}&end=${endW
          .toISOString()
          .slice(0, 10)}`;
        break;
      case "This Month":
        const d = new Date();
        const startM = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-01`;
        const endM = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(
          new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
        ).padStart(2, "0")}`;
        path = `/range?start=${startM}&end=${endM}`;
        break;
      default:
        path = "";
    }

    try {
      const res = await axios.get(`${url}/api/turfbookings${path}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
        },
      });
      setBookings(Array.isArray(res.data) ? res.data : res.data.bookings || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  // Rest of your existing functions remain the same...
  const handleViewBooking = async (id) => {
    try {
      const res = await axios.get(`${url}/api/turfbookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
        },
      });
      setSelectedBooking(res.data);
      setViewModalOpen(true);
    } catch (err) {
      toast.error("Failed to load booking details");
    }
  };

  const handleEditBooking = async (id) => {
    try {
      const res = await axios.get(`${url}/api/turfbookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
        },
      });
      setEditData(res.data);
      setEditModalOpen(true);
    } catch (err) {
      toast.error("Failed to load booking for edit");
    }
  };

  const handleNewBooking = () => {
    // Refresh turfs when opening new booking modal
    fetchAvailableTurfs();

    setNewBookingData({
      customerName: "",
      customerPhone: "",
      date: "",
      timeSlot: "",
      amount: "",
      status: "Pending",
      paymentStatus: "Pending",
      turf: "",
      duration: "1 hour",
    });
    setNewBookingModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;

    try {
      setUpdating(true);
      await axios.put(`${url}/api/turfbookings/${editData._id}`, editData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
        },
      });
      toast.success("Booking updated successfully");
      setEditModalOpen(false);
      setEditData(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking");
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!validateNewBooking()) return;

    try {
      setCreating(true);
      const response = await axios.post(
        `${url}/api/turfbookings`,
        newBookingData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Booking created successfully");
        setNewBookingModalOpen(false);
        setNewBookingData({
          customerName: "",
          customerPhone: "",
          date: "",
          timeSlot: "",
          amount: "",
          status: "Pending",
          paymentStatus: "Pending",
          turf: "",
          duration: "1 hour",
        });
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create booking");
    } finally {
      setCreating(false);
    }
  };

  const validateNewBooking = () => {
    if (!newBookingData.customerName.trim()) {
      toast.error("Customer name is required");
      return false;
    }
    if (!newBookingData.customerPhone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!newBookingData.date) {
      toast.error("Date is required");
      return false;
    }
    if (!newBookingData.timeSlot.trim()) {
      toast.error("Time slot is required");
      return false;
    }
    if (!newBookingData.turf) {
      toast.error("Please select a turf");
      return false;
    }
    if (!newBookingData.amount || newBookingData.amount <= 0) {
      toast.error("Valid amount is required");
      return false;
    }
    return true;
  };

  const handleCancelBooking = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      axios
        .delete(`${url}/api/turfbookings/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
          },
        })
        .then(() => {
          setBookings((prev) => prev.filter((b) => b._id !== id));
          toast.success("Booking cancelled successfully");
        })
        .catch((err) => {
          console.error("Cancel failed", err);
          toast.error("Failed to cancel booking");
        });
    }
  };

  const closeModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setNewBookingModalOpen(false);
    setSelectedBooking(null);
    setEditData(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModals();
    }
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewBookingChange = (field, value) => {
    setNewBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return styles.statusConfirmed;
      case "Pending":
        return styles.statusPending;
      case "Cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  // Filters
  const filtered = bookings.filter((b) => {
    const statusMatch =
      statusFilter === "All Status" || b.status === statusFilter;
    const turfName = b.turf?.name || "";
    const turfMatch =
      turfFilter === "All Turfs" || turfName.includes(turfFilter);
    return statusMatch && turfMatch;
  });

  // Compute stats
  const totalBookings = filtered.length;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = bookings.filter((b) => b.date === today).length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "Confirmed"
  ).length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Bookings Management</h1>
          <p className={styles.description}>
            View and manage all turf bookings organized by date and status
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>
            <FaDownload className={styles.btnIcon} /> Export
          </button>
          <button className={styles.newBookingBtn} onClick={handleNewBooking}>
            <FaPlus className={styles.btnIcon} /> New Booking
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{todayCount}</div>
            <div className={styles.statLabel}>Today's Bookings</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totalBookings}</div>
            <div className={styles.statLabel}>Total Bookings</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{confirmedCount}</div>
            <div className={styles.statLabel}>Confirmed</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statLabel}>Pending</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div className={styles.statLabel}>Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Date Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={styles.filterSelect}
          >
            {["Today", "Yesterday", "This Week", "This Month"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            {["All Status", "Confirmed", "Pending", "Cancelled"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Turf:</label>
          <select
            value={turfFilter}
            onChange={(e) => setTurfFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="All Turfs">All Turfs</option>
            {bookings
              .map((b) => b.turf?.name)
              .filter((v, i, a) => v && a.indexOf(v) === i)
              .map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Rest of your JSX remains the same until the New Booking Modal */}

      {/* Booking List */}
      <div className={styles.bookingsSection}>
        <h2 className={styles.sectionTitle}>All Bookings</h2>

        <div className={styles.bookingsList}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading bookings...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.noBookings}>
              <div className={styles.noBookingsIcon}>📅</div>
              <h3>No bookings found</h3>
              <p>No bookings found matching your filters.</p>
            </div>
          ) : (
            filtered.map((b) => (
              <div key={b._id} className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div className={styles.bookingId}>#{b._id.slice(-6)}</div>
                  <div
                    className={`${styles.bookingStatus} ${getStatusClass(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </div>
                </div>

                <div className={styles.bookingDetails}>
                  <div className={styles.customerInfo}>
                    <div className={styles.customerName}>{b.customerName}</div>
                    <div className={styles.customerPhone}>
                      {b.customerPhone}
                    </div>
                  </div>
                  <div className={styles.bookingInfo}>
                    <div className={styles.turfName}>{b.turf?.name}</div>
                    <div className={styles.dateTime}>
                      <FaCalendarAlt className={styles.icon} /> {b.date} •{" "}
                      {b.timeSlot}
                    </div>
                    <div className={styles.duration}>
                      <FaClock className={styles.icon} /> {b.duration}
                    </div>
                  </div>
                  <div className={styles.bookingMeta}>
                    <div className={styles.amount}>
                      ₹{b.amount.toLocaleString()}
                    </div>
                    <div className={styles.paymentStatus}>
                      {b.paymentStatus}
                    </div>
                    <div className={styles.bookingTime}>
                      {new Date(b.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className={styles.bookingActions}>
                  <button
                    onClick={() => handleViewBooking(b._id)}
                    className={styles.actionBtn}
                  >
                    <FaEye className={styles.actionIcon} /> View
                  </button>
                  <button
                    onClick={() => handleEditBooking(b._id)}
                    className={styles.actionBtn}
                  >
                    <FaEdit className={styles.actionIcon} /> Edit
                  </button>
                  {b.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancelBooking(b._id)}
                      className={`${styles.actionBtn} ${styles.cancelBtn}`}
                    >
                      <FaTimes className={styles.actionIcon} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Modal - Same as before */}
      {viewModalOpen && selectedBooking && (
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <FaEye className={styles.modalTitleIcon} />
                Booking Details
              </h2>
              <button onClick={closeModals} className={styles.modalCloseBtn}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailCard}>
                  <div className={styles.detailIcon}>
                    <FaUser />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Customer</div>
                    <div className={styles.detailValue}>
                      {selectedBooking.customerName}
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.detailIcon}>
                    <FaPhone />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Phone</div>
                    <div className={styles.detailValue}>
                      {selectedBooking.customerPhone}
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.detailIcon}>
                    <FaMapMarkerAlt />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Turf</div>
                    <div className={styles.detailValue}>
                      {selectedBooking.turf?.name}
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.detailIcon}>
                    <FaCalendarAlt />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Date</div>
                    <div className={styles.detailValue}>
                      {selectedBooking.date}
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.detailIcon}>
                    <FaClock />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Time Slot</div>
                    <div className={styles.detailValue}>
                      {selectedBooking.timeSlot}
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.detailIcon}>
                    <FaRupeeSign />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Amount</div>
                    <div className={styles.detailValue}>
                      ₹{selectedBooking.amount}
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.detailIcon}>
                    <FaCreditCard />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Payment Status</div>
                    <div className={styles.detailValue}>
                      {selectedBooking.paymentStatus}
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.detailIcon}>
                    <div
                      className={`${styles.statusDot} ${getStatusClass(
                        selectedBooking.status
                      )}`}
                    ></div>
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Status</div>
                    <div className={styles.detailValue}>
                      {selectedBooking.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={closeModals} className={styles.closeModalBtn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Same as before */}
      {editModalOpen && editData && (
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <FaEdit className={styles.modalTitleIcon} />
                Edit Booking
              </h2>
              <button onClick={closeModals} className={styles.modalCloseBtn}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.editForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Customer Name</label>
                    <input
                      type="text"
                      value={editData.customerName}
                      onChange={(e) =>
                        handleEditChange("customerName", e.target.value)
                      }
                      className={styles.formInput}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number</label>
                    <input
                      type="tel"
                      value={editData.customerPhone}
                      onChange={(e) =>
                        handleEditChange("customerPhone", e.target.value)
                      }
                      className={styles.formInput}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Booking Date</label>
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) => handleEditChange("date", e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Time Slot</label>
                    <input
                      type="text"
                      value={editData.timeSlot}
                      onChange={(e) =>
                        handleEditChange("timeSlot", e.target.value)
                      }
                      className={styles.formInput}
                      placeholder="e.g., 10:00 - 11:00"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Status</label>
                    <select
                      value={editData.status}
                      onChange={(e) =>
                        handleEditChange("status", e.target.value)
                      }
                      className={styles.formSelect}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Amount (₹)</label>
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) =>
                        handleEditChange("amount", parseFloat(e.target.value))
                      }
                      className={styles.formInput}
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Payment Status</label>
                  <select
                    value={editData.paymentStatus}
                    onChange={(e) =>
                      handleEditChange("paymentStatus", e.target.value)
                    }
                    className={styles.formSelect}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={closeModals}
                className={styles.cancelModalBtn}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className={styles.saveModalBtn}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <span className={styles.spinner}></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {newBookingModalOpen && (
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <FaPlus className={styles.modalTitleIcon} />
                Create New Booking
              </h2>
              <button onClick={closeModals} className={styles.modalCloseBtn}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.editForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Customer Name <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={newBookingData.customerName}
                      onChange={(e) =>
                        handleNewBookingChange("customerName", e.target.value)
                      }
                      className={styles.formInput}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Phone Number <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      value={newBookingData.customerPhone}
                      onChange={(e) =>
                        handleNewBookingChange("customerPhone", e.target.value)
                      }
                      className={styles.formInput}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Select Turf <span className={styles.required}>*</span>
                      {turfLoading && (
                        <span className={styles.loadingText}>
                          {" "}
                          (Loading...)
                        </span>
                      )}
                    </label>
                    <select
                      value={newBookingData.turf}
                      onChange={(e) =>
                        handleNewBookingChange("turf", e.target.value)
                      }
                      className={styles.formSelect}
                      disabled={turfLoading}
                    >
                      <option value="">
                        {turfLoading
                          ? "Loading turfs..."
                          : availableTurfs.length === 0
                          ? "No turfs available"
                          : "Select a turf"}
                      </option>
                      {availableTurfs.map((turf) => (
                        <option key={turf._id} value={turf._id}>
                          {turf.name} - ₹{turf.pricePerHour}/hr
                        </option>
                      ))}
                    </select>
                    {availableTurfs.length === 0 && !turfLoading && (
                      <div className={styles.noTurfsMessage}>
                        <span>
                          No turfs found. Please add turfs first from the Turf
                          Listing page.
                        </span>
                        <button
                          type="button"
                          onClick={fetchAvailableTurfs}
                          className={styles.refreshTurfsBtn}
                        >
                          Refresh Turfs
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Duration</label>
                    <select
                      value={newBookingData.duration}
                      onChange={(e) =>
                        handleNewBookingChange("duration", e.target.value)
                      }
                      className={styles.formSelect}
                    >
                      <option value="1 hour">1 hour</option>
                      <option value="2 hours">2 hours</option>
                      <option value="3 hours">3 hours</option>
                      <option value="Half day">Half day</option>
                      <option value="Full day">Full day</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Booking Date <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="date"
                      value={newBookingData.date}
                      onChange={(e) =>
                        handleNewBookingChange("date", e.target.value)
                      }
                      className={styles.formInput}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  {/* UPDATED: Time Slot Dropdown */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaClock className={styles.labelIcon} />
                      Time Slot <span className={styles.required}>*</span>
                    </label>
                    <select
                      value={newBookingData.timeSlot}
                      onChange={(e) =>
                        handleNewBookingChange("timeSlot", e.target.value)
                      }
                      className={styles.formSelect}
                    >
                      <option value="">Select time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Status</label>
                    <select
                      value={newBookingData.status}
                      onChange={(e) =>
                        handleNewBookingChange("status", e.target.value)
                      }
                      className={styles.formSelect}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Amount (₹) <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      value={newBookingData.amount}
                      onChange={(e) =>
                        handleNewBookingChange(
                          "amount",
                          parseFloat(e.target.value) || ""
                        )
                      }
                      className={styles.formInput}
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Payment Status</label>
                  <select
                    value={newBookingData.paymentStatus}
                    onChange={(e) =>
                      handleNewBookingChange("paymentStatus", e.target.value)
                    }
                    className={styles.formSelect}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={closeModals}
                className={styles.cancelModalBtn}
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBooking}
                className={styles.saveModalBtn}
                disabled={creating || availableTurfs.length === 0}
              >
                {creating ? (
                  <>
                    <span className={styles.spinner}></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className={styles.btnIcon} />
                    Create Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurfBooking;
