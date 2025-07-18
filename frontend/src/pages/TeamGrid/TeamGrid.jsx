import React from "react";
import "./TeamGrid.css";
import { motion } from "framer-motion";

// Team data
const teamMembers = [
  {
    name: "Aditya Divate",
    role: "CEO & Founder",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/adi.jpg",
  },
  {
    name: "Swaroop Mane",
    role: "CTO",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/swaroop1.jpg",
  },
  {
    name: "Saksham Gawande",
    role: "CMO",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/saksham1.jpg",
  },
  {
    name: "Siddhi Pankhade",
    role: "Lead Developer",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/Siddhi_P.JPG",
  },
  {
    name: "Samiksha Ner",
    role: "UI/UX Designer",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/sam.jpg",
  },
  {
    name: "Esha Pansare",
    role: "CDO",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/esha.jpg",
  },
  {
    name: "Akash Patil",
    role: "Strategy Head",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/akash1.jpg",
  },
  {
    name: "Diksha Waghulde",
    role: "HR",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/diksha.jpg",
  },
];

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const TeamGrid = () => {
  return (
    <motion.div
      className="home-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto p-6">
        <motion.h1
          className="meet-team"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Meet Our Team
        </motion.h1>
        <div className="team-scroll-wrapper">
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-xl rounded-xl p-6 text-center team-card"
                variants={cardVariants}
                initial={{ y: 0 }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                }}
                animate={{ y: 0, transition: { duration: 0 } }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamGrid;
