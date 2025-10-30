import React, { useEffect } from "react";
import "./SideBar.css";
import { assets } from "../../../assets/assets";
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
        <NavLink to="/event/add" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Event</p>
        </NavLink>
        <NavLink to="/event/list" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Events</p>
        </NavLink>
        <NavLink to="/event/manage-event" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Manage Event</p>
        </NavLink>
        <NavLink to="/event/add-candidate" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Add Candidate</p>
        </NavLink>
        <NavLink to="/event/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Bookings</p>
        </NavLink>
        <NavLink to="/event/statistics" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Statistics</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
