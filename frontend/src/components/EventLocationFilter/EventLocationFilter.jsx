import React from "react";
import "./EventLocationFilter.css";

const EventLocationFilter = ({
  location,
  setLocation,
  locationList,
  fetchUserLocation,
  locationError,
}) => {
  return (
    <div className="event-location-filter">
      <label htmlFor="location">Filter by Location:</label>
      <select
        id="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        {locationList.map((loc, index) =>
          loc ? (
            <option key={index} value={loc}>
              {loc.replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ) : null
        )}
      </select>

      <button onClick={fetchUserLocation} style={{ marginLeft: "10px" }}>
        Use My Location
      </button>

      {locationError && <p style={{ color: "red" }}>{locationError}</p>}
    </div>
  );
};

export default EventLocationFilter;
