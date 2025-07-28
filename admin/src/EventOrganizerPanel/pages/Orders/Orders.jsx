import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../../assets/assets";

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

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/booking/status", {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>payId : {order.paymentId + ","}</p>
                <p>payment-status : {order.payment + ","}</p>
                <p>Status : {order.status + ", "} </p>
                <p>Team Size : {order.address.Team_size + ", "}</p>
              </div>
              <p className="order-item-phone">
                {" "}
                phone no : {order.address.phone}
              </p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>Rs.{order.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
