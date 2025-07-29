import React from "react";
import styles from "./Venues.module.css";
import Aurora from "../../components/Aurora/Aurora";
import { FaMapMarkerAlt, FaRulerCombined, FaStar, FaCalendarAlt } from "react-icons/fa";

const venuesList = [
  {
    id: 1,
    name: "Elite Cricket Ground",
    location: "Sector 18, Noida",
    type: "Cricket",
    dimensions: "120m x 80m",
    price: "₹2,500/hr",
    slots: 5,
    rating: 4.8,
    image: "https://picsum.photos/id/100/800/600",
    description: "Professional cricket ground with modern facilities and flood lights",
    amenities: ["Flood Lights", "Changing Rooms", "Parking", "Cafeteria"],
  },
  {
    id: 2,
    name: "GreenField Sports Complex",
    location: "HSR Layout, Bangalore",
    type: "Football",
    dimensions: "100m x 60m",
    price: "₹1,800/hr",
    slots: 3,
    rating: 4.5,
    image: "https://picsum.photos/id/101/800/600",
    description: "Synthetic turf for football and box cricket. Night lights available!",
    amenities: ["Synthetic Turf", "Showers", "Equipment Rental", "First Aid"],
  },
];

const Venues = () => {
  return (
    <div className={styles.venuesPage}>
      <div className={styles.auroraBg}>
        <Aurora
          colorStops={["#3a7bd5", "#00d2ff", "#3a7bd5"]}
          blend={0.33}
          amplitude={1.8}
          speed={0.25}
        />
      </div>

      <div className={styles.contentWrapper}>
        <section className={styles.heroSection}>
          <h1 className={styles.venuesTitle}>SPORTS VENUES</h1>
          <h2 className={styles.venuesSubtitle}>Premium Sporting Facilities</h2>
          <p className={styles.venuesDesc}>
            Discover top-rated sports venues with professional-grade facilities and easy booking.
          </p>
        </section>

        <section className={styles.venuesSection}>
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <select className={styles.filterSelect}>
                <option>All Sports</option>
                <option>Cricket</option>
                <option>Football</option>
                <option>Tennis</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <select className={styles.filterSelect}>
                <option>All Locations</option>
                <option>Noida</option>
                <option>Bangalore</option>
                <option>Delhi</option>
              </select>
            </div>
          </div>

          <div className={styles.venuesContainer}>
            {venuesList.map((venue) => (
              <div key={venue.id} className={styles.venueCard}>
                <div className={styles.cardImageContainer}>
                  <img 
                    src={venue.image} 
                    alt={venue.name} 
                    className={styles.cardImage}
                    loading="lazy"
                  />
                  <div className={styles.cardBadges}>
                    <span className={styles.typeBadge}>{venue.type}</span>
                    <span className={styles.ratingBadge}>
                      <FaStar className={styles.starIcon} /> {venue.rating}
                    </span>
                  </div>
                </div>

                <div className={styles.cardDetails}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.venueName}>{venue.name}</h3>
                    <span className={styles.price}>{venue.price}</span>
                  </div>

                  <p className={styles.venueDescription}>{venue.description}</p>

                  <div className={styles.venueMeta}>
                    <div className={styles.metaItem}>
                      <FaMapMarkerAlt className={styles.metaIcon} />
                      <span>{venue.location}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <FaRulerCombined className={styles.metaIcon} />
                      <span>{venue.dimensions}</span>
                    </div>
                  </div>

                  <div className={styles.amenities}>
                    {venue.amenities.slice(0, 3).map((item, index) => (
                      <span key={index} className={styles.amenityTag}>{item}</span>
                    ))}
                  </div>

                  <div className={styles.cardFooter}>
                    <button className={styles.bookButton}>
                      <FaCalendarAlt className={styles.buttonIcon} />
                      Book Now
                    </button>
                    <span className={styles.slots}>
                      {venue.slots} slots available
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Venues;