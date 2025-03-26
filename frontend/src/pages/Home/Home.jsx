import React, { useState, useEffect } from "react";
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
      <Header />
      <ExploreEvents category={category} setCategory={setCategory} />
      <EventDisplay category={category} />
      <TeamGrid />
    </div>
  );
};

export default Home;
