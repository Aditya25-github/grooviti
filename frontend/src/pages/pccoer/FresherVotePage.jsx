import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import {
  FaCrown,
  FaVoteYea,
  FaCheckCircle,
  FaUserTie,
  FaUserAlt,
  FaSpinner,
  FaArrowRight,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./FresherVotePage.css";

const FresherVotePage = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const { url, token } = useContext(StoreContext);
  const [hasVoted, setHasVoted] = useState({ Mr: false, Mrs: false });
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCategory, setSuccessCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const candidatesRes = await axios.get(
        `${url}/api/pccoer/fresher-party/candidates`
      );
      setCandidates(candidatesRes.data);

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
      window.dispatchEvent(new Event("open-login-popup"));
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
      setSuccessCategory(category);
      setShowSuccess(true);

      // Auto-close success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        // Redirect logic after voting
        if (category === "Mr") {
          setActiveCategory("Mrs");
        } else if (category === "Mrs") {
          setActiveCategory(null);
        }
      }, 2000);
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const handleVoteOtherCategory = (currentCategory) => {
    const otherCategory = currentCategory === "Mr" ? "Mrs" : "Mr";

    // Scroll to the other category
    const element = document.getElementById(`category-${otherCategory}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    setShowSuccess(false);
    setActiveCategory(null);
  };

  const navigateToCategory = (category) => {
    setActiveCategory(category);
  };

  const navigateBack = () => {
    setActiveCategory(null);
  };

  // Skeleton loading components
  const SkeletonCandidateCard = () => (
    <motion.div
      className="candidate-card skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="candidate-image skeleton-image"></div>
      <div className="candidate-details">
        <div className="skeleton-text" style={{ width: "80%" }}></div>
        <div className="skeleton-text-sm" style={{ width: "60%" }}></div>
      </div>
    </motion.div>
  );

  const CandidateCard = ({ candidate, category, inModal = false }) => (
    <motion.div
      className={`candidate-card ${inModal ? "modal-card" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: inModal ? 1.02 : 1.03 }}
      onClick={() => handleVote(candidate._id, category)}
    >
      <div className="candidate-image">
        <img src={candidate.image} alt={candidate.name} />
        <div className="vote-overlay">
          <FaVoteYea className="vote-icon" />
          <span>Vote Now</span>
        </div>
      </div>
      <div className="candidate-details">
        <h4>{candidate.name}</h4>
        <p className="department">{candidate.department}</p>
      </div>
    </motion.div>
  );

  const CategorySection = ({ category, candidates }) => {
    const categoryCandidates = candidates.filter(
      (c) => c.category === category
    );

    const visibleCandidates = categoryCandidates.slice(0, 2);
    const hasMore = categoryCandidates.length > 2;

    return (
      <motion.div
        className="category-section"
        id={`category-${category}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="category-header">
          <div className="header-content">
            {category === "Mr" ? (
              <FaUserTie className="icon" />
            ) : (
              <FaUserAlt className="icon" />
            )}
            <h3>{category}. Fresher</h3>
          </div>

          {hasMore && !hasVoted[category] && (
            <button
              className="view-all-btn"
              onClick={() => navigateToCategory(category)}
            >
              View All
              <FaArrowRight className="arrow-icon" />
            </button>
          )}

          {hasVoted[category] && (
            <div className="voted-tag">
              <FaCheckCircle /> Voted
            </div>
          )}
        </div>

        {hasVoted[category] ? (
          <div className="voted-confirmation">
            <FaCheckCircle className="success-icon" />
            <h3>You've voted for {category}. Fresher!</h3>
            <p>Thank you for participating in the election.</p>

            {!hasVoted[category === "Mr" ? "Mrs" : "Mr"] && (
              <button
                className="vote-other-btn"
                onClick={() => handleVoteOtherCategory(category)}
              >
                Vote for {category === "Mr" ? "Mrs" : "Mr"}. Fresher
                <FaArrowRight className="arrow-icon" />
              </button>
            )}
          </div>
        ) : (
          <div className="candidates-grid">
            {visibleCandidates.map((candidate, index) => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                category={category}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const CategoryViewPage = ({ category, candidates }) => {
    const categoryCandidates = candidates.filter(
      (c) => c.category === category
    );

    return (
      <div className="category-view-page">
        <div className="category-view-header">
          <button className="back-button" onClick={navigateBack}>
            <FaArrowLeft />
          </button>
          <h2>{category}. Fresher Candidates</h2>
        </div>

        <div className="category-candidates-grid">
          {categoryCandidates.map((candidate) => (
            <CandidateCard
              key={candidate._id}
              candidate={candidate}
              category={category}
              inModal={true}
            />
          ))}
        </div>

        {hasVoted[category] && (
          <div className="voted-confirmation">
            <FaCheckCircle className="success-icon" />
            <h3>You've already voted in this category!</h3>
            <p>Thank you for participating in the election.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fresher-vote-container">
      {/* Particles background */}
      <div className="particles">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 0.1, 0.3, 0],
              scale: [0, 1, 0.8, 0.5, 0],
              x: [0, Math.random() * 150 - 75],
              y: [0, Math.random() * 150 - 75],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
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

      {activeCategory ? (
        <CategoryViewPage category={activeCategory} candidates={candidates} />
      ) : (
        <>
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
            <h1>Fresher Party 2025</h1>
            <p>Cast your vote for Mr and Ms Fresher of PCCOE&R</p>
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
            <div className="voting-section">
              {["Mr", "Mrs"].map((category) => (
                <CategorySection
                  key={category}
                  category={category}
                  candidates={candidates}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-notification"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="notification-content">
              <FaCheckCircle className="success-icon" />
              <div>
                <h3>Vote Submitted!</h3>
                <p>You've successfully voted for {successCategory}. Fresher</p>
              </div>
            </div>

            {!hasVoted[successCategory === "Mr" ? "Mrs" : "Mr"] && (
              <button
                className="vote-other-btn"
                onClick={() => handleVoteOtherCategory(successCategory)}
              >
                Vote for {successCategory === "Mr" ? "Mrs" : "Mr"}. Fresher
                <FaArrowRight className="arrow-icon" />
              </button>
            )}

            <button
              className="close-notification"
              onClick={() => setShowSuccess(false)}
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FresherVotePage;
