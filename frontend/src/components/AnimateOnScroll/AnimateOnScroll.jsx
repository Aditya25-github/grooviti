import React, { useEffect, useRef, useState } from 'react';
import './AnimateOnScroll.css';

const AnimateOnScroll = () => {
  const headingRef = useRef(null);
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [countingStarted, setCountingStarted] = useState(false);

  const finalValues = [5, 20, 2, 98, 1];
  const suffixes = ["+", "+", "+", "%", "+"];
  const titles = ["Turfs Connected", "Events Listed", "Colleges Connected", "User Satisfaction","Cities Covered"];

  // Animate counters from 0 to final values
  useEffect(() => {
    if (!countingStarted) return;

    const duration = 2000; // 2 seconds
    const frameRate = 60;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setCounters(finalValues.map(val => Math.floor(easeOut * val)));

      if (frame >= totalFrames) clearInterval(interval);
    }, 1000 / frameRate);

    return () => clearInterval(interval);
  }, [countingStarted]);

  // Trigger animation when component scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCountingStarted(true);
          headingRef.current.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) observer.observe(headingRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="stack-area">
      <h1 className="animate-scroll-heading" ref={headingRef}>Grooviti's Milestones</h1>

      <div className="scroll-container milestone-row">
        {titles.map((title, index) => (
          <div key={index} className="milestone-card">
            <h2 className="milestone-number">
              {counters[index]}{suffixes[index]}
            </h2>
            <p className="milestone-title">{title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimateOnScroll;
