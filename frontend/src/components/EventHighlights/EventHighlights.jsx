// src/components/EventHighlights.jsx
import React from "react";
import "./EventHighlights.css"; // we'll style it separately

const defaultFeatures = [
  { icon: "🎵", label: "Live Music" },
  { icon: "🪑", label: "Seating Available" },
  { icon: "🚻", label: "Washrooms" },
  { icon: "🅿", label: "Parking" },
  { icon: "🍕", label: "Food Stalls" },
];

const EventHighlights = ({ features = defaultFeatures }) => {
  return (
    <div className="event-highlights">
      <h2>Event Highlights</h2>
      <div className="highlights-grid">
        {features.map((f, idx) => (
          <div className="highlight-card" key={idx}>
            <span className="highlight-icon">{f.icon}</span>
            <span className="highlight-label">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventHighlights;
