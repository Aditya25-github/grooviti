import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Importing icons

const Header = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const carouselRef = useRef(null);

  const cards = [
    {
      title: "Venues",
      description: "Discover amazing venues for your next event",
      buttonText: "Take Me There",
      target: "/venues"
    },
    {
      title: "Play Together",
      description: "Find partners for your favorite sports",
      buttonText: "Join Now",
      target: "/play-together"
    },
    {
      title: "Academy",
      description: "Improve your skills with professional coaching",
      buttonText: "Learn More",
      target: "/academy"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const goToPrev = () => {
    setActiveIndex(prev => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex(prev => (prev + 1) % cards.length);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  // Touch event handlers for swipe
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!startX) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (diff > 5) {
      goToNext();
    } else if (diff < -5) {
      goToPrev();
    }
    
    setStartX(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.headerWrapper}>
      <div 
        className={styles.carouselContainer}
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Left Arrow */}
        <button 
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={goToPrev}
          aria-label="Previous slide"
        >
          <FaChevronLeft className={styles.arrowIcon} />
        </button>

        {cards.map((card, index) => (
          <div 
            key={index}
            className={`${styles.carouselCard} ${index === activeIndex ? styles.active : ''}`}
          >
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardDescription}>{card.description}</p>
              <div className={styles.buttonContainer}>
                <button
                  onClick={() => handleNavigation(card.target)}
                  className={styles.cardButton}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Right Arrow */}
        <button 
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={goToNext}
          aria-label="Next slide"
        >
          <FaChevronRight className={styles.arrowIcon} />
        </button>

        <div className={styles.carouselIndicators}>
          {cards.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === activeIndex ? styles.activeIndicator : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;