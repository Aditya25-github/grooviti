import React, { useContext } from "react";
import { motion } from "framer-motion";
import "./EventDisplay.css";
import EventItem from "../EventItem/EventItem";
import { StoreContext } from "../../context/StoreContext";

const EventDisplay = ({ category, location, userLocation }) => {
  const { myevents_list } = useContext(StoreContext);

  // Helper function to calculate distance in KM between two lat/lon points
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in KM
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const radiusInKm = 30; // Radius for nearby events

  const filteredList = myevents_list.filter((item) => {
    const categoryMatch = category === "All" || item.category === category;

    let locationMatch = true;
    let distanceMatch = true;

    // Case: "Nearby" selected → filter by lat/lon
    if (location === "Nearby" && userLocation) {
      if (!item.location?.latitude || !item.location?.longitude) {
        distanceMatch = false;
      } else {
        const distance = getDistanceFromLatLonInKm(
          userLocation.latitude,
          userLocation.longitude,
          item.location.latitude,
          item.location.longitude
        );
        distanceMatch = distance <= radiusInKm;
      }
    }

    // Case: City selected → match city name
    else if (location && location !== "All") {
      locationMatch =
        item.location?.city?.toLowerCase() === location.toLowerCase();
    }

    return categoryMatch && locationMatch && distanceMatch;
  });

  const listVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="event-display" id="event-display">
      <h2>Top Events Near You!</h2>
      <motion.div
        className="event-display-list"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredList.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filteredList.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <EventItem
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                availableTickets={item.availableTickets}
                location={item.location}
              />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default EventDisplay;
