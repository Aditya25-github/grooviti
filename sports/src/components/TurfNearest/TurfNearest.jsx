import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "./TurfNearest.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const TurfNearest = () => {
  const navigate = useNavigate();
  const [turfs, setTurfs] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const { url } = useContext(StoreContext);
  
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await axios.get(`${url}/api/turfs/all`);
        if (res.data.success && Array.isArray(res.data.turfs)) {
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

  // Calculate scroll progress
  const updateScrollProgress = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
      
      // Show scrolling state
      setIsScrolling(true);
      
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set timeout to hide scrolling state
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateScrollProgress);
      updateScrollProgress();
      
      return () => {
        scrollContainer.removeEventListener('scroll', updateScrollProgress);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [turfs]);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.sectionTitle}>Turfs Near You</h2>
      </div>

      <div className={styles.glassContainer}>
        <div 
          className={styles.venuesContainer} 
          ref={scrollContainerRef}
        >
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
        
        {/* Progress Line - exactly like PopularSports */}
        <div className={`${styles.progressIndicatorWrapper} ${isScrolling ? styles.scrolling : ''}`}>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressLine} 
              style={{ width: `${scrollProgress}%` }}
            ></div>
          </div>
        </div>
        
        <div className={styles.buttonContainer}>
          <button className={styles.exploreButton} onClick={handleExploreMore}>
            Explore More →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurfNearest;