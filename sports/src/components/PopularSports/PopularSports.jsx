import React, { useEffect, useState, useRef } from "react";
import "./PopularSports.css";
import badminton from "../../assets/sports_assets/badminton.jpg.png";
import football from "../../assets/sports_assets/football.jpg.png";
import cricket from "../../assets/sports_assets/cricket.jpg.png";
import swimming from "../../assets/sports_assets/swimming.jpg.png"; 
import tennis from "../../assets/sports_assets/tennis.jpg.png";
import tabletennis from "../../assets/sports_assets/tabletennis.jpg.png";

const sports = [
  {
    name: "Badminton",
    image: badminton,
  },
  {
    name: "Football",
    image: football,
  },
  {
    name: "Cricket",
    image: cricket,
  },
  {
    name: "Swimming",
    image: swimming,
  },
  {
    name: "Tennis",
    image: tennis,
  },
  {
    name: "Table Tennis",
    image: tabletennis,
  },
];

const PopularSports = ({ onSportSelect }) => {
  const [showIndicator, setShowIndicator] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  
  const handleSportClick = (sportName) => {
    if (onSportSelect) {
      onSportSelect(sportName);
    }
  };

  useEffect(() => {
    // Check if horizontal scrolling is needed
    const checkScroll = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const hasHorizontalScroll = container.scrollWidth > container.clientWidth;
        setShowIndicator(hasHorizontalScroll);
      }
    };

    checkScroll();
    
    // Handle scroll events to hide indicator while scrolling and track progress
    const handleScroll = () => {
      setIsScrolling(true);
      
      // Calculate scroll progress
      if (containerRef.current) {
        const container = containerRef.current;
        const scrollableWidth = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        const progress = Math.min(100, (currentScroll / scrollableWidth) * 100);
        setScrollProgress(progress);
      }
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    };

    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    
    // Also check on window resize
    window.addEventListener('resize', checkScroll);
    
    return () => {
      window.removeEventListener('resize', checkScroll);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="popular-sports-container">
      <h2 className="heading">Popular Sports</h2>
      <div className="glass-container">
        <div className="card-list" ref={containerRef}>
          {sports.map((sport, index) => (
            <div
              key={index}
              className="sport-card"
              onClick={() => handleSportClick(sport.name)}
            >
              <img src={sport.image} alt={sport.name} className="sport-img" />
              <div className="sport-name">{sport.name}</div>
            </div>
          ))}
        </div>
        
        {/* Minimal Progress Line indicator */}
        {showIndicator && (
          <div className={`progress-indicator-wrapper ${isScrolling ? 'scrolling' : ''}`}>
            <div className="progress-track">
              <div 
                className="progress-line" 
                style={{ width: `${scrollProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularSports;