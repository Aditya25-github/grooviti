import React from 'react';
import styles from './ShinyText.module.css';

const ShinyText = ({ 
  text, 
  disabled = false, 
  speed = 2.5,  
  className = '',
  intensity = 0.9
}) => {
  return (
    <span
      className={`${styles.shinyText} ${disabled ? styles.disabled : ''} ${className}`}
      style={{ 
        '--animation-duration': `${speed}s`,
        '--intensity': intensity
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;