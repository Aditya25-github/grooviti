import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useParams } from "react-router-dom";
import styles from "./BookingConfirmed.module.css";

// You can replace this with a real QR code library if needed.
const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=SampleTicketVerificationCode";

const BookingConfirmedPage = () => {
   const { url } = useContext(StoreContext);
  const { slotId } = useParams();
  const [slot, setSlot] = useState(null);
  console.log("BookingConfirmedPage - slotId:", slotId);
  useEffect(() => {
    // Fetch slot booking details
    axios
      .get(`${url}/api/slots/${slotId}`)
      .then((res) => setSlot(res.data.slot))
      .catch(() => setSlot(null));
  }, [slotId, url]);

  if (!slot)
    return (
      <div className={styles.pageBg}>
        <div className={styles.confirmCard}>
          <h2>Loading booking details...</h2>
        </div>
      </div>
    );

  // Placeholder -- adjust/tidy fields as per your booking schema!
  const venue = {
    name: slot.turf?.name || slot.turf || "--",
    location: slot.turf?.location || "Venue Location",
    // Add/adjust more fields as needed
  };

  return (
    <div className={styles.pageBg}>
      <div className={styles.headerBar}>
        <span className={styles.brand}>VenueBook</span>
        <span className={styles.paymentStatus}><span className={styles.circleSuccess}></span> Payment Successful</span>
      </div>
      <div className={styles.confirmCard}>
        <div className={styles.checkmark}>✔</div>
        <h1 className={styles.confirmTitle}>Booking Confirmed!</h1>
        <div className={styles.confirmSubtitle}>Your venue has been successfully booked</div>

        <div className={styles.ticketPanel}>
          <div className={styles.ticketHeader}>
            <div>
              <span className={styles.ticketTitle}>Booking Ticket</span>
              <span className={styles.ticketSubtitle}>Keep this for your records</span>
            </div>
            <div className={styles.ticketId}>Ticket ID <b>{slot._id?.slice(-6) || "XXXXXX"}</b></div>
          </div>
          {/* ---- Venue Details ---- */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionHeading}>Venue Details</h3>
            <div className={styles.fieldRow}>
              <div><b>Venue Name:</b> {venue.name}</div>
              <div><b>Location:</b> {venue.location}</div>
            </div>
            <div className={styles.fieldRow}>
              <div><b>Date:</b> {new Date(slot.date).toLocaleDateString()}</div>
              <div><b>Time:</b> {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              {/* Duration could be dynamic */}
              <div><b>Duration:</b> 1 Hour</div>
            </div>
          </div>

          {/* ---- Customer Details ---- */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionHeading}>Customer Details</h3>
            <div className={styles.fieldRow}>
              <div><b>Full Name:</b> {slot.customerName || "--"}</div>
              <div><b>Phone:</b> {slot.phone || "--"}</div>
            </div>
            {/* If you store email: <div><b>Email:</b> {slot.customerEmail}</div> */}
          </div>

          {/* ---- Payment Details ---- */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionHeading}>Payment Details</h3>
            <div className={styles.fieldRow}>
              <div><b>Payment ID:</b> {slot.paymentId || "--"}</div>
              <div><b>Amount Paid:</b> <span className={styles.amountSuccess}>₹{slot.price || "--"}</span></div>
            </div>
            <div className={styles.fieldRow}>
              <div><b>Status:</b> <span className={styles.statusSuccess}>Completed</span></div>
              {/* If available, add method/date */}
            </div>
          </div>

          {/* ---- QR Code ---- */}
          <div className={styles.qrSection}>
            <div className={styles.qrTitle}>Verification QR Code</div>
            <img src={qrCodeUrl} alt="QR Code" className={styles.qrImg} />
            <div className={styles.qrHint}>Scan this code for venue entry verification</div>
          </div>

          {/* ---- Important Info ---- */}
          <div className={styles.infoBox}>
            <b>Important Information</b>
            <ul>
              <li>Please arrive 15 minutes before your scheduled time</li>
              <li>Present this ticket and valid ID for entry</li>
              <li>Cancellation policy: 24 hours advance notice required</li>
            </ul>
          </div>

          {/* ---- Download Button ---- */}
          <div className={styles.downloadRow}>
            <button className={styles.downloadBtn} onClick={() => window.print()}>
              &#128190; Download Ticket
            </button>
          </div>
          <div className={styles.saveHint}>Save a copy of your booking confirmation</div>
        </div>
        <div className={styles.footerMsg}>
          Thank you for choosing VenueBook<br />
          For support, contact us at <span className={styles.supportEmail}>support@venuebook.com</span>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmedPage;
