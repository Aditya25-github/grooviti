import React from "react";
import "./PopularSports.css";
import badminton from "../../assets/sports_assets/badminton.jpg.png";
import football from "../../assets/sports_assets/football.jpg.png";
import cricket from "../../assets/sports_assets/cricket.jpg.png";
import swimming from "../../assets/sports_assets/swimming.jpg.png"; 
import tennis from "../../assets/sports_assets/tennis.jpg.png";
import tabletennis from "../../assets/sports_assets/tabletennis.jpg.png";

const sports = [
  {
    name: "Badminton",
    image: badminton,
  },
  {
    name: "Football",
    image: football,
  },
  {
    name: "Cricket",
    image: cricket,
  },
  {
    name: "Swimming",
    image: swimming,
  },
  {
    name: "Tennis",
    image: tennis,
  },
  {
    name: "Table Tennis",
    image: tabletennis,
  },
];

const PopularSports = ({ onSportSelect }) => {
  const handleSportClick = (sportName) => {
    if (onSportSelect) {
      onSportSelect(sportName);
    }
  };

  return (
    <div className="popular-sports-container">
      <h2 className="heading">Popular Sports</h2>
      <div className="glass-container">
        <div className="card-list">
          {sports.map((sport, index) => (
            <div
              key={index}
              className="sport-card"
              onClick={() => handleSportClick(sport.name)}
            >
              <img src={sport.image} alt={sport.name} className="sport-img" />
              <div className="sport-name">{sport.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularSports;