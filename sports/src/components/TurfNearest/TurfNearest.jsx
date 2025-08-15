<<<<<<< HEAD
import styles from "./TurfNearest.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const TurfNearest = () => {
  const navigate = useNavigate();
  const [Venues, setVenues] = useState([]);
  const { setSelectedTurf } = useContext(StoreContext);
  const { url } = useContext(StoreContext); // Update with your backend URL
  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await axios.get(`${url}/api/turfs/All`);
       console.log("Response from /api/turfs/All:", res.data);
      if (res.data.success && res.data.turfs) {
        setVenues(res.data.turfs);
      } else {
        console.warn("No turfs found or invalid structure");
      }
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    }
  };

  const handleVenueClick = (venue) => {
    setSelectedTurf(venue); // Save turf to context
    navigate(`/venues/${venue._id}`);
  };

  const handleExploreMore = () => {
    navigate("/venues");
=======
import React from "react";
import styles from "./TurfNearest.module.css";
import turf1 from "../../assets/sports_assets/turf1.png";
import cricketturf from "../../assets/sports_assets/cricketturf.png";
import turf3 from "../../assets/sports_assets/turf3.png";
import { useNavigate } from "react-router-dom";

const Venues = [
  {
    name: "Elite Cricket Ground",
    description: "Professional cricket turf with modern facilities",
    price: "₹800/hr",
    buttonLabel: "Book Now",
    image: turf3
  },
  {
    name: "Aqua Sports Complex",
    description: "Olympic-size swimming pool with changing rooms",
    price: "₹200/hr",
    buttonLabel: "Book Now",
    image: cricketturf
  },
  {
    name: "Shuttle Pro Courts",
    description: "Air-conditioned badminton courts with equipment",
    price: "₹400/hr",
    buttonLabel: "Book Now",
    image: turf3
  }
];

const TurfNearest = () => {
  const navigate = useNavigate();

  const handleExploreMore = () => {
    navigate('/venues');
>>>>>>> 4b3e7842 (too many changes so doing today)
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
<<<<<<< HEAD
        <h2 className={styles.sectionTitle}>Venues Near You</h2>
      </div>

      <div className={styles.glassContainer}>
        <div className={styles.venuesContainer}>
          {Venues.slice(0,3).map((venue) => (
            <div
              key={venue._id}
              className={styles.venueCard}
              onClick={() => handleVenueClick(venue)}
              role="article"
              aria-label={`${venue.name} venue card`}
            >
              <div className={styles.venueImage}>
                <img
                  src={venue.image || "/placeholder.jpg"}
                  alt={venue.name}
                  loading="lazy"
                />
                <span className={styles.sportTag}>
                  {venue.sport || "Sport"}
                </span>
              </div>
              <div className={styles.venueInfo}>
                <h3 className={styles.venueName}>{venue.name}</h3>
                <p className={styles.venueDescription}>
                  {venue.description || "No description"}
                </p>
                <div className={styles.venueDetails}>
                  <span className={styles.location}>
                    <i className="fas fa-map-marker-alt"></i>{" "}
                    {venue.location || "Unknown"}
                  </span>
                  <span className={styles.size}>
                    <i className="fas fa-ruler-combined"></i>{" "}
                    {venue.size || "Standard"}
                  </span>
                </div>
                <div className={styles.venueFooter}>
                  <span className={styles.venuePrice}>
                    ₹{venue.pricePerHour || "0"}/hr
                  </span>
                  <span className={styles.availability}>
                    {venue.slotsAvailable || 0} slots available
                  </span>
=======
        <h2 className={styles.sectionTitle}>Turfs Near You</h2>
      </div>
      
      <div className={styles.glassContainer}>
        <div className={styles.venuesContainer}>
          {Venues.map((venue, index) => (
            <div key={index} className={styles.venueCard}>
              <div className={styles.imageContainer}>
                <img 
                  src={venue.image} 
                  alt={venue.name} 
                  className={styles.venueImage}
                />
              </div>
              <div className={styles.venueContent}>
                <h3 className={styles.venueName}>{venue.name}</h3>
                <p className={styles.venueDescription}>{venue.description}</p>
                <div className={styles.venueFooter}>
                  <span className={styles.venuePrice}>{venue.price}</span>
                  <button className={styles.bookButton}>{venue.buttonLabel}</button>
>>>>>>> 4b3e7842 (too many changes so doing today)
                </div>
              </div>
            </div>
          ))}
        </div>
<<<<<<< HEAD
        <button
          className={styles.exploreButton}
          onClick={handleExploreMore}
          aria-label="Explore more venues"
        >
=======
        <button className={styles.exploreButton} onClick={handleExploreMore}>
>>>>>>> 4b3e7842 (too many changes so doing today)
          Explore More →
        </button>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default TurfNearest;
=======
export default TurfNearest;
>>>>>>> 4b3e7842 (too many changes so doing today)
