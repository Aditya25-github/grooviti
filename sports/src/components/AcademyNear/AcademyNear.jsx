import React, { useRef, useState, useEffect } from "react";
import styles from "./AcademyNear.module.css";
import cricketAcademy from "../../assets/sports_assets/cricket-academy.avif";
import swimmingAcademy from "../../assets/sports_assets/swimming-academy.avif";
import badmintonAcademy from "../../assets/sports_assets/badminton-academy.avif";
import { useNavigate } from "react-router-dom";

const Academies = [
  {
    id: 1,
    name: "Champions Cricket Academy",
    rating: "4.8",
    type: "Cricket Training",
    price: "₹3000/month",
    coach: "Rajesh Kumar",
    location: "Sector 15, Noida",
    image: cricketAcademy,
    sportColor: "#4CAF50"
  },
  {
    id: 2,
    name: "AquaLife Swimming Academy",
    rating: "4.9",
    type: "Swimming Training",
    price: "₹2500/month",
    coach: "Priya Sharma",
    location: "Sector 22, Gurgaon",
    image: swimmingAcademy,
    sportColor: "#00BCD4"
  },
  {
    id: 3,
    name: "Shuttle Masters Academy",
    rating: "4.7",
    type: "Badminton Training",
    price: "₹2000/month",
    coach: "Amit Singh",
    location: "Sector 18, Delhi",
    image: badmintonAcademy,
    sportColor: "#9C27B0"
  }
];

const AcademyNear = () => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const handleExploreMore = () => {
    navigate('/academy');
  };

  const handleAcademyClick = (academyId) => {
    navigate(`/academies/${academyId}`);
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
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.mainTitle}>Academies Near You</h1>
      </div>
      
      <div className={styles.glassContainer}>
        <div 
          className={styles.academiesRow}
          ref={scrollContainerRef}
        >
          {Academies.map((academy) => (
            <div 
              key={academy.id} 
              className={styles.academyCard}
              onClick={() => handleAcademyClick(academy.id)}
            >
              <div className={styles.imageContainer}>
                <img src={academy.image} alt={academy.name} />
                <span 
                  className={styles.sportTag}
                  style={{ backgroundColor: academy.sportColor }}
                >
                  {academy.type}
                </span>
              </div>
              <div className={styles.academyContent}>
                <div className={styles.headerRow}>
                  <h2 className={styles.academyName}>{academy.name}</h2>
                  <div className={styles.ratingContainer}>
                    <span className={styles.rating}>{academy.rating}</span>
                  </div>
                </div>
                <p className={styles.academyPrice}>{academy.price}</p>
                <div className={styles.details}>
                  <p className={styles.detailItem}>
                    <span className={styles.detailLabel}>Coach:</span> {academy.coach}
                  </p>
                  <p className={styles.detailItem}>
                    <span className={styles.detailLabel}>Location:</span> {academy.location}
                  </p>
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

export default AcademyNear;