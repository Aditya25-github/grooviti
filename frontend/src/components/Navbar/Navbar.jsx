import React, { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/frontend_assets/assets";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [event, setevent] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  // State to track navbar visibility
  const [showNavbar, setShowNavbar] = useState(true);
  let lastScrollTop = 0;

  useEffect(() => {
    const handleScroll = () => {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop + 3) {
        // Hide navbar when scrolling down
        setShowNavbar(false);
      } else if (scrollTop < lastScrollTop - 3) {
        // Show navbar when scrolling up slightly
        setShowNavbar(true);
      }

      lastScrollTop = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="navbar">

      <div 
      className={`menu-icon ${menuOpen ? 'open' : ''}`} 
        onClick={() => setMenuOpen(!menuOpen)}
        >
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>

      <ul className={`navbar-event ${menuOpen ? "active" : ""}`}>
        <Link
          to="/"
          onClick={() => {setevent("Home");
            setMenuOpen(false);
          }}
          className={event === "Home" ? "active" : ""}
        >
          Home
        </Link>
        <Link
          to="/event"
          onClick={() => {
            setevent("event");
            setMenuOpen(false);
        }}
          className={event === "Home" ? "active" : ""}
        >
          Events
        </Link>
        <Link
          to="/about"
          onClick={() => {
            setevent("about");
            setMenuOpen(false);
        }}
          className={event === "About-us" ? "active" : ""}
        >
          About-Us
        </Link>
        <Link
          to="/plans"
          onClick={() => {
            setevent("Plans");
            setMenuOpen(false);
        }}
          className={event === "Plans" ? "active" : ""}
        >
          Plans
        </Link>
        <a
          href="#footer"
          onClick={() => {
            setevent("Contact-us");
            setMenuOpen(false);
        }}
          className={event === "Contact-us" ? "active" : ""}
        >
          Contact-us
        </a>
      </ul>

      <div className="navbar-right">
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
