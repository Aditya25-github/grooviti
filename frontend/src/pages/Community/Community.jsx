import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Community.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiSearch, FiX, FiUsers, FiMessageSquare, FiTrendingUp } from "react-icons/fi";


const Community = () => {
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const { url } = useContext(StoreContext);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");


  const navigate = useNavigate();


  useEffect(() => {
    fetchCommunities();
    decodeToken();
  }, []);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    let results = communities.filter(
      (community) =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Apply additional filters
    if (activeFilter === "joined") {
      results = results.filter(community => 
        community.members.some(m => m._id === userId)
      );
    } else if (activeFilter === "popular") {
      results = results.sort((a, b) => b.members.length - a.members.length);
    }


    setFilteredCommunities(results);
  }, [searchTerm, communities, activeFilter, userId]);


  const decodeToken = () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    } catch (err) {
      console.error("Token decode error");
    }
  };


  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/community`);
      if (res.data.success) {
        setCommunities(res.data.communities);
        setFilteredCommunities(res.data.communities);
      }
    } catch (err) {
      toast.error("Failed to load communities");
    } finally {
      setLoading(false);
    }
  };


  const handleJoinLeave = async (id, joined) => {
    try {
      const endpoint = `${url}/api/community/${
        joined ? "leave" : "join"
      }/${id}`;
      const res = await axios.post(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );


      if (res.data.success) {
        toast.success(res.data.message);
        fetchCommunities();
      }
    } catch (err) {
      toast.error("Action failed");
    }
  };


  const goToCommunityPage = (id) => {
    navigate(`/community/${id}`);
  };


  const createCommunity = async () => {
    if (!newCommunity.name.trim()) {
      toast.error("Community name is required");
      return;
    }


    const formData = new FormData();
    formData.append("name", newCommunity.name);
    formData.append("description", newCommunity.description);
    if (newCommunity.image) {
      formData.append("image", newCommunity.image);
    }


    try {
      const res = await axios.post(`${url}/api/community/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCommunities();
        setShowModal(false);
        setNewCommunity({
          name: "",
          description: "",
          image: null,
        });
      } else {
        toast.error("Creation failed");
      }
    } catch (err) {
      toast.error("Error creating community");
    }
  };


  const FilterButton = ({ filter, label, icon }) => (
    <motion.button
      className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
      onClick={() => setActiveFilter(filter)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      {label}
    </motion.button>
  );


  return (
    <div className="community_page" style={{ paddingTop: "95px" }}>
      <div className="community-header">
        <motion.h1
          className="header-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Explore Communities
        </motion.h1>
        <motion.p
          className="header-description"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Join communities that match your interests and connect with
          like-minded people
        </motion.p>


        <motion.div 
          className="community-actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="search-baar">
            <FiSearch className="search-icoon" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>


          {token && (
            <motion.button
              className="create-community-btn"
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus /> Create Community
            </motion.button>
          )}
        </motion.div>


        <motion.div 
          className="filter-tabs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <FilterButton filter="all" label="All Communities" />
          {token && <FilterButton filter="joined" label="Joined" icon={<FiUsers />} />}
          <FilterButton filter="popular" label="Popular" icon={<FiTrendingUp />} />
        </motion.div>
      </div>


      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-box"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Create New Community</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  <FiX />
                </button>
              </div>


              <div className="form-group">
                <label>Community Name</label>
                <input
                  type="text"
                  placeholder="Enter community name"
                  value={newCommunity.name}
                  onChange={(e) =>
                    setNewCommunity({ ...newCommunity, name: e.target.value })
                  }
                />
              </div>


              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="What's this community about?"
                  value={newCommunity.description}
                  onChange={(e) =>
                    setNewCommunity({
                      ...newCommunity,
                      description: e.target.value,
                    })
                  }
                />
              </div>


              <div className="form-group">
                <label>Community Image</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewCommunity({
                        ...newCommunity,
                        image: e.target.files[0],
                      })
                    }
                  />
                  <span>Choose file</span>
                  {newCommunity.image && (
                    <span className="file-name">{newCommunity.image.name}</span>
                  )}
                </div>
              </div>


              <div className="modal-actions">
                <motion.button
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="create-btn"
                  onClick={createCommunity}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!newCommunity.name.trim()}
                >
                  Create Community
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading communities...</p>
        </div>
      ) : filteredCommunities.length === 0 ? (
        <motion.div 
          className="no-communities"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FiUsers size={64} className="no-communities-icon" />
          <h3>No communities found</h3>
          <p>Try a different search or create your own community</p>
          {token && (
            <motion.button
              className="create-community-btn"
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus /> Create Your First Community
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="community-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredCommunities.map((community, index) => {
            const joined = community.members.some((m) => m._id === userId);
            return (
              <motion.div
                className="community-card"
                key={community._id}
                onClick={() => goToCommunityPage(community._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  boxShadow: "0 15px 35px rgba(52, 152, 219, 0.15)" 
                }}
              >
                <div className="card-image">
                  <img
                    src={community.image?.url || "/default-community.jpg"}
                    alt={community.name}
                    onError={(e) => {
                      e.target.src = "/default-community.jpg";
                    }}
                  />
                  {joined && <div className="joined-badge">Joined</div>}
                </div>


                <div className="card-content">
                  <div className="community-header-row">
                    <h4>{community.name}</h4>
                    {community.members.length > 50 && (
                      <FiTrendingUp className="trending-icon" title="Popular Community" />
                    )}
                  </div>
                  <p className="description">{community.description}</p>


                  <div className="card-stats">
                    <div className="stat">
                      <FiUsers className="stat-icon" />
                      <span className="stat-value">
                        {community.members.length}
                      </span>
                      <span className="stat-label">Members</span>
                    </div>
                    <div className="stat">
                      <FiMessageSquare className="stat-icon" />
                      <span className="stat-value">{community.posts || 0}</span>
                      <span className="stat-label">Posts</span>
                    </div>
                  </div>
                </div>


                <div className="cardd-actions">
                  <motion.button
                    className={joined ? "leave-btn" : "joooin-btn"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinLeave(community._id, joined);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {joined ? "Leave" : "Join Community"}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};


export default Community;
