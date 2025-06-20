// src/components/OrganizerInfo.jsx
import React from "react";
import "./OrganizerInfo.css";

const OrganizerInfo = ({ name, email, phone }) => {
  return (
    <div className="organizer-info">
      <h3>Organizer Details</h3>
      <div className="organizer-detail">
        <span className="label">👤 Name:</span>
        <span>{name || "Not specified"}</span>
      </div>
      <div className="organizer-detail">
        <span className="label">📧 Email:</span>
        <span>{email || "Not provided"}</span>
      </div>
      <div className="organizer-detail">
        <span className="label">📞 Phone:</span>
        <span>{phone || "Not available"}</span>
      </div>
    </div>
  );
};

export default OrganizerInfo;
