import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import EventItem from "../EventItem/EventItem";
import "./SearchResults.css";

const SearchResults = () => {
  const { myevents_list } = useContext(StoreContext);
  const query = new URLSearchParams(useLocation().search).get("query") || "";

  const filteredEvents = myevents_list.filter((event) =>
    event.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-results" style={{ paddingTop: "95px" }}>
      <h2>Search Results for "{query}"</h2>
      <div className="event-display-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((item, index) => (
            <EventItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              availableTickets={item.availableTickets}
            />
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
