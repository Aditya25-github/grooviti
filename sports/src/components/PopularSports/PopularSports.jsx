import React from "react";
import "./PopularSports.css";
import { useNavigate } from "react-router-dom";
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
    route: "/badminton",
  },
  {
    name: "Football",
    image: football,
    route: "/football",
  },
  {
    name: "Cricket",
    image: cricket,
    route: "/cricket",
  },
  {
    name: "Swimming",
    image: swimming,
    route: "/swimming",
  },
  {
    name: "Tennis",
    image: tennis,
    route: "/tennis",
  },
  {
    name: "Table Tennis",
    image: tabletennis,
    route: "/table-tennis",
  },
];

const PopularSports = () => {
  const navigate = useNavigate();

  const handleClick = (route) => {
    navigate(route);
  };

  return (
    <div className="popular-sports-container">
      <h2 className="heading">Popular Sports</h2>
      <div className="card-list">
        {sports.map((sport, index) => (
          <div
            key={index}
            className="sport-card"
            onClick={() => handleClick(sport.route)}
          >
            <img src={sport.image} alt={sport.name} className="sport-img" />
            <div className="sport-name">{sport.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularSports;
