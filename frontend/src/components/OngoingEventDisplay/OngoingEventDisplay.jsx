import React from "react";
import { useNavigate } from "react-router-dom";
import "./OngoingEventDisplay.css";
import { FaVoteYea, FaImages } from "react-icons/fa";

const OngoingEventDisplay = () => {
  const navigate = useNavigate();

  const handleCardClickFreshers = () => {
    navigate("/pccoer");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleCardClickHalloween = () => {
    navigate("/pccoer/halloween");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const fresherParty = {
    name: "Freshers Party",
    description: "Vote for Mr. & Mrs. Fresher and celebrate new beginnings!",
    endDate: "2025-07-21T23:59:59Z",
    coverImage: { url: "/images/freshersParty.PNG" },
  };

  const halloweenEvent = {
    name: "Halloween Costume Contest",
    description: "Vote for the best costumes and spookiest looks!",
    endDate: "2025-10-30T22:59:30Z",
    coverImage: { url: "/images/halloween.png" }, // add this asset to public/images
  };

  const formatEndDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <section className="ongoing-event-section">
      <h2>Ongoing Events</h2>
      <div className="ongoing-event-grid">
        {/* Freshers Party Card */}
        <div className="ongoing-event-card">
          <img
            className="ongoing-event-image"
            src={fresherParty.coverImage.url}
            alt={fresherParty.name}
            onClick={handleCardClickFreshers}
          />
          <div className="ongoing-event-details">
            <h3>{fresherParty.name}</h3>
            <p>{fresherParty.description}</p>
            <p>Ends on: {formatEndDate(fresherParty.endDate)}</p>
            <div className="ongoing-event-buttons">
              <button
                className="vote-now-button"
                onClick={() => {
                  navigate("/pccoer/vote");
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                <FaVoteYea /> Vote Now
              </button>
              <button
                className="gallery-button"
                onClick={() => {
                  navigate("/pccoer/gallery");
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                <FaImages /> Gallery
              </button>
            </div>
          </div>
        </div>

        {/* Halloween Card */}
        <div className="ongoing-event-card">
          <img
            className="ongoing-event-image"
            src={halloweenEvent.coverImage.url}
            alt={halloweenEvent.name}
            onClick={handleCardClickHalloween}
          />
          <div className="ongoing-event-details">
            <h3>{halloweenEvent.name}</h3>
            <p>{halloweenEvent.description}</p>
            <p>Ends on: {formatEndDate(halloweenEvent.endDate)}</p>
            <div className="ongoing-event-buttons">
              <button
                className="vote-now-button"
                onClick={() => {
                  navigate("/pccoer/halloween");
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                <FaVoteYea /> Vote Now
              </button>
              <button
                className="gallery-button"
                onClick={() => {
                  navigate("/pccoer/halloween");
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                <FaImages /> Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OngoingEventDisplay;
