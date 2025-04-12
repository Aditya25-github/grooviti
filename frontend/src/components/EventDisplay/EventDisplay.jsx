import React, { useContext } from "react";
import "./EventDisplay.css";
import EventItem from "../EventItem/EventItem";
import { StoreContext } from "../../context/StoreContext";

const EventDisplay = ({ category }) => {
  const { myevents_list } = useContext(StoreContext);
  return (
    <div className="event-display" id="event-display">
      <h2>Top Events Near You!</h2>
      <div className="event-display-list">
        {myevents_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <EventItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                availableTickets={item.availableTickets}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default EventDisplay;
