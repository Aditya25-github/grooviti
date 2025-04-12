import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // ✅ Import Framer Motion
import "./Home.css";

// Components
import Header from "../../components/Header/Header";
import ExploreEvents from "../../components/ExploreEvents/ExploreEvents";
import EventDisplay from "../../components/EventDisplay/EventDisplay";
import TeamGrid from "../TeamGrid/TeamGrid";
import TrustedBy from "../../components/TrustedBy/TrustedBy";
import WebBuilt from "../../components/WebBuilt/WebBuilt";
import ListButton from "../../components/ListButton/ListButton";

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

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Header />
      <ExploreEvents category={category} setCategory={setCategory} />
      <EventDisplay category={category} />
      <TeamGrid />
      <ListButton />
      <TrustedBy />
      <WebBuilt />
    </motion.div>
  );
};

export default Home;
