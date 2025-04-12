import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "./AboutUs.css";
import TeamGrid from "../TeamGrid/TeamGrid";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{ paddingTop: "95px" }}
    >
      <div className="about-us" id="about-us">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="about-us-title"
        >
          About Us
        </motion.h1>

        <motion.p
          className="intro"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: 0.2 }}
        >
          Welcome to our platform grooviti.com, where you can discover and book
          exciting events happening near you. Whether it's concerts, tech
          conferences, or food festivals, we bring them all to one place.
        </motion.p>

        <motion.p
          className="mission"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: 0.4 }}
        >
          Our mission is to empower event creators and enrich communities by
          providing a comprehensive event listing platform.
        </motion.p>

        {/* Team Grid with animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }}
        >
          <TeamGrid />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs;
