import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../../assets/assets";
import { toast } from "react-toastify";
import { StoreContext } from "../../../context/StoreContext";

const EventNavbar = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin, setAdmin, setToken } = useContext(StoreContext);
  const [showMenu, setShowMenu] = useState(false);
  const [organizerInfo, setOrganizerInfo] = useState(null);
  const menuRef = useRef();

  // Logout
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("eventHost");
    setToken("");
    setAdmin(false);
    toast.success("Logout Successfully");
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch organizer info from backend
  useEffect(() => {
    const fetchOrganizer = async () => {
      const organizerEmail = localStorage.getItem("organizerEmail");
      if (!organizerEmail) return;

      try {
        const res = await fetch(`${url}/api/organizer/get`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: organizerEmail }),
        });

        const data = await res.json();

        if (res.ok && data.organizer) {
          setOrganizerInfo(data.organizer);
        } else {
          console.error("Organizer not found:", data.message);
        }
      } catch (err) {
        console.error("❌ Failed to fetch organizer:", err);
      }
    };

    if (token && admin) {
      fetchOrganizer();
    }
  }, [token, admin, url]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="nav-title">Grooviti Event Panel</span>
      </div>

      {token && admin ? (
        <div className="profile-container" ref={menuRef}>
          <img
            className="profile"
            src={
              organizerInfo?.profileImage?.url
                ? organizerInfo.profileImage.url
                : assets.profile_image
            }
            alt="Profile"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Profile"
          />
          {showMenu && (
            <div className="profile-dropdown">
              <button onClick={() => navigate("/event/dashboard")}>
                Dashboard
              </button>
              <button onClick={() => navigate("/event/list")}>My Events</button>
              <button onClick={() => navigate("/event/my-plan")}>
                My Plan
              </button>
              <button onClick={() => navigate("/event/settings")}>
                Settings
              </button>
              <button onClick={() => navigate("/event/settings")}>
                Change Password
              </button>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="login-btn" onClick={() => navigate("/")}>
          Login
        </button>
      )}
    </nav>
  );
};

export default EventNavbar;
