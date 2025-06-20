// src/components/RelatedEvents.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./RelatedEvents.css";

const RelatedEvents = ({ events }) => {
  const navigate = useNavigate();

  if (!events?.length) return null;

  return (
    <div className="related-events">
      <h3>You May Also Like</h3>
      <div className="related-events-scroll">
        {events.map((ev) => (
          <div
            key={ev._id}
            className="related-card"
            onClick={() => navigate(`/event/${ev._id}`)}
          >
            <img src={`/images/${ev.image}`} alt={ev.name} />
            <div className="related-info">
              <h4>{ev.name}</h4>
              <p>₹{ev.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedEvents;
