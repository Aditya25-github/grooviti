import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreEvents from "../../components/ExploreEvents/ExploreEvents";
import EventDisplay from "../../components/EventDisplay/EventDisplay";
import TeamGrid from "../TeamGrid/TeamGrid";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [category, setCategory] = useState("All");

  return (
    <div>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Grooviti - Your Ultimate Event Ticketing Platform</title>
        <meta
          name="description"
          content="Discover and book tickets for amazing events with Grooviti. The easiest way to host, manage, and attend events."
        />
        <meta
          name="keywords"
          content="Grooviti, event ticketing, buy tickets, sell tickets, event management, online booking"
        />
        <meta
          property="og:title"
          content="Grooviti - Your Ultimate Event Ticketing Platform"
        />
        <meta
          property="og:description"
          content="Discover and book tickets for amazing events with Grooviti."
        />
        <meta
          property="og:image"
          content="https://grooviti.com/Untitled_design-removebg-preview.png"
        />
        <meta property="og:url" content="https://grooviti.com" />
      </Helmet>

      <Header />
      <ExploreEvents category={category} setCategory={setCategory} />
      <EventDisplay category={category} />
      <TeamGrid />
    </div>
  );
};

export default Home;
