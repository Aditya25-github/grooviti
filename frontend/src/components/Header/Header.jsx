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
            From electrifying concerts and thrilling sports events to inspiring
            workshops and vibrant festivals — Grooviti is your one-stop
            destination for discovering and booking unforgettable experiences.
            Whether you're chasing adrenaline or seeking inspiration, we make it
            simple to find, book, and enjoy the moments that matter. Plan less.
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
