// src/pages/pccoer/PccoerPage.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./PccoerPage.css";
import { StoreContext } from "../../context/StoreContext";

const PccoerPage = () => {
  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const { url } = useContext(StoreContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const eventsRes = await axios.get(`${url}/api/pccoer/events`);
      const communityRes = await axios.get(`${url}/api/pccoer/communities`);

      console.log("Events Response:", eventsRes.data);
      console.log("Communities Response:", communityRes.data);

      setEvents(eventsRes.data);
      setCommunities(communityRes.data);
    } catch (error) {
      console.error("Error fetching PCCoER data:", error);
    }
  };

  return (
    <div className="pccoer-container" style={{ paddingTop: "95px" }}>
      <h1>PCCoER Hub</h1>

      <section className="section">
        <h2>Events by PCCoER</h2>
        <div className="card-grid">
          {events.map((event) => (
            <div className="card" key={event._id}>
              <img src={event.coverImage} alt={event.name} />
              <h3>{event.name}</h3>
              <p>{event.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Communities by PCCoER</h2>
        <div className="card-grid">
          {communities.map((community) => (
            <div className="card" key={community._id}>
              <img src={community.logo} alt={community.name} />
              <h3>{community.name}</h3>
              <p>{community.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section join-community">
        <h2>Join PCCoER Community</h2>
        <button className="join-btn">Join Now</button>
      </section>
    </div>
  );
};

export default PccoerPage;
