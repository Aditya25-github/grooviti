// src/components/EventHighlights.jsx
import React from "react";
import "./EventHighlights.css";

const iconMap = {
  "Live Music": "🎵",
  "Seating Available": "🪑",
  Washrooms: "🚻",
  Parking: "🅿",
  "Food Stalls": "🍕",
};

const EventHighlights = ({ highlights = [] }) => {
  if (!highlights.length) return null;

  return (
    <div className="event-highlights">
      <h2>Event Highlights</h2>
      <div className="highlights-grid">
        {highlights.map((label, idx) => (
          <div className="highlight-card" key={idx}>
            <span className="highlight-icon">{iconMap[label] || "✨"}</span>
            <span className="highlight-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventHighlights;
