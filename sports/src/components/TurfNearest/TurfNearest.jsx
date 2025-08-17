import React, { useState, useEffect, useContext } from "react";
import styles from "./TurfNearest.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
const TurfNearest = () => {
  const navigate = useNavigate();
  const [turfs, setTurfs] = useState([]);
  const { url } = useContext(StoreContext);
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await axios.get(`${url}/api/turfs/all`);
        if (res.data.success && Array.isArray(res.data.turfs)) {
          // Only take first 3 turfs
          setTurfs(res.data.turfs.slice(0, 3));
        } else {
          setTurfs([]);
        }
      } catch {
        setTurfs([]);
      }
    };
    fetchTurfs();
  }, [url]);
  const handleVenueClick = (venueId) => {
    navigate(`/venues/${venueId}`);
  };
  const handleExploreMore = () => {
    navigate("/venues");
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.sectionTitle}>Turfs Near You</h2>
      </div>

      <div className={styles.glassContainer}>
        <div className={styles.venuesContainer}>
          {turfs.map((turf) => (
            <div key={turf._id} className={styles.venueCard}>
              <div className={styles.imageContainer}>
                <img
                  src={turf.image || "https://via.placeholder.com/400x300?text=Venue"}
                  alt={turf.name}
                  className={styles.venueImage}
                />
              </div>
              <div className={styles.venueContent} onClick={() => handleVenueClick(turf._id)}>
                <h3 className={styles.venueName}>{turf.name}</h3>
                <p className={styles.venueDescription}>{turf.description}</p>
                <div className={styles.venueFooter}>
                  <span className={styles.venuePrice}>₹{turf.pricePerHour || "N/A"}/hr</span>
                  <button className={styles.bookButton} onClick={() => handleVenueClick(turf._id)}>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.exploreButton} onClick={handleExploreMore}>
          Explore More →
        </button>
      </div>
    </div>
  );
};

export default TurfNearest;
