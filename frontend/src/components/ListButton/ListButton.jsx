import React from "react";
import { useNavigate } from "react-router-dom";
import "./ListButton.css";

const ListButton = () => {
  const navigate = useNavigate();

  return (
    <div className="list-button-container">
      <h2 className="some-quote">
        Seamlessly list your event and connect with the right audience.
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
