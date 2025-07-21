import React, { useEffect } from "react";
import { motion } from "framer-motion";
import TeamGrid from "../TeamGrid/TeamGrid";
import "./AboutUs.css";

// Animation variants (no changes needed here)
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: {
      duration: 0.7, ease: "easeInOut", when: "beforeChildren", staggerChildren: 0.2,
    },
  },
  exit: { opacity: 0, y: -30, transition: { duration: 0.7, ease: "easeInOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" },
  },
};

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.section
      className="about-us-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="about-us"
    >
      <div className="about-us-content">
        <motion.h1 className="about-us-title" variants={itemVariants}>
          Connecting People Through Live Events
        </motion.h1>

        <motion.p className="about-us-intro" variants={itemVariants}>
          Grooviti is your gateway to discovering and booking unforgettable experiences. We bring every kind of event—from buzzing concerts to vibrant college fests—together on one seamless platform.
        </motion.p>

        <div className="about-us-sections">
          <motion.div className="about-us-section" variants={itemVariants}>
            <h2 className="about-us-subtitle">Our Mission</h2>
            <p>
              To make finding and attending events effortless and fun, empowering organizers and helping you create your next great story.
            </p>
          </motion.div>

          <motion.div className="about-us-section" variants={itemVariants}>
            <h2 className="about-us-subtitle">What We Promise</h2>
            <ul>
              <li><strong>Effortless Discovery:</strong> Find your vibe with a curated, easy-to-browse platform.</li>
              <li><strong>Instant Booking:</strong> Secure your spot in seconds. No hassle, no FOMO.</li>
              <li><strong>One Hub, All Events:</strong> From parties to workshops, it's all here.</li>
            </ul>
          </motion.div>
        </div>

        <motion.p className="about-us-tagline" variants={itemVariants}>
          <strong>Book it. Groove it. Live it.</strong>
        </motion.p>

        <motion.div variants={itemVariants}>
          <TeamGrid />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutUs;