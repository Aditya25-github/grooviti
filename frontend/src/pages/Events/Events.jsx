import React, { useEffect, useState } from "react";
import ExploreEvents from "../../components/ExploreEvents/ExploreEvents";
import EventDisplay from "../../components/EventDisplay/EventDisplay";
import { motion } from "framer-motion";

const Events = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [category, setCategory] = useState("All");
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div style={{ paddingTop: "95px" }}>
        <ExploreEvents category={category} setCategory={setCategory} />
        <EventDisplay category={category} />
      </div>
    </motion.div>
  );
};

export default Events;
