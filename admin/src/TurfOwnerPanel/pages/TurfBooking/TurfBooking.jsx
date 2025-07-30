import React, { useState } from "react";
import styles from "./TurfBooking.module.css";
import {
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaEdit,
  FaTimes,
  FaDownload,
  FaPlus,
} from "react-icons/fa";

const TurfBooking = () => {
  const [dateRange, setDateRange] = useState("Today");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [turfFilter, setTurfFilter] = useState("All Turfs");

  // Mock booking data
  const [bookings] = useState([
    {
      id: "BK001",
      customerName: "John Smith",
      customerPhone: "+91 98765 43210",
      turfName: "Premier Football Turf",
      date: "2025-01-30",
      timeSlot: "6:00 PM - 8:00 PM",
      duration: "2 hours",
      status: "Confirmed",
      amount: 2400,
      bookingTime: "2 hours ago",
      paymentStatus: "Paid",
    },
    {
      id: "BK002",
      customerName: "Sarah Johnson",
      customerPhone: "+91 87654 32109",
      turfName: "Elite Cricket Ground",
      date: "2025-01-30",
      timeSlot: "10:00 AM - 11:30 AM",
      duration: "1.5 hours",
      status: "Pending",
      amount: 3000,
      bookingTime: "30 minutes ago",
      paymentStatus: "Pending",
    },
    {
      id: "BK003",
      customerName: "Mike Davis",
      customerPhone: "+91 76543 21098",
      turfName: "City Multi-sports Arena",
      date: "2025-01-30",
      timeSlot: "2:00 PM - 5:00 PM",
      duration: "3 hours",
      status: "Confirmed",
      amount: 4500,
      bookingTime: "1 hour ago",
      paymentStatus: "Paid",
    },
    {
      id: "BK004",
      customerName: "Emma Wilson",
      customerPhone: "+91 65432 10987",
      turfName: "Premier Football Turf",
      date: "2025-01-29",
      timeSlot: "4:00 PM - 6:00 PM",
      duration: "2 hours",
      status: "Cancelled",
      amount: 2400,
      bookingTime: "1 day ago",
      paymentStatus: "Refunded",
    },
  ]);

  // Statistics
  const totalBookings = bookings.length;
  const todayBookings = bookings.filter((b) => b.date === "2025-01-30").length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === "Confirmed"
  ).length;
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + b.amount, 0);

  const handleViewBooking = (bookingId) => {
    console.log("View booking:", bookingId);
    alert(`Opening booking details for ${bookingId}`);
  };

  const handleEditBooking = (bookingId) => {
    console.log("Edit booking:", bookingId);
    alert(`Opening edit form for ${bookingId}`);
  };

  const handleCancelBooking = (bookingId) => {
    console.log("Cancel booking:", bookingId);
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      alert(`Booking ${bookingId} cancelled`);
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

  const filteredBookings = bookings.filter((booking) => {
    const statusMatch =
      statusFilter === "All Status" || booking.status === statusFilter;
    const turfMatch =
      turfFilter === "All Turfs" || booking.turfName.includes(turfFilter);
    return statusMatch && turfMatch;
  });

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
            <FaDownload className={styles.btnIcon} />
            Export
          </button>
          <button className={styles.newBookingBtn}>
            <FaPlus className={styles.btnIcon} />
            New Booking
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{todayBookings}</div>
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
            <div className={styles.statValue}>{confirmedBookings}</div>
            <div className={styles.statLabel}>Confirmed</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{pendingBookings}</div>
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
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="All Status">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
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
            <option value="Premier Football">Premier Football Turf</option>
            <option value="Elite Cricket">Elite Cricket Ground</option>
            <option value="Multi-sports">City Multi-sports Arena</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className={styles.bookingsSection}>
        <h2 className={styles.sectionTitle}>All Bookings</h2>

        <div className={styles.bookingsList}>
          {filteredBookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div className={styles.bookingId}>#{booking.id}</div>
                <div
                  className={`${styles.bookingStatus} ${getStatusClass(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </div>
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.customerInfo}>
                  <div className={styles.customerName}>
                    {booking.customerName}
                  </div>
                  <div className={styles.customerPhone}>
                    {booking.customerPhone}
                  </div>
                </div>

                <div className={styles.bookingInfo}>
                  <div className={styles.turfName}>{booking.turfName}</div>
                  <div className={styles.dateTime}>
                    <FaCalendarAlt className={styles.icon} />
                    {booking.date} • {booking.timeSlot}
                  </div>
                  <div className={styles.duration}>
                    <FaClock className={styles.icon} />
                    {booking.duration}
                  </div>
                </div>

                <div className={styles.bookingMeta}>
                  <div className={styles.amount}>
                    ₹{booking.amount.toLocaleString()}
                  </div>
                  <div className={styles.paymentStatus}>
                    {booking.paymentStatus}
                  </div>
                  <div className={styles.bookingTime}>
                    {booking.bookingTime}
                  </div>
                </div>
              </div>

              <div className={styles.bookingActions}>
                <button
                  onClick={() => handleViewBooking(booking.id)}
                  className={styles.actionBtn}
                >
                  <FaEye className={styles.actionIcon} />
                  View
                </button>
                <button
                  onClick={() => handleEditBooking(booking.id)}
                  className={styles.actionBtn}
                >
                  <FaEdit className={styles.actionIcon} />
                  Edit
                </button>
                {booking.status !== "Cancelled" && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className={`${styles.actionBtn} ${styles.cancelBtn}`}
                  >
                    <FaTimes className={styles.actionIcon} />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className={styles.noBookings}>
            <p>No bookings found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TurfBooking;
