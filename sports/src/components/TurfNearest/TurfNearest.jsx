import React from "react";
import styles from "./TurfNearest.module.css";
import turf1 from "../../assets/sports_assets/turf1.png";
import cricketturf from "../../assets/sports_assets/cricketturf.png";
import turf3 from "../../assets/sports_assets/turf3.png";
import { useNavigate } from "react-router-dom";

const Venues = [
  {
    id: 1,
    name: "Elite Cricket Ground",
    sport: "Cricket",
    description: "Professional cricket turf with modern facilities and flood lights",
    location: "Sector 18, Noida",
    size: "120m x 80m",
    price: 2500,
    slotsAvailable: 5,
    buttonLabel: "Book Now",
    image: turf3,
    sportColor: '#4CAF50'
  },
  {
    id: 2,
    name: "Aqua Sports Complex",
    sport: "Swimming",
    description: "Olympic-size swimming pool with changing rooms and temperature control",
    location: "CP, New Delhi",
    size: "50m x 25m",
    price: 1800,
    slotsAvailable: 8,
    buttonLabel: "Book Now",
    image: cricketturf,
    sportColor: '#00BCD4'
  },
  {
    id: 3,
    name: "Shuttle Pro Courts",
    sport: "Badminton",
    description: "Air-conditioned badminton courts with equipment rental and professional coaching",
    location: "Dwarka, New Delhi",
    size: "6 Courts Available",
    price: 2200,
    slotsAvailable: 6,
    buttonLabel: "Book Now",
    image: turf3,
    sportColor: '#9C27B0'
  }
];

const TurfNearest = () => {
  const navigate = useNavigate();

  const handleExploreMore = () => {
    navigate('/venues');
  };

  const handleBookVenue = (venueId) => {
    // Add booking functionality here
    console.log(`Booking venue ${venueId}`);
  };

  const handleVenueClick = (venueId) => {
    navigate(`/venues/${venueId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.sectionTitle}>Venues Near You</h2>
      </div>
      
      <div className={styles.glassContainer}>
        <div className={styles.venuesContainer}>
          {Venues.map((venue, index) => (
            <div 
              key={venue.id} 
              className={styles.venueCard}
              onClick={() => handleVenueClick(venue.id)}
              role="article"
              aria-label={`${venue.name} venue card`}
            >
              <div className={styles.venueImage}>
                <img 
                  src={venue.image} 
                  alt={venue.name} 
                  loading="lazy"
                />
                <span 
                  className={styles.sportTag}
                  style={{ backgroundColor: venue.sportColor }}
                >
                  {venue.sport}
                </span>
              </div>
              <div className={styles.venueInfo}>
                <h3 className={styles.venueName}>{venue.name}</h3>
                <p className={styles.venueDescription}>{venue.description}</p>
                <div className={styles.venueDetails}>
                  <span className={styles.location}>
                    <i className="fas fa-map-marker-alt"></i> {venue.location}
                  </span>
                  <span className={styles.size}>
                    <i className="fas fa-ruler-combined"></i> {venue.size}
                  </span>
                </div>
                <div className={styles.venueFooter}>
                  <span className={styles.venuePrice}>₹{venue.price}/hr</span>
                  <span className={styles.availability}>
                    {venue.slotsAvailable} slots available
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
