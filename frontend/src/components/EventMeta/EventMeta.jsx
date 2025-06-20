import React from "react";
import "./EventMeta.css"; // Optional: for styling

const EventMeta = ({ event, location = {}, ticketsLeft }) => {
  const { address, city, state, country } = location;

  return (
    <div className="event-meta-group">
      <div className="event-meta-row">
        <span className="event-meta-label">Venue:</span>
        <span className="event-meta-value">
          {event.venue || address || "—"}
        </span>
      </div>
      <div className="event-meta-row">
        <span className="event-meta-label">City:</span>
        <span className="event-meta-value">{city || "—"}</span>
      </div>
      <div className="event-meta-row">
        <span className="event-meta-label">State:</span>
        <span className="event-meta-value">{state || "—"}</span>
      </div>
      <div className="event-meta-row">
        <span className="event-meta-label">Country:</span>
        <span className="event-meta-value">{country || "—"}</span>
      </div>
      <div className="event-meta-row">
        <span className="event-meta-label">Category:</span>
        <span className="event-meta-value">{event.category || "—"}</span>
      </div>
      <div className="event-meta-row">
        <span className="event-meta-label">Price:</span>
        <span className="event-meta-value">₹{event.price}</span>
      </div>
      <div className="event-meta-row">
        <span className="event-meta-label">Tickets Left:</span>
        <span className="event-meta-value">{ticketsLeft}</span>
      </div>
    </div>
  );
};

export default EventMeta;
