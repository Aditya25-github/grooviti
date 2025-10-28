import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./DiscoverTab.css";
import { motion } from "framer-motion";

const DiscoverTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("ai");
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { url, user } = useContext(StoreContext);
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState("");


  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const res = await axios.get(`${url}/api/community`);
      if (res.data.success) setCommunities(res.data.communities);
    } catch (err) {
      console.error("Error loading communities", err);
    }
  };

  useEffect(() => {
  decodeToken();
}, []);

const decodeToken = () => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserId(payload.id);
  } catch (err) {
    console.error("Token decode error");
  }
};

  const filtered = communities.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

const handleJoinCommunity = async (id) => {
  try {
    const res = await axios.post(
      `${url}/api/community/join/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success) {
      // Optional: toast message
      // toast.success(res.data.message || "Joined community!");
      fetchCommunities(); // refresh community list
    } else {
      console.error("Failed to join community");
    }
  } catch (err) {
    console.error("Error joining community:", err);
  }
};

const handleLeaveCommunity = async (id) => {
  try {
    const res = await axios.post(
      `${url}/api/community/leave/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success) {
      // Optional: toast message
      // toast.info(res.data.message || "Left community.");
      fetchCommunities(); // refresh community list
    } else {
      console.error("Failed to leave community");
    }
  } catch (err) {
    console.error("Error leaving community:", err);
  }
};



  return (
    <div className="discover-container">
      <h2 className="discover-title">Discover New Communities</h2>

      {/* Search */}
      <div className="discover-search">
        <input
          type="text"
          placeholder="Search communities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sub-tabs */}
      <div className="discover-tabs">
        <button
          className={activeSubTab === "ai" ? "active" : ""}
          onClick={() => setActiveSubTab("ai")}
        >
          🤖 AI Recommended
        </button>
        <button
          className={activeSubTab === "trending" ? "active" : ""}
          onClick={() => setActiveSubTab("trending")}
        >
          🔥 Trending
        </button>
        <button
          className={activeSubTab === "near" ? "active" : ""}
          onClick={() => setActiveSubTab("near")}
        >
          📍 Near You
        </button>
      </div>

      {/* Community list */}
      <div className="discover-list">
        {filtered.length === 0 ? (
          <p className="no-communities">No communities found</p>
        ) : (
          filtered.map((community, i) => (
            <motion.div
              key={community._id || i}
              className="discover-card"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={community.image?.url || "/default-community.jpg"}
                alt={community.name}
                className="discover-img"
              />

              <div className="discover-info">
                <h3>{community.name}</h3>
                <p className="discover-desc">{community.description}</p>

                <div className="discover-meta">
                  <span>{community.members.length} members</span>
                  <span>• {Math.floor(Math.random() * 20) + 5} mutual</span>
                </div>

                <div className="discover-actions">
                  {community.members.some((m) => m._id === user?._id) ? (
                    <button
                      className="leeeave-btn"
                      onClick={() => handleLeaveCommunity(community._id)}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      className="jooiin-btn"
                      onClick={() => handleJoinCommunity(community._id)}
                    >
                      Join Community
                    </button>
                  )}

                  <div className="match-chip">{Math.floor(Math.random() * 40) + 60}%</div>
                </div>

              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscoverTab;
