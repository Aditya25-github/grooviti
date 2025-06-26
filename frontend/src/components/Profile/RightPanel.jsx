// components/Profile/RightPanel.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Profile.css";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const RightPanel = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");
  const { url } = useContext(StoreContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${url}/api/booking/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setBookings(res.data.bookings);
        } else {
          toast.error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching your activity");
      }
    };

    fetchBookings();
  }, [token]);

  return (
    <div className="right-panel">
      <h2>My Activity</h2>
      {bookings.length === 0 ? (
        <div className="right-panel-placeholder">
          <p>Your booked events, communities, and posts will appear here.</p>
        </div>
      ) : (
        <div className="activity-list">
          {bookings.map((item) => (
            <div key={item._id} className="activity-card">
              <img src={item.event.image?.url || "/default.jpg"} alt="event" />
              <div>
                <h4>{item.event.name}</h4>
                <p>{item.event.location}</p>
                <p>{item.event.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightPanel;
