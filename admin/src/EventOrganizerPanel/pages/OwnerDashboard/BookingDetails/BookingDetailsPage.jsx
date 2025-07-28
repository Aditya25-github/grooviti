import React, { useEffect, useState } from "react";
import styles from "./BookingDetailsPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BookingDetailsPage = ({ url, token }) => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(res.data.booking);
      } catch (error) {
        toast.error("Failed to fetch booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, url, token]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.container}>
        <p>Booking not found.</p>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Booking Details</h1>

      <div className={styles.detailGroup}>
        <strong>Turf Name:</strong> {booking.turf?.name || "N/A"}
      </div>

      <div className={styles.detailGroup}>
        <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
      </div>

      <div className={styles.detailGroup}>
        <strong>Time Slot:</strong> {booking.timeSlot}
      </div>

      <div className={styles.detailGroup}>
        <strong>Booked By:</strong> {booking.user?.name || "N/A"}
      </div>

      <div className={styles.detailGroup}>
        <strong>Status:</strong>{" "}
        <span className={styles.status}>{booking.status}</span>
      </div>

      <div className={styles.detailGroup}>
        <strong>Amount Paid:</strong> ₹{booking.amountPaid}
      </div>

      <div className={styles.detailGroup}>
        <strong>Contact:</strong> {booking.user?.email || "N/A"}
      </div>

      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        Back to Bookings
      </button>
    </div>
  );
};

export default BookingDetailsPage;
