import React, { useEffect, useState } from "react";
import "./TicketConfirmation.css";
import { useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const TicketConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.post(`${url}/api/booking/order-details`, {
          orderId,
        });

        if (response.data.success) {
          setOrderDetails(response.data.order);
        } else {
          setError("Order details not found.");
        }
      } catch (err) {
        setError("Error fetching order details.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, url]);

  return (
    <div className="ticket-confirmation">
      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="ticket-details">
          <h2>🎟️ Ticket Confirmation</h2>
          <p>Your ticket has been booked successfully!</p>
          <h3>Booking Details</h3>
          <p>
            <strong>Order ID:</strong> {orderDetails?.orderId}
          </p>
          <p>
            <strong>Name:</strong> {orderDetails?.address.firstName}{" "}
            {orderDetails?.address.lastName}
          </p>
          <p>
            <strong>Email:</strong> {orderDetails?.address.email}
          </p>
          <p>
            <strong>Phone:</strong> {orderDetails?.address.phone}
          </p>
          <h3>Event Details</h3>
          <ul>
            {orderDetails?.items.map((item, index) => (
              <li key={index}>
                {item.name} - <b>Qty:</b> {item.quantity}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total Amount:</strong> ₹{orderDetails?.amount}
          </p>
          <p>
            <strong>Payment Status:</strong> ✅ Confirmed
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketConfirmation;
