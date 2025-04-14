import React from "react";
import { useNavigate } from "react-router-dom";
import "./ListButton.css";

const ListButton = () => {
  const navigate = useNavigate();

  return (
    <div className="list-button-container">
      <h1 className="qoute-1">
        Book it! Groove it! Live it!
      </h1>
      <h2 className="some-quote">
        Seamlessly List Your Event and Connect With The Right Audience.
      </h2>
      <button
        className="list-event-button"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          navigate("/create-event"); 
        }}
      >
        List an Event
      </button>
    </div>
  );
};

export default ListButton;
