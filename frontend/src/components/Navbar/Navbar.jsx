import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../../assets/frontend_assets/assets";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [event, setevent] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalCartAmount, token, setToken, myevents_list } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const profileRef = useRef();
  const [profileOpen, setProfileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const [showNavbar, setShowNavbar] = useState(true);
  let lastScrollTop = 0;

  useEffect(() => {
    const handleScroll = () => {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop + 3) setShowNavbar(false);
      else if (scrollTop < lastScrollTop - 3) setShowNavbar(true);
      lastScrollTop = scrollTop;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle route navigation on input change
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    const currentPath = window.location.pathname;

    // Only auto-navigate if on search or home page
    if (currentPath === "/" || currentPath.startsWith("/search")) {
      if (trimmedQuery === "") {
        navigate("/");
      } else {
        navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
      }
    }
  }, [searchQuery]);

  // Pre-fill input if there's a query in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query");
    if (query) {
      setSearchQuery(query);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (value) => {
    setSearchQuery(value);
    if (value.trim() && myevents_list?.length > 0) {
      const filtered = myevents_list.filter((event) =>
        event.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setSearchQuery(name);
    setSuggestions([]);
    navigate(`/search?query=${encodeURIComponent(name)}`);
  };

  return (
    <div className="navbar">
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
        <div className="mobile-search-bar">
          <img
            src={assets.search_icon}
            alt="Search"
            className="search-icon"
            onClick={() => setShowSearch(!showSearch)}
          />
          {showSearch && (
            <div className="search-suggestion-wrapper">
              <input
                type="text"
                placeholder="Search events..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              {suggestions.length > 0 && (
                <ul className="autocomplete-list">
                  {suggestions.map((event) => (
                    <li
                      key={event._id}
                      onClick={() => handleSuggestionClick(event.name)}
                    >
                      {event.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="mobile-top-buttons">
          <Link
            to="/cart"
            className="mobile-cart-btn"
            onClick={() => setMenuOpen(false)}
          >
            Go to Cart
          </Link>
        </div>

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
          className={event === "event" ? "active" : ""}
        >
          Events
        </Link>
        <Link
          to="/community"
          onClick={() => {
            setevent("community");
            setMenuOpen(false);
          }}
          className={event === "community" ? "active" : ""}
        >
          Communities
        </Link>
        <Link
          to="/about"
          onClick={() => {
            setevent("about");
            setMenuOpen(false);
          }}
          className={event === "about" ? "active" : ""}
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
        <div className="navbar-search-wrapper">
          <img
            src={assets.search_icon}
            alt="Search"
            className="search-icon"
            onClick={() => setShowSearch(!showSearch)}
          />
          {showSearch && (
            <div className="search-suggestion-wrapper">
              <input
                type="text"
                placeholder="Search events..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              {suggestions.length > 0 && (
                <ul className="autocomplete-list">
                  {suggestions.map((event) => (
                    <li
                      key={event._id}
                      onClick={() => handleSuggestionClick(event.name)}
                    >
                      {event.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="navbar-search-icon desktop-only">
          <Link to="/Cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        <div className="desktop-buttons">
          {!token ? (
            <button onClick={() => setShowLogin(true)}>Sign Up</button>
          ) : (
            <div
              className="navbar-profile"
              ref={profileRef}
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => {
                if (!profileOpen) setProfileOpen(false);
              }}
              onClick={() => setProfileOpen((prev) => !prev)}
            >
              <img src={assets.profile_icon} alt="" />
              {profileOpen && (
                <ul
                  className={`nav-profile-dropdown ${
                    profileOpen ? "show" : ""
                  }`}
                >
                  <li onClick={() => navigate("/myprofile")}>
                    <img src={assets.user_icon} alt="" />
                    <p>My Profile</p>
                  </li>
                  <li onClick={() => navigate("/community")}>
                    <img src={assets.community_icon} alt="" />
                    <p>Communities</p>
                  </li>
                  <li onClick={() => navigate("/myorders")}>
                    <img src={assets.bag_icon} alt="" />
                    <p>Orders</p>
                  </li>
                  <li onClick={() => navigate("/settings")}>
                    <img src={assets.settings_icon} alt="" />
                    <p>Settings</p>
                  </li>
                  <hr />
                  <li onClick={logout}>
                    <img src={assets.logout_icon} alt="" />
                    <p>Logout</p>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
