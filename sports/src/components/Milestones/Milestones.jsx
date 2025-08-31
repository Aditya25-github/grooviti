import React, { useEffect, useState, useCallback } from 'react';
import styles from './Milestones.module.css';

const Milestones = () => {
  const [counts, setCounts] = useState({
    venues: 0,
    rating: 0,
    users: 0,
    bookings: 0
  });

  const targetValues = {
    venues: 500,
    rating: 4.8,
    users: 2500,
    bookings: 5000,
  };

  // Format numbers with proper K/M formatting
  const formatNumber = useCallback((num, isRating = false) => {
    if (isRating) return num.toFixed(1);

    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return Math.floor(num);
  }, []);

  // Animation using requestAnimationFrame
  useEffect(() => {
    const duration = 2000;
    let startTime = null;
    let animationFrameId = null;

    const animateCounts = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const newCounts = {};
      Object.entries(targetValues).forEach(([key, target]) => {
        if (key === 'rating') {
          newCounts[key] = (easeOutQuart * (target - 0)) + 0; // smooth 0 → target
        } else {
          newCounts[key] = easeOutQuart * target;
        }
      });

      setCounts(newCounts);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCounts);
      }
    };

    animationFrameId = requestAnimationFrame(animateCounts);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className={styles.milestones}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our Platform at a Glance</h2>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {formatNumber(counts.venues)}
            </span>
            <span className={styles.statLabel}>Venues Listed</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {formatNumber(counts.rating, true)}
            </span>
            <span className={styles.statLabel}>Platform Rating</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {formatNumber(counts.users)}
            </span>
            <span className={styles.statLabel}>Active Users</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {formatNumber(counts.bookings)}
            </span>
            <span className={styles.statLabel}>Bookings Made</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Milestones;
