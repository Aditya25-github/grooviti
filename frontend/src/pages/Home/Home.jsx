import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreEvents from "../../components/ExploreEvents/ExploreEvents";
import EventDisplay from "../../components/EventDisplay/EventDisplay";
import TeamGrid from "../TeamGrid/TeamGrid";

const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <div>
      <Header />
      <ExploreEvents category={category} setCategory={setCategory} />
      <EventDisplay category={category} />
      <TeamGrid />
      <TeamGrid />
    </div>
  );
};

export default Home;
