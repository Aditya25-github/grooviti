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
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
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