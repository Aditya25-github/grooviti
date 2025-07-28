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

      console.log("🌐 Fetching organizer for:", organizerEmail);

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
    <div className="navbar">
      <Link to="/add">
        <img className="logo" src={assets.logo} alt="Logo" />
      </Link>

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
          />
          {showMenu && (
            <div className="profile-dropdown">
              <p onClick={() => navigate("/add")}>Dashboard</p>
              <p onClick={() => navigate("/list")}>My Events</p>
              <p onClick={() => navigate("/my-plan")}>My Plan</p>
              <p onClick={() => navigate("/settings")}>Settings</p>
              <p onClick={() => navigate("/settings")}>Change Password</p>
              <p onClick={logout}>Logout</p>
            </div>
          )}
        </div>
      ) : (
        <p className="login-conditon" onClick={() => navigate("/")}>
          Login
        </p>
      )}
    </div>
  );
};

export default EventNavbar;
