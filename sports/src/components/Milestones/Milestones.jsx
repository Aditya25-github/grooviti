import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const duration = 2000; // Animation duration in ms
    const increment = (target, property) => {
      const start = 0;
      const incrementTime = duration / target;
      let current = start;
      
      const timer = setInterval(() => {
        current += 1;
        setCounts(prev => ({
          ...prev,
          [property]: property === 'rating' ? 
            Math.min(current/10, target) : 
            Math.min(current, target)
        }));
        
        if (current >= target) clearInterval(timer);
      }, incrementTime);
    };

    Object.entries(targetValues).forEach(([key, value]) => {
      increment(value, key);
    });
  }, []);

  const formatNumber = (num) => {
    return num >= 1000 ? `${(num/1000).toFixed(0)}K+` : num;
  };

  return (
    <section className={styles.milestones}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our Platform at a Glance</h2>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {formatNumber(counts.venues)}+
            </span>
            <span className={styles.statLabel}>Venues Listed</span>
          </div>
          
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {counts.rating.toFixed(1)}
            </span>
            <span className={styles.statLabel}>Platform Rating</span>
          </div>
          
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {formatNumber(counts.users)}+
            </span>
            <span className={styles.statLabel}>Active Users</span>
          </div>
          
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {formatNumber(counts.bookings)}+
            </span>
            <span className={styles.statLabel}>Bookings Made</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Milestones;