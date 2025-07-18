// frontend/src/pages/pccoer/PccoerEventPage.jsx
import React, { useState, useEffect } from "react";
import GalleryRoom from "./ImageGallery"; // renamed from ChatRoom for clarity
import VotingZone from "./VotingZone";
import { useNavigate } from "react-router-dom";
import "./pccoer.css";

const PccoerEventPage = () => {
  const [activeTab, setActiveTab] = useState("gallery");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="pccoer-event-container">
      <header className="event-header">
        {/* You can add event name or banner here if needed */}
      </header>

      <nav className="event-tabs">
        <button
          onClick={() => setActiveTab("gallery")}
          className={`tab-button ${activeTab === "gallery" ? "active" : ""}`}
        >
          Gallery Room
        </button>
        <button
          onClick={() => setActiveTab("vote")}
          className={`tab-button ${activeTab === "vote" ? "active" : ""}`}
        >
          Voting Zone
        </button>
      </nav>

      <main className="tab-content">
        {activeTab === "gallery" ? <GalleryRoom /> : <VotingZone />}
      </main>
    </div>
  );
};

export default PccoerEventPage;
