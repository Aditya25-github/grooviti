import React, { useContext, useState } from "react";
import { assets } from "../../assets/frontend_assets/assets";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [event, setevent] = useState("home");

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>
      <ul className="navbar-event">
        <Link
          to="/"
          onClick={() => setevent("Home")}
          className={event === "Home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-events"
          onClick={() => setevent("Events")}
          className={event === "Events" ? "active" : ""}
        >
          Events
        </a>
        <Link
          to="/about"
          onClick={() => setevent("about")}
          className={event === "About-us" ? "active" : ""}
        >
          About-Us
        </Link>
        <Link
          to="/plans"
          onClick={() => setevent("Plans")}
          className={event === "Plans" ? "active" : ""}
        >
          Plans
        </Link>
        <a
          href="#footer"
          onClick={() => setevent("Contact-us")}
          className={event === "Contact-us" ? "active" : ""}
        >
          Contact-us
        </a>
      </ul>
      <div className="navbar-right">
        {/* <img src={assets.search_icon} alt="" /> */}
        <div className="navbar-search-icon">
          <Link to="/Cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
