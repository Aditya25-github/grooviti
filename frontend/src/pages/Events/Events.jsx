import React, { useState, useEffect } from "react";
import ExploreEvents from "../../components/ExploreEvents/ExploreEvents";
import EventDisplay from "../../components/EventDisplay/EventDisplay";
import { motion } from "framer-motion";
import EventLocationFilter from "../../components/EventLocationFilter/EventLocationFilter";
import { FiMapPin, FiNavigation, FiAlertCircle } from "react-icons/fi";
import "./Events.css";

const Events = () => {
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [customLocations, setCustomLocations] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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
      setLocationError("Geolocation not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ latitude, longitude });

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
            setLocation(cityName);
          } else {
            setLocationError("Couldn't determine your city name");
          }
        } catch (err) {
          console.error("Error in reverse geocoding:", err);
          setLocationError("Error fetching location details");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError(
          error.message === "User denied Geolocation"
            ? "Location permission denied"
            : "Unable to get your location"
        );
        setIsLoadingLocation(false);
      }
    );
  };

  return (
    <motion.div
      className="events-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="events-content">
        <div className="filters-section">
          <EventLocationFilter
            location={location}
            setLocation={setLocation}
            locationList={locationList}
            fetchUserLocation={fetchUserLocation}
            locationError={locationError}
            isLoading={isLoadingLocation}
          />

          <ExploreEvents category={category} setCategory={setCategory} />
        </div>

        {locationError && (
          <div className="location-error">
            <FiAlertCircle className="error-icon" />
            <span>{locationError}</span>
          </div>
        )}

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
