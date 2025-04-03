import React, { useState, useEffect } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreEvents from "../../components/ExploreEvents/ExploreEvents";
import EventDisplay from "../../components/EventDisplay/EventDisplay";
import TeamGrid from "../TeamGrid/TeamGrid";
import TrustedBy from "../../components/TrustedBy/TrustedBy";
import WebBuilt from "../../components/WebBuilt/WebBuilt";
import ListButton from "../../components/ListButton/ListButton";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    // ✅ Set page title
    document.title = "Grooviti - Your Ultimate Event Ticketing Platform";

    // ✅ Set meta description dynamically
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

  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
      <ExploreEvents category={category} setCategory={setCategory} />
      <EventDisplay category={category} />
      <TeamGrid />
      <ListButton />
      <TrustedBy />
      <WebBuilt />
    </div>
  );
};

export default Home;
