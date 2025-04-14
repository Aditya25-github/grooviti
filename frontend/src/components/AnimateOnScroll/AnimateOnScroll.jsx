import React, { useEffect, useRef, useState } from 'react';
import './AnimateOnScroll.css';
import { Activity, Building2, Users, MapPin } from 'lucide-react';

const AnimateOnScroll = () => {
  const blockRefs = useRef([]);
  const leftBlockRefs = useRef([]);
  const headingRef = useRef(null);
  const animationStateRef = useRef({
    headingDone: false,
    currentRow: 0,
    rightDone: false,
    leftDone: false,
    started: false
  });
  
  // State for counting animations
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [counting, setCounting] = useState(false);
  
  // Updated final values for the counters
  const finalValues = [10, 2, 98, 1];
  const suffixes = ["+", "+", "%", "+"];
  
  useEffect(() => {
    // Function to animate elements in sequence
    const animateSequence = () => {
      const { headingDone, currentRow, rightDone, leftDone } = animationStateRef.current;
      
      // First animate the heading
      if (!headingDone && headingRef.current) {
        // Add visible class to heading
        headingRef.current.classList.add('visible');
        animationStateRef.current.headingDone = true;
        
        // After heading animation, start with the blocks
        setTimeout(() => {
          animateBlocks();
        }, 600); // Delay before starting blocks animation
        
        return;
      }
      
      // Function to animate blocks after heading
      function animateBlocks() {
        const { currentRow, rightDone, leftDone } = animationStateRef.current;
        
        // Get current row elements
        const rightElement = blockRefs.current[currentRow];
        const leftElement = leftBlockRefs.current[currentRow];
        
        if (!rightDone && rightElement) {
          // Step 1: Animate right block
          rightElement.classList.add('visible');
          animationStateRef.current.rightDone = true;
          
          // Start counter animation when the first row appears
          if (currentRow === 0 && !counting) {
            setCounting(true);
          }
          
          // After right animation, animate left block
          setTimeout(() => {
            if (leftElement) {
              leftElement.classList.add('visible');
              animationStateRef.current.leftDone = true;
              
              // After left animation, move to next row
              setTimeout(() => {
                animationStateRef.current = {
                  ...animationStateRef.current,
                  headingDone: true,
                  currentRow: currentRow + 1,
                  rightDone: false,
                  leftDone: false
                };
                
                // If we have more rows, continue animation
                if (currentRow + 1 < Math.max(blockRefs.current.length, leftBlockRefs.current.length)) {
                  animateBlocks();
                }
              }, 250); // Delay before moving to next row
            }
          }, 100); // Delay between right and left animation
        }
      }
    };
    
    // Create an Intersection Observer to start the animation
    const observer = new IntersectionObserver(
      (entries) => {
        // Once first element is visible, start the animation sequence
        if (entries[0].isIntersecting && !animationStateRef.current.started) {
          animationStateRef.current.started = true;
          animateSequence();
          observer.disconnect(); // Only need to trigger once
        }
      },
      { threshold: 0.1 }
    );
    
    // Observe the heading to start the sequence
    if (headingRef.current) {
      observer.observe(headingRef.current);
    }
    
    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, [counting]);

  // Effect for counter animation
  useEffect(() => {
    if (!counting) return;
    
    // Duration for the counter animation in ms
    const duration = 2000;
    const frameRate = 60;
    const totalFrames = duration / (1000 / frameRate);
    let frame = 0;
    
    const counterInterval = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      
      // Use easeOutQuad easing function for smoother animation
      const easeOutProgress = 1 - (1 - progress) * (1 - progress);
      
      // Update counters based on progress
      setCounters(finalValues.map(value => 
        Math.floor(easeOutProgress * value)
      ));
      
      // Stop the interval when animation is complete
      if (frame >= totalFrames) {
        clearInterval(counterInterval);
      }
    }, 1000 / frameRate);
    
    return () => clearInterval(counterInterval);
  }, [counting]);
  
  const leftBlocks = [
    { title: "Events Listed", className: "title-text-1" },
    { title: "Colleges Connected", className: "title-text-2" },
    { title: "User Satisfaction", className: "title-text-3" },
    { title: "Cities Covered", className: "title-text-4" }
  ];

  // Function to create h2 with animated number
  const createH2WithAnimation = (title, className, index) => {
    if (className.includes("title-number")) {
      return (
        <h2 className={className}>
          <span className="text">{counters[index]}{suffixes[index]}</span>
        </h2>
      );
    } else {
      return (
        <h2 className={className}>
          <span className="text">{title}</span>
        </h2>
      );
    }
  };

  // Add hover effect
  useEffect(() => {
    const rows = document.querySelectorAll('.row-pair');
    
    const handlersMap = new Map();
    
    rows.forEach(row => {
      const leftH2 = row.querySelector('.left-scroll-block h2');
      const rightH2 = row.querySelector('.animate-scroll-block h2');
      
      const handleHoverIn = () => {
        if (leftH2) leftH2.classList.add('hovered');
        if (rightH2) rightH2.classList.add('hovered');
      };
      
      const handleHoverOut = () => {
        if (leftH2) leftH2.classList.remove('hovered');
        if (rightH2) rightH2.classList.remove('hovered');
      };
      
      if (leftH2) {
        leftH2.addEventListener('mouseenter', handleHoverIn);
        leftH2.addEventListener('mouseleave', handleHoverOut);
        handlersMap.set(leftH2, {enter: handleHoverIn, leave: handleHoverOut});
      }
      
      if (rightH2) {
        rightH2.addEventListener('mouseenter', handleHoverIn);
        rightH2.addEventListener('mouseleave', handleHoverOut);
        handlersMap.set(rightH2, {enter: handleHoverIn, leave: handleHoverOut});
      }
    });
    
    return () => {
      // Cleanup
      handlersMap.forEach((handlers, element) => {
        element.removeEventListener('mouseenter', handlers.enter);
        element.removeEventListener('mouseleave', handlers.leave);
      });
    };
  }, []);

  return (
    <div className="stack-area">
      <h1 className="animate-scroll-heading" ref={headingRef}>Grooviti's Milestones</h1>
      
      <div className="scroll-container">
        {leftBlocks.map((block, index) => (
          <div key={index} className="row-pair" data-row={index}>
            <div className="left-box">
              {index === 0 && (
                <div className="icon-container events-icon-container">
                  <Activity className="milestone-icon" size={45} />
                </div>
              )}
              {index === 2 && (
                <div className="icon-container user-icon-container">
                  <Users className="milestone-icon" size={45} />
                </div>
              )}
              <div 
                className="left-scroll-block"
                ref={el => leftBlockRefs.current[index] = el}
              >
                {createH2WithAnimation(block.title, block.className, index)}
              </div>
            </div>
            
            <div className="right-box">
              <div 
                className="animate-scroll-block"
                ref={el => blockRefs.current[index] = el}
              >
                {createH2WithAnimation("", `title-number-${index + 1}`, index)}
              </div>
              {index === 1 && (
                <div className="icon-container connected-icon-container">
                  <Building2 className="milestone-icon" size={45} />
                </div>
              )}
              {index === 3 && (
                <div className="icon-container cities-icon-container">
                  <MapPin className="milestone-icon" size={45} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimateOnScroll;