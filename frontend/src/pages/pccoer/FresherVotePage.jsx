import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import {
  FaCrown,
  FaVoteYea,
  FaCheckCircle,
  FaUserTie,
  FaUserAlt,
  FaSpinner,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./FresherVotePage.css";

const FresherVotePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [winners, setWinners] = useState({ mr: null, mrs: null });
  const { url, token } = useContext(StoreContext);
  const [hasVoted, setHasVoted] = useState({ Mr: false, Mrs: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [candidatesRes, winnersRes] = await Promise.all([
        axios.get(`${url}/api/pccoer/fresher-party/candidates`),
        axios.get(`${url}/api/pccoer/fresher-party/winners`),
      ]);

      setCandidates(candidatesRes.data);
      setWinners(winnersRes.data);

      if (token) {
        const voteStatusRes = await axios.get(
          `${url}/api/pccoer/fresher-party/vote-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHasVoted(voteStatusRes.data.hasVoted);
      }
    } catch (error) {
      console.error("Error fetching voting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (candidateId, category) => {
    if (!token) {
      alert("Please login to vote!");
      return;
    }

    if (hasVoted[category]) {
      alert(`You have already voted in ${category} category!`);
      return;
    }

    try {
      await axios.post(
        `${url}/api/pccoer/fresher-party/vote`,
        { candidateId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHasVoted((prev) => ({ ...prev, [category]: true }));
      fetchData();
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  // Skeleton loading components
  const SkeletonWinnerCard = () => (
    <motion.div
      className="winner-card skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="winner-header skeleton-header"></div>
      <div className="winner-content">
        <div className="skeleton-image"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text-sm"></div>
        <div className="skeleton-votes"></div>
      </div>
    </motion.div>
  );

  const SkeletonCandidateCard = () => (
    <motion.div
      className="candidate-card skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="candidate-image skeleton-image"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text-sm"></div>
      <div className="skeleton-button"></div>
    </motion.div>
  );

  return (
    <div className="fresher-vote-container" style={{ paddingTop: "95px" }}>
      {/* Floating Particles Background */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0.2, 0.4, 0],
              scale: [0, 1, 0.8, 0.5, 0],
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
            }}
            transition={{
              duration: 8 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              background:
                i % 3 === 0 ? "#ff6000" : i % 3 === 1 ? "#4a6cf7" : "#ffb400",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.header
        className="vote-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="header-badge"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
        >
          <FaCrown />
        </motion.div>
        <h1>Fresher Party 2023</h1>
        <p>Vote for your favorite candidates</p>
        <div className="header-divider"></div>
      </motion.header>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
          <p>Loading voting data...</p>
        </div>
      ) : (
        <>
          <section className="winners-section">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FaCrown className="icon" /> Current Winners
            </motion.h2>

            <div className="winners-grid">
              {["Mr", "Mrs"].map((cat, i) =>
                winners[cat.toLowerCase()] ? (
                  <motion.div
                    className="winner-card"
                    key={cat}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="winner-header">
                      <h3>{cat}. Fresher</h3>
                    </div>
                    <div className="winner-content">
                      <div className="winner-image-container">
                        <img
                          src={winners[cat.toLowerCase()].image}
                          alt={winners[cat.toLowerCase()].name}
                        />
                        <span className="winner-badge">WINNER</span>
                      </div>
                      <h4>{winners[cat.toLowerCase()].name}</h4>
                      <p className="department">
                        {winners[cat.toLowerCase()].department}
                      </p>
                      <div className="vote-count">
                        <span>{winners[cat.toLowerCase()].votes}</span> votes
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <SkeletonWinnerCard key={cat} />
                )
              )}
            </div>
          </section>

          <section className="voting-section">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Cast Your Vote
            </motion.h2>

            {["Mr", "Mrs"].map((category, i) => (
              <motion.div
                className="category-section"
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.2 }}
              >
                <div className="category-header">
                  {category === "Mr" ? (
                    <FaUserTie className="icon" />
                  ) : (
                    <FaUserAlt className="icon" />
                  )}
                  <h3>{category}. Fresher</h3>
                  {hasVoted[category] && (
                    <div className="voted-tag">
                      <FaCheckCircle /> Voted
                    </div>
                  )}
                </div>

                {hasVoted[category] ? (
                  <motion.div
                    className="voted-confirmation"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <FaCheckCircle className="success-icon" />
                    <h3>You have voted in {category} category</h3>
                    <p>
                      Thank you for participating! Results will be announced
                      soon.
                    </p>
                  </motion.div>
                ) : (
                  <div className="candidates-grid">
                    {candidates
                      .filter((c) => c.category === category)
                      .map((candidate, index) => (
                        <motion.div
                          key={candidate._id}
                          className="candidate-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="candidate-image">
                            <img src={candidate.image} alt={candidate.name} />
                          </div>
                          <h4>{candidate.name}</h4>
                          <p className="department">{candidate.department}</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleVote(candidate._id, category)}
                            className="vote-button"
                          >
                            <FaVoteYea /> Vote Now
                          </motion.button>
                        </motion.div>
                      ))}
                  </div>
                )}
              </motion.div>
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default FresherVotePage;
