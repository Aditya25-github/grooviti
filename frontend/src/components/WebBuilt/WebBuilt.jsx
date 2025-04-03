import React from "react";
import "./WebBuilt.css";

const WebBuilt = () => {
  const techStack = [
    "React", "JavaScript", "CSS", "Tailwind CSS", "Node.js", "Express", "MongoDB"
  ];

  return (
    <div className="techstack-container">
      <h2 className="techstack-title">
        What Our Website is Built With
      </h2>
      <div className="techstack-list">
        {techStack.map((tech, index) => (
          <span key={index} className="techstack-item">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WebBuilt; 
