import React from "react";
import "./ExploreEvents.css";
import { event_list } from "../../assets/frontend_assets/assets";

const ExploreEvents = ({ category, setCategory }) => {
  return (
    <div className="explore-events" id="explore-events">
      <h1>Explore Our List Of Events</h1>
      <p className="explore-events-text">
        "Don't miss out on the excitement! Dive into our lineup of trending
        events and immerse yourself in unforgettable experiences."
      </p>
      <div className="explore-events-list">
        {event_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.event_name ? "All" : item.event_name
                )
              }
              key={index}
              className="explore-evets-list-items"
            >
              <img
                className={category === item.event_name ? "active" : ""}
                src={item.event_image}
                alt=""
              />
              <p>{item.event_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreEvents;
