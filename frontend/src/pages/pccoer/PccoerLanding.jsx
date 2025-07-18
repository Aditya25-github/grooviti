// frontend/src/pages/pccoer/PccoerLanding.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import pccoerImage from "../../assets/frontend_assets/pccoer.jpg";
import "./pccoer.css";
import ImageGallery from "./ImageGallery";

<ImageGallery />

const PccoerLanding = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/pccoer/event");
    }
  };

  return (
    <div className="pccoer-landing-container">
      <div className="event-card">
        <img
          src={pccoerImage}
          alt="PCCoER Freshers Party"
          className="event-image"
        />
        <div className="event-content">
          <h2 className="event-title">PCCOE&R Freshers Party</h2>
          <p className="event-subtitle">Community celebration for 2nd year 🎉</p>
          <button className="event-button pulse" onClick={handleJoin}>
          Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default PccoerLanding;