import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../../assets/assets";
import { FaBox, FaPhoneAlt } from "react-icons/fa";

const statusBadge = (status) => {
  if (status === "Confirmed")
    return <span className="order-status confirmed">Confirmed</span>;
  if (status === "Pending")
    return <span className="order-status pending">Pending</span>;
  return <span className="order-status">{status}</span>;
};

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const email = localStorage.getItem("eventHost");
    if (!email) {
      toast.error("Organizer email not found");
      return;
    }
    try {
      const response = await axios.get(
        `${url}/api/booking/my-orders?email=${email}`
      );
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (err) {
      toast.error("Network error");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders-main">
      <div className="orders-header">
        <h2>Bookings Dashboard</h2>
        <span className="orders-desc">
          Track and manage all event bookings with detailed insights.
        </span>
      </div>
      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="empty-orders">No booking data available.</div>
        ) : (
          <>
            <div className="orders-table-head">
              <span>Customer</span>
              <span>Event</span>
              <span>Date</span>
              <span>Status</span>
              <span>Amount</span>
            </div>
            {orders.map((order, index) => (
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
                  {order.eventName || order.event}
                </div>
                <div className="cell-date">
                  {order.date || order.bookingDate}
                </div>
                <div className="cell-status">{statusBadge(order.status)}</div>
                <div className="cell-amount">
                  <b>Rs.{order.amount}</b>
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
