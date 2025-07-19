import React, { useEffect } from "react";
import "./SideBar.css";
import { assets } from "../../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (!token) return null;
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Event</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Events</p>
        </NavLink>
        <NavLink to="/manage-event" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Manage Event</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Bookings</p>
        </NavLink>
        <NavLink to="/statistics" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Statistics</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
