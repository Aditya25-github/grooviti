// Whygrooviti.jsx
import { useState } from "react";
import "./WhyGrooviti.css";
import { motion } from "framer-motion";

const items = [
  { title: "Nature", image: "" },
  { title: "Portrait", image: "images/22.jpg" },
  {
    title: "Abstract",
    image: "https://via.placeholder.com/300x400?text=Abstract",
  },
  {
    title: "Architecture",
    image: "https://via.placeholder.com/300x400?text=Architecture",
  },
  {
    title: "Minimal",
    image: "https://via.placeholder.com/300x400?text=Minimal",
  },
  { title: "Pop", image: "https://via.placeholder.com/300x400?text=Pop" },
];

export default function WhyGrooviti() {
  const [activeIndex, setActiveIndex] = useState(2); // Default to third item

  return (
    <div className="grooviti-container">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`card ${activeIndex === index ? "active" : ""}`}
          onClick={() => setActiveIndex(index)}
          animate={{ flex: activeIndex === index ? 3 : 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-inner">
            <p className="card-title">{item.title}</p>
            {activeIndex === index && (
              <div className="card-content">
                <img src={item.image} alt={item.title} className="card-img" />
              </div>
            )}
          </div>
        </motion.div>
      ))}

      <div className="info-panel">
        <h2>Why Choose Grooviti?</h2>
        <p>
          Grooviti brings seamless interactions, fluid motion, and modern
          visuals all in one place. It’s your go-to toolkit for creating
          standout digital experiences — stylish, responsive, and groovy.
        </p>
        <button className="explore-btn">Explore</button>
      </div>
    </div>
  );
}
