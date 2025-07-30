import React, { useEffect, useState } from "react";
import styles from "./TurfBooking.module.css";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaEdit,
  FaTimes,
  FaDownload,
  FaPlus,
} from "react-icons/fa";

const TurfBooking = ({ url }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("Today");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [turfFilter, setTurfFilter] = useState("All Turfs");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${url}/api/turfbookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Failed fetching bookings:", err);
      // Optionally toast error
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (id) => alert(`View booking ${id}`);
  const handleEditBooking = (id) => alert(`Edit booking ${id}`);
  const handleCancelBooking = (id) => {
    if (window.confirm("Cancel this booking?")) {
      axios
        .delete(`${url}/api/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
          },
        })
        .then(() => {
          setBookings((prev) => prev.filter((b) => b._id !== id));
        })
        .catch((err) => console.error("Cancel failed", err));
    }
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
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
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
          <button className={styles.newBookingBtn}>
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

      {/* Booking List */}
      <div className={styles.bookingsSection}>
        <h2 className={styles.sectionTitle}>All Bookings</h2>

        <div className={styles.bookingsList}>
          {loading ? (
            <p>Loading bookings...</p>
          ) : filtered.length === 0 ? (
            <div className={styles.noBookings}>
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
    </div>
  );
};

export default TurfBooking;
