import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { assets } from "../../../assets/assets";
import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaPlusSquare, 
  FaUserCheck, 
  FaTicketAlt, 
  FaUsers, 
  FaCog 
} from "react-icons/fa";
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
            <span className="sidebar-icon"><FaTachometerAlt /></span>
            <span className="sidebar-label">Dashboard</span>
          </NavLink>
          <NavLink to="/event/list" className="sidebar-link">
            <span className="sidebar-icon"><FaCalendarAlt /></span>
            <span className="sidebar-label">Events</span>
          </NavLink>
          <NavLink to="/event/add" className="sidebar-link">
            <span className="sidebar-icon"><FaPlusSquare /></span>
            <span className="sidebar-label">Add</span>
          </NavLink>
          <NavLink to="/event/mark-attendance" className="sidebar-link">
            <span className="sidebar-icon"><FaUserCheck /></span>
            <span className="sidebar-label">Mark Attendance</span>
          </NavLink>
          <NavLink to="/event/orders" className="sidebar-link">
            <span className="sidebar-icon"><FaTicketAlt /></span>
            <span className="sidebar-label">Bookings</span>
          </NavLink>
          <NavLink to="/event/add-candidate" className="sidebar-link">
            <span className="sidebar-icon"><FaUsers /></span>
            <span className="sidebar-label">Participants</span>
          </NavLink>
          <NavLink to="/event/settings" className="sidebar-link">
            <span className="sidebar-icon"><FaCog /></span>
            <span className="sidebar-label">Settings</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;