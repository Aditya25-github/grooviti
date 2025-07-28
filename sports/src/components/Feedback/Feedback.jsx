"use client"

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import styles from './Feedback.module.css';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim() && rating > 0) {
      setIsSubmitted(true);
      // Here you would typically send the data to your backend
      console.log({ rating, feedback });
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.successMessage}>
        <h3>Thank You!</h3>
        <p>Your feedback helps us improve.</p>
      </div>
    );
  }

  return (
    <div className={styles.feedbackContainer}>
      <h2 className={styles.title}>Rate Your Experience</h2>
      <p className={styles.subtitle}>How was your experience with Grooviti?</p>
      
      <form onSubmit={handleSubmit} className={styles.feedbackForm}>
        <div className={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.starButton} ${i < rating ? styles.filled : ''}`}
              onClick={() => setRating(i + 1)}
              aria-label={`Rate ${i + 1} star${i !== 0 ? 's' : ''}`}
            >
              <Star size={24} />
            </button>
          ))}
        </div>

        <textarea
          className={styles.feedbackInput}
          placeholder="Share your feedback about our platform..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        />

        <button type="submit" className={styles.submitButton}>
          <Send size={18} className={styles.sendIcon} />
          Submit Review
        </button>
      </form>
    </div>
  );
}