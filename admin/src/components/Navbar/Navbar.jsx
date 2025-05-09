import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContextt";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, admin, setAdmin, setToken } = useContext(StoreContext);
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("eventHost");
    setToken("");
    setAdmin(false);
    toast.success("Logout Successfully");
    navigate("/");
  };
  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src={assets.logo} alt="" />
      </Link>
      {token && admin ? (
        <p className="login-conditon" onClick={logout}>
          Logout
        </p>
      ) : (
        <p className="login-conditon" onClick={() => navigate("/")}>
          Login
        </p>
      )}
      <img className="profile" src={assets.profile_image} alt="" />
    </div>
  );
};

export default Navbar;
