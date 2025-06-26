import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Community.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Community = () => {
  const [communities, setCommunities] = useState([]);
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const { url } = useContext(StoreContext);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    image: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
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

  const fetchCommunities = async () => {
    try {
      const res = await axios.get(`${url}/api/community`);
      if (res.data.success) {
        setCommunities(res.data.communities);
      }
    } catch (err) {
      toast.error("Failed to load communities");
    }
  };

  const handleJoinLeave = async (id, joined) => {
    try {
      const url = `${url}/api/community/${joined ? "leave" : "join"}/${id}`;
      const res = await axios.post(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchCommunities(); // refresh
      }
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const goToCommunityPage = (id) => {
    navigate(`/community/${id}`);
  };

  return (
    <div className="community-page" style={{ paddingTop: "95px" }}>
      <h2>Explore Communities</h2>
      {token && (
        <button
          className="create-community-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Community
        </button>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Create Community</h3>
            <input
              type="text"
              placeholder="Community Name"
              value={newCommunity.name}
              onChange={(e) =>
                setNewCommunity({ ...newCommunity, name: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={newCommunity.description}
              onChange={(e) =>
                setNewCommunity({
                  ...newCommunity,
                  description: e.target.value,
                })
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewCommunity({ ...newCommunity, image: e.target.files[0] })
              }
            />
            <div className="modal-actions">
              <button
                onClick={async () => {
                  const formData = new FormData();
                  formData.append("name", newCommunity.name);
                  formData.append("description", newCommunity.description);
                  if (newCommunity.image) {
                    formData.append("image", newCommunity.image);
                  }

                  try {
                    const res = await axios.post(
                      `${url}/api/community/create`,
                      formData,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );
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
                }}
              >
                Create
              </button>

              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="community-list">
        {communities.map((community) => {
          const joined = community.members.some((m) => m._id === userId);
          return (
            <div
              className="community-card"
              key={community._id}
              onClick={() => goToCommunityPage(community._id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={community.image?.url || "/default.jpg"}
                alt={community.name}
              />
              <h4>{community.name}</h4>
              <p>{community.description}</p>
              <button
                className={joined ? "leave-btn" : "join-btn"}
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigation
                  handleJoinLeave(community._id, joined);
                }}
              >
                {joined ? "Leave" : "Join"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Community;
