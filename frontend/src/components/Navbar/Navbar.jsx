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
      {/* Sign Up button outside the hamburger menu */}
      {!token && (
        <button
          className="mobile-signup-btn"
          onClick={() => setShowLogin(true)}
        >
          Sign Up
        </button>
      )}

      <div
        className={`menu-icon ${menuOpen ? "open" : ""}`}
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
        {/* Login & Cart buttons above all navbar elements */}
        <div className="mobile-top-buttons">
          <Link
            to="/cart"
            className="mobile-cart-btn"
            onClick={() => setMenuOpen(false)}
          >
            Go to Cart
          </Link>
        </div>

        {/* Navbar Links */}
        <Link
          to="/"
          onClick={() => {
            setevent("Home");
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
        <Link
          to="/ContactUs"
          onClick={() => {
            setevent("Contact-us");
            setMenuOpen(false);
          }}
          className={event === "Contact-us" ? "active" : ""}
        >
          Contact-us
        </Link>

        {/* Logout Button at the Bottom */}
        {token && (
          <button className="logoutt-btn" onClick={logout}>
            Logout
          </button>
        )}
      </ul>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
      )}

      <div className="navbar-right">
        <div className="navbar-search-icon desktop-only">
          <Link to="/Cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        <div className="desktop-buttons">
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
    </div>
  );
};

export default Navbar;
