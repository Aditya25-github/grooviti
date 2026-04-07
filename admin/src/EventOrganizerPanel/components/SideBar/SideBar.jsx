import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../../assets/assets";
import "./SideBar.css";

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
    <aside className="sidebar">
      <div className="sidebar-section">
        <nav className="sidebar-menu">
          <NavLink to="/event/dashboard" className="sidebar-link">
            <span className="sidebar-icon"></span>
            <span className="sidebar-label">Dashboard</span>
          </NavLink>
          <NavLink to="/event/list" className="sidebar-link">
            <span className="sidebar-icon"></span>
            <span className="sidebar-label">Events</span>
          </NavLink>
          <NavLink to="/event/add" className="sidebar-link">
            <span className="sidebar-icon"></span>
            <span className="sidebar-label">Add</span>
          </NavLink>
          <NavLink to="/event/orders" className="sidebar-link">
            <span className="sidebar-icon"></span>
            <span className="sidebar-label">Bookings</span>
          </NavLink>
          <NavLink to="/event/add-candidate" className="sidebar-link">
            <span className="sidebar-icon"></span>
            <span className="sidebar-label">Participants</span>
          </NavLink>
          <NavLink to="/event/settings" className="sidebar-link">
            <span className="sidebar-icon"></span>
            <span className="sidebar-label">Settings</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;