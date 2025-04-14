import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/event");
  };
  return (
    <div style={{ paddingTop: "102px" }}>
      <div className="header">
        <div className="header-overlay" />
        <div className="header-contents">
          <h2>Buy Your Favourite Event Tickets Here</h2>
          <p>
            From concerts and sports to workshops and festivals — Grooviti makes
            it easy to book tickets and enjoy your favorite moments. Plan less.
            Groove more.
          </p>
          <button
            onClick={handleClick}
            aria-label="View Events"
            className="view-events-button"
          >
            View Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
