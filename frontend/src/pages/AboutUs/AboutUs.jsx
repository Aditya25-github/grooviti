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
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ paddingTop: "95px" }}
    >
      <div className="about-us" id="about-us">
        <h1>About Us</h1>

        <p className="intro">
          Welcome to our platform grooviti.com, where you can discover and book
          exciting events happening near you. Whether it's concerts, tech
          conferences, or food festivals, we bring them all to one place.
        </p>

        <p className="mission">
          Our mission is to empower event creators and enrich communities by
          providing a comprehensive event listing platform.
        </p>

        <TeamGrid />
      </div>
    </motion.div>
  );
};

export default AboutUs;
