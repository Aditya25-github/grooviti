import React, { useState, useContext, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./BookVenue.module.css";
import { StoreContext } from "../../context/StoreContext";
// Import FontAwesome or use SVGs for your icons

// For FontAwesome icons
import { FaCalendarAlt, FaClock, FaDollarSign, FaUser, FaPhone, FaBuilding, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

export default function BookVenue() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  const turfId = params.get("turfId");
  const slotId = params.get("slotId");
  const date = params.get("date");
  const sport = params.get("sport");

  // Optionally: fetch venue details by turfId 
  const [venue, setVenue] = useState(null);
  useEffect(() => {
    if (!turfId) return;
    axios.get(`${url}/api/turfs/${turfId}`).then((res) => {
      setVenue(res.data.turf || res.data);
    });
  }, [turfId, url]);

  // Optionally: fetch slot details by slotId (to get start/end for display)
  const [slot, setSlot] = useState(null);
  useEffect(() => {
    if (!slotId) return;
    axios.get(`${url}/api/slots/${slotId}`).then((res) => {
      setSlot(res.data.slot || res.data);
    });
  }, [slotId, url]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  if (!turfId || !slotId || !date || !sport) {
    return (
      <div className={styles.bookingBg}>
        <div className={styles.bookingBox}>
          <div className={styles.body}>
            <h2 style={{ color: "#2d4a7c", marginBottom: 12 }}>Missing details</h2>
            <p>Please go back and select all booking details.</p>
          </div>
        </div>
      </div>
    );
  }

  // Format time if available
  const formatTime = (iso) => {
    const d = new Date(iso);
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12; if (!h) h = 12;
    return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const handleConfirm = async () => {
    if (!customerName.trim() || !phone.trim()) {
      setErr("Please enter your full name and phone.");
      return;
    }
    setErr("");
    setSubmitting(true);
    try {
      const res = await axios.post(`${url}/api/slots/${slotId}/book`, {
        customerName,
        phone,
        source: "web",
      });
      if (res.data?.success) {
        alert("Booking confirmed!");
        // navigate(`/confirmation?slotId=${slotId}`);
        navigate(`/venues/${turfId}`);
      } else {
        setErr(res.data?.message || "Booking failed");
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.bookingBg}>
      <div className={styles.bookingBox}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerIcon}><FaBuilding /></span>
          <div className={styles.headerTitle}>Booking Confirmation</div>
          <div className={styles.headerDesc}>Complete your venue reservation</div>
        </div>

        <div className={styles.body}>
          {/* Venue Details Section */}
          <div className={styles.sectionTitle}> <FaBuilding style={{marginRight:6}}/> Venue Details</div>
          <div className={styles.flexRow}>
            <div className={styles.venueCard}>
              {venue?.image && <img src={venue.image} alt={venue?.name} className={styles.venueImg} />}
              <div className={styles.venueInfoBlock}>
                <div className={styles.venueName}>{venue?.name || "-"}</div>
                <div className={styles.venueAddress}>
                  <FaMapMarkerAlt />{[venue?.address, venue?.city, venue?.state].filter(Boolean).join(", ") || "-"}
                </div>
                <div className={styles.venueCapacity}>
                  <FaUsers />Capacity: {venue?.capacity || (venue?.features?.find(f => f.toLowerCase().includes('capacity')) || "-")}
                </div>
              </div>
            </div>
            <div className={styles.summaryCol}>
              <div className={styles.summaryItem}>
                <FaCalendarAlt color="#6bc5ff"/><span className={styles.summaryLabel}>Date</span>
                <span className={styles.summaryVal}>{date}</span>
              </div>
              <div className={styles.summaryItem}>
                <FaClock color="#5ee1b8"/><span className={styles.summaryLabel}>Time</span>
                <span className={styles.summaryVal}>
                  {slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : "—"}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <FaDollarSign color="#ffef95"/><span className={styles.summaryLabel}>Total Price</span>
                <span className={styles.summaryPrice}>
                  ₹{slot?.price || venue?.pricePerHour || "—"}
                </span>
              </div>
            </div>
          </div>
        
          {/* User Details Section */}
          <div className={styles.sectionTitle}><FaUser style={{ marginRight: 6 }} />Your Details</div>
          <div className={styles.inputRow}>
            <div className={styles.fieldGroup}>
              <div className={styles.inputIconBox}>
                <FaUser className={styles.inputIcon} />
                <input
                  className={styles.input}
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  disabled={submitting}
                  type="text"
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.inputIconBox}>
                <FaPhone className={styles.inputIcon} />
                <input
                  className={styles.input}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  disabled={submitting}
                  type="tel"
                />
              </div>
            </div>
          </div>

          {err && <div className={styles.errorMsg}>{err}</div>}

          {/* Action Buttons */}
          <div className={styles.actionRow}>
            <button
              className={styles.cancelBtn}
              disabled={submitting}
              type="button"
              onClick={() => navigate(-1)}
            >
              &#10005; Cancel
            </button>
            <button
              className={styles.confirmBtn}
              disabled={submitting}
              type="button"
              onClick={handleConfirm}
            >
              &#10003; Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
