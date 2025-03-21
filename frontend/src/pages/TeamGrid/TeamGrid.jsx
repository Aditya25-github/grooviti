import React from "react";
import "./TeamGrid.css";

const teamMembers = [
  { name: "Aditya Divate", role: "CEO & Founder", image: "/images/adi.jpg" },
  { name: "Swaroop Mane", role: "CTO", image: "/images/swaroop1.jpg" },
  { name: "Saksham Gawande", role: "CMO", image: "/images/saksham1.jpg" },
  {
    name: "Siddhi Pankhade",
    role: "Lead Developer",
    image: "/images/Siddhi_P.JPG",
  },
  { name: "Bhagyesh Makhamale", role: "CFO", image: "/images/bhagyesh1.jpg" },
  { name: "Esha Pansare", role: "CDO", image: "/images/esha.jpg" },
  { name: "Samiksha Ner", role: "UI/UX Designer", image: "/images/sam.jpg" },
  { name: "Akash Patil", role: "Strategy Head", image: "/images/akash1.jpg" },
  { name: "Diksha Waghulde", role: "HR", image: "/images/diksha.jpg" },
  { name: "New Employee", role: "--", image: "/images/new.jpg" },
];

const TeamGrid = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="meet-team">Meet Our Team</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6 text-center team-card"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.role}</p>
            <p className="text-gray-700 mt-2">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamGrid;
