import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./PccoerPage.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  FaVoteYea,
  FaImages,
  FaCalendarAlt,
  FaUserFriends,
  FaArrowRight,
  FaUsers,
  FaRegSmile,
} from "react-icons/fa";

const PccoerPage = () => {
  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [activeTab, setActiveTab] = useState("communities");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async () => {
    try {
      const eventsRes = await axios.get(`${url}/api/pccoer/events`);
      const communityRes = await axios.get(`${url}/api/pccoer/communities`);
      setEvents(eventsRes.data);
      setCommunities(communityRes.data);
    } catch (error) {
      console.error("Error fetching PCCoER data:", error);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/pccoer/events/${eventId}`);
  };

  const handleCommunityClick = (communityId) => {
    navigate(`/pccoer/communities/${communityId}`);
  };

  return (
    <div className="pccoer-page" style={{ paddingTop: "95px" }}>
      {/* Navigation Tabs */}
      <div className="tab-container">
        {/* <button
          className={`tab-button ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          <FaCalendarAlt className="tab-icon" /> Events
        </button> */}
        <button
          className={`tab-button ${
            activeTab === "communities" ? "active" : ""
          }`}
          onClick={() => setActiveTab("communities")}
        >
          <FaUsers className="tab-icon" /> Communities
        </button>
      </div>

      {/* Events Section */}
      {activeTab === "events" && (
        <section className="events-section">
          <div className="section-header">
            <h2>
              <FaCalendarAlt /> Events by PCCoER
            </h2>
            <p>Upcoming and past events organized by PCCoER</p>
          </div>
          <div className="card-grid">
            {events.map((event) => (
              <div
                className="event-card"
                key={event._id}
                onClick={() => handleEventClick(event._id)}
              >
                <div className="card-image-container">
                  <img src={event.coverImage} alt={event.name} />
                  <div className="event-date">{event.date}</div>
                </div>
                <div className="card-content">
                  <h3>{event.name}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="learn-more-btn">
                    View Details <FaArrowRight />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Communities Section */}
      {activeTab === "communities" && (
        <section className="communities-section">
          <div className="section-header">
            <h2>
              <FaUserFriends /> Communities by PCCoER
            </h2>
            <p>Join our vibrant student communities</p>
          </div>
          <div className="card-grid">
            {communities.map((community) => (
              <div
                className="community-card"
                key={community._id}
                onClick={() => handleCommunityClick(community._id)}
              >
                <div className="card-logo-container">
                  <img src={community.logo} alt={community.name} />
                </div>
                <div className="card-content">
                  <h3>{community.name}</h3>
                  <p className="community-description">
                    {community.description}
                  </p>
                  <div className="join-btn">
                    Explore Community <FaArrowRight />
                  </div>
                </div>
              </div>
            ))}

            {/* Fresher Party Special Card */}
            <div className="fresher-card">
              <div
                className="card-image-container"
                onClick={() => navigate("/pccoer")}
              >
                <img src="/images/freshersParty.PNG" alt="Fresher Party" />
              </div>
              <div className="card-content">
                <h3>
                  <FaRegSmile /> Fresher Party
                </h3>
                <p>Vote for Mr. & Mrs. Fresher and view the gallery!</p>
                <div className="action-buttons">
                  <button
                    className="vote-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/pccoer/vote");
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                  >
                    <FaVoteYea /> Vote Now
                  </button>
                  <button
                    className="gallery-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/pccoer/gallery");
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                  >
                    <FaImages /> Gallery
                  </button>
                </div>
              </div>
            </div>

            {/* Halloween Special Card */}
            <div className="fresher-card">
              <div
                className="card-image-container"
                onClick={() => navigate("/pccoer/halloween")}
              >
                <img
                  src="/images/halloween.png"
                  alt="Halloween Costume Contest"
                />
              </div>
              <div className="card-content">
                <h3>
                  <FaRegSmile /> Halloween Costume Contest
                </h3>
                <p>Vote for the best costumes and browse spooky moments!</p>
                <div className="action-buttons">
                  <button
                    className="vote-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/pccoer/halloween/vote");
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                  >
                    <FaVoteYea /> Vote Now
                  </button>
                  <button
                    className="gallery-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/pccoer/halloween/gallery");
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                  >
                    <FaImages /> Gallery
                  </button>
                </div>
              </div>
            </div>
            {/* End Halloween Special Card */}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to be part of PCCoER?</h2>
          <p>
            Join our community to stay updated with all events and activities
          </p>
          <button className="cta-button">Join PCCoER Community</button>
        </div>
      </section>
    </div>
  );
};

export default PccoerPage;
