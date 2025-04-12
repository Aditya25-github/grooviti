import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Home.css";

// Components
import Header from "../../components/Header/Header";
import ExploreEvents from "../../components/ExploreEvents/ExploreEvents";
import EventDisplay from "../../components/EventDisplay/EventDisplay";
import TeamGrid from "../TeamGrid/TeamGrid";
import TrustedBy from "../../components/TrustedBy/TrustedBy";
import WebBuilt from "../../components/WebBuilt/WebBuilt";
import ListButton from "../../components/ListButton/ListButton";
import Feedback from "../../components/Feedback/Feedback";
import FAQ from "../../components/FAQ/FAQ";

const Home = () => {
  const [category, setCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Grooviti - Your Ultimate Event Ticketing Platform";

    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Discover and book tickets for amazing events with Grooviti. The easiest way to host, manage, and attend events."
      );
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content =
        "Discover and book tickets for amazing events with Grooviti.";
      document.head.appendChild(newMeta);
    }
  }, []);

  // Define variants for smooth transitions
  const sectionVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
<<<<<<< HEAD
      <Header />
      <ExploreEvents category={category} setCategory={setCategory} />
      <EventDisplay category={category} />
      <TeamGrid />
      <ListButton />
      <TrustedBy />
      <Feedback />
      <WebBuilt />
      <FAQ />
=======
      {/* Header Section with Animation */}
      <motion.div variants={headerVariants} initial="hidden" animate="visible">
        <Header />
      </motion.div>

      {/* Explore Events Section */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <ExploreEvents category={category} setCategory={setCategory} />
      </motion.div>

      {/* Event Display Section */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <EventDisplay category={category} />
      </motion.div>

      {/* Team Grid Section */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <TeamGrid />
      </motion.div>

      {/* List Button Section */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <ListButton />
      </motion.div>

      {/* Trusted By Section */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <TrustedBy />
      </motion.div>

      {/* Feedback Section */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <Feedback />
      </motion.div>

      {/* Web Built Section */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <WebBuilt />
      </motion.div>
>>>>>>> 2856774 (animation added by framer)
    </motion.div>
  );
};

export default Home;
