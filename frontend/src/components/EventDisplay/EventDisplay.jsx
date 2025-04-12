import React, { useContext } from "react";
import { motion } from "framer-motion"; // Import motion
import "./EventDisplay.css";
import EventItem from "../EventItem/EventItem";
import { StoreContext } from "../../context/StoreContext";

const EventDisplay = ({ category }) => {
  const { myevents_list } = useContext(StoreContext);

  const listVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="event-display" id="event-display">
      <h2>Top Events Near You!</h2>
      <motion.div
        className="event-display-list"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {myevents_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <motion.div key={index} variants={itemVariants}>
                <EventItem
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  availableTickets={item.availableTickets}
                />
              </motion.div>
            );
          }
          return null;
        })}
      </motion.div>
    </div>
  );
};

export default EventDisplay;
