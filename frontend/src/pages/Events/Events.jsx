import React, { useState, useEffect } from "react";
import ExploreEvents from "../../components/ExploreEvents/ExploreEvents";
import EventDisplay from "../../components/EventDisplay/EventDisplay";
import { motion } from "framer-motion";
import EventLocationFilter from "../../components/EventLocationFilter/EventLocationFilter";

const Events = () => {
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [customLocations, setCustomLocations] = useState([]);

  const predefinedLocations = [
    "All",
    "Nearby",
    "Pune",
    "Mumbai",
    "Delhi",
    "Bangalore",
  ];

  const locationList = [
    ...new Set([...predefinedLocations, ...customLocations]),
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (
      location &&
      location !== "All" &&
      location !== "Nearby" &&
      !predefinedLocations.includes(location)
    ) {
      setCustomLocations((prev) =>
        prev.includes(location) ? prev : [...prev, location]
      );
    }
  }, [location]);

  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ latitude, longitude });
        setLocationError(null);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            data.address.state_district ||
            data.address.state;

          if (cityName) {
            console.log("Detected city:", cityName);
            setLocation(cityName);
          } else {
            console.warn("City not found in response");
          }
        } catch (err) {
          console.error("Error in reverse geocoding:", err);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError("Permission denied or unable to get location");
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div style={{ paddingTop: "95px" }}>
        <EventLocationFilter
          location={location}
          setLocation={setLocation}
          locationList={locationList}
          fetchUserLocation={fetchUserLocation}
          locationError={locationError}
        />
        <ExploreEvents category={category} setCategory={setCategory} />
        <EventDisplay
          category={category}
          location={location}
          userLocation={userLocation}
        />
      </div>
    </motion.div>
  );
};

export default Events;
