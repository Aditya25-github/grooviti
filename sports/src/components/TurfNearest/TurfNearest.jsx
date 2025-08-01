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
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
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
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className={styles.exploreButton}
          onClick={handleExploreMore}
          aria-label="Explore more venues"
        >
          Explore More →
        </button>
      </div>
    </div>
  );
};

export default TurfNearest;
