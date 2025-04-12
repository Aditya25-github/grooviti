import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { motion } from "framer-motion";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post(
          `${url}/api/booking/userorders`,
          {},
          { headers: { token } }
        );
        setOrders(response.data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div style={{ paddingTop: "95px" }}>
        <div className="my-orders">
          <h2 className="myorders">My Orders</h2>

          {loading ? (
            <motion.p
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Loading orders...
            </motion.p>
          ) : orders.length === 0 ? (
            <motion.p
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              No orders found.
            </motion.p>
          ) : (
            <div className="container">
              {orders.map((order, index) => (
                <motion.div
                  key={index}
                  className="my-orders-order"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.03 }} // Hover effect on the card
                >
                  <img src={assets.parcel_icon} alt="Order" />
                  <p>
                    {order.items
                      .map((item) => `${item.name} x ${item.quantity}`)
                      .join(", ")}
                  </p>
                  <p>₹{order.amount.toFixed(2)}</p>
                  <p>Items: {order.items.length}</p>
                  <p>
                    <span>&#x25cf;</span> <b>{order.status}</b>
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => alert("Tracking feature coming soon!")}
                  >
                    Track Order
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MyOrders;
