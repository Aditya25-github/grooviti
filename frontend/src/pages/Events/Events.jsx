import React, { useEffect, useState } from "react";
import ExploreEvents from "../../components/ExploreEvents/ExploreEvents";
import EventDisplay from "../../components/EventDisplay/EventDisplay";

const Events = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [category, setCategory] = useState("All");
  return (
    <div style={{ paddingTop: "95px" }}>
      <ExploreEvents category={category} setCategory={setCategory} />
      <EventDisplay category={category} />
    </div>
  );
};

export default Events;
