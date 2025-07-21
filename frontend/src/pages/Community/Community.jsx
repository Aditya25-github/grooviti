import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Community.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";

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

  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
    decodeToken();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const results = communities.filter(
      (community) =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCommunities(results);
  }, [searchTerm, communities]);

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

  return (
    <div className="community_page" style={{ paddingTop: "95px" }}>
      <div className="community-header">
        <h1>Explore Communities</h1>
        <p>
          Join communities that match your interests and connect with
          like-minded people
        </p>

        <div className="community-actions">
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus /> Create Community
            </motion.button>
          )}
        </div>
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
        <div className="no-communities">
          <h3>No communities found</h3>
          <p>Try a different search or create your own community</p>
        </div>
      ) : (
        <motion.div
          className="community-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredCommunities.map((community) => {
            const joined = community.members.some((m) => m._id === userId);
            return (
              <motion.div
                className="community-card"
                key={community._id}
                onClick={() => goToCommunityPage(community._id)}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-image">
                  <img
                    src={community.image?.url || "/default-community.jpg"}
                    alt={community.name}
                    onError={(e) => {
                      e.target.src = "/default-community.jpg";
                    }}
                  />
                </div>

                <div className="card-content">
                  <h4>{community.name}</h4>
                  <p className="description">{community.description}</p>

                  <div className="card-stats">
                    <div className="stat">
                      <span className="stat-value">
                        {community.members.length}
                      </span>
                      <span className="stat-label">Members</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{community.posts || 0}</span>
                      <span className="stat-label">Posts</span>
                    </div>
                  </div>
                </div>

                <div className="cardd-actions">
                  <motion.button
                    className={joined ? "leave-btn" : "join-btn"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinLeave(community._id, joined);
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {joined ? "Leave" : "Join"}
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
