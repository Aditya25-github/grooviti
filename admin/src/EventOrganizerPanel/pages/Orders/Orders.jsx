import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../../assets/assets";
import { FaBox, FaPhoneAlt } from "react-icons/fa";
import { useContext } from "react";
import { StoreContext } from "../../../context/StoreContext";

const statusBadge = (status) => {
  if (status === "Confirmed")
    return <span className="order-status confirmed">Confirmed</span>;
  if (status === "Pending")
    return <span className="order-status pending">Pending</span>;
  return <span className="order-status">{status}</span>;
};

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("All Events");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { token } = useContext(StoreContext);

  const eventNames = ["All Events", ...new Set(orders.map(o => o.eventName || o.address?.event || "Unknown Event").filter(Boolean))];

  const filteredOrders = orders.filter(o => {
    // Only show Confirmed bookings
    if (o.status !== "Confirmed" && o.payment !== true) return false;

    // Event Filter
    if (selectedEvent !== "All Events") {
      const name = o.eventName || o.address?.event || "Unknown Event";
      if (name !== selectedEvent) return false;
    }

    // Date Range Filter
    if (startDate || endDate) {
      const orderDate = new Date(o.date || o.bookingDate);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (orderDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (orderDate > end) return false;
      }
    }

    return true;
  });

  const fetchAllOrders = async () => {
    const email = localStorage.getItem("organizerEmail");
    if (!email) {
      toast.error("Organizer email not found");
      return;
    }
    try {
      const response = await axios.get(
        `${url}/api/booking/my-orders?email=${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        // Token expired or invalid — clear stale session and redirect to login
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("eventHostToken");
        localStorage.removeItem("organizerEmail");
        localStorage.removeItem("userType");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error("Network error. Please check your connection.");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders-main">
      <div className="orders-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h2>Bookings Dashboard</h2>
            <span className="orders-desc">
              Track and manage all event bookings with detailed insights.
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ fontSize: "0.9rem", color: "#9496b5", fontWeight: "600" }}>From:</span>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #e3e6f0", color: "#32377a", outline: "none", fontSize: "0.95rem" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ fontSize: "0.9rem", color: "#9496b5", fontWeight: "600" }}>To:</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #e3e6f0", color: "#32377a", outline: "none", fontSize: "0.95rem" }}
              />
            </div>
            <select 
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #e3e6f0", fontWeight: "600", fontSize: "1rem", outline: "none", color: "#32377a", backgroundColor: "#fff" }}
            >
              {eventNames.map((name, i) => (
                 <option key={i} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-orders">No booking data available.</div>
        ) : (
          <>
            <div className="orders-table-head">
              <span>Customer</span>
              <span>Event</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Comm Status</span>
            </div>
            {filteredOrders.map((order, index) => (
              <div key={index} className="orders-table-row">
                <div className="cell-customer">
                  <img
                    src={assets.parcel_icon || FaBox}
                    alt=""
                    className="customer-img"
                  />
                  <div>
                    <div className="customer-name">
                      {order.address.firstName + " " + order.address.lastName}
                    </div>
                    <div className="customer-email">
                      <FaPhoneAlt
                        style={{ fontSize: "0.8em", marginRight: 5 }}
                      />
                      {order.address.phone}
                    </div>
                  </div>
                </div>
                <div className="cell-event">
                  {order.eventName || order.address?.event || "Unknown Event"}
                </div>
                <div className="cell-date">
                  {order.date ? new Date(order.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : ""}
                </div>
                <div className="cell-amount">
                  <b>Rs.{order.amount}</b>
                </div>
                <div className="cell-comm">
                  <div style={{ display: 'flex', gap: '5px', fontSize: '1.2em', cursor: 'help' }} title="Communications Analytics">
                    <span title={`Email Sent: ${order.emailSent ? 'Yes' : 'No'}`} style={{ opacity: order.emailSent ? 1 : 0.3 }}>{order.emailSent ? '📤' : '➖'}</span>
                    <span title={`Email Delivered: ${order.emailDelivered ? 'Yes' : 'No'}`} style={{ opacity: order.emailDelivered ? 1 : 0.3 }}>{order.emailDelivered ? '📥' : '➖'}</span>
                    <span title={`Email Opened: ${order.emailOpened ? 'Yes' : 'No'}`} style={{ opacity: order.emailOpened ? 1 : 0.3 }}>{order.emailOpened ? '👀' : '➖'}</span>
                    <span title={`WhatsApp Clicked: ${order.whatsappClicked ? 'Yes' : 'No'}`} style={{ opacity: order.whatsappClicked ? 1 : 0.3 }}>{order.whatsappClicked ? '📲' : '➖'}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
