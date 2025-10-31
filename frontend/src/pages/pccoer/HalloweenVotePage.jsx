import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import {
  FaVoteYea,
  FaCheckCircle,
  FaUserAlt,
  FaUserFriends,
  FaGhost,
  FaCrown,
  FaArrowRight,
  FaArrowLeft,
  FaSpinner,
  FaUserTie,
  FaUsers,
  FaStar,
  FaFire,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import styles from "./Halloween.module.css";


const CATEGORY_LABELS = {
  bestDressed: "👗 Best Dressed",
  famousCharacter: "⭐ Most Famous Character",
  bestDuo: "👯 Best Duo",
};


const CATEGORY_COLORS = {
  bestDressed: "#7349AC",
  famousCharacter: "#EB6123",
  bestDuo: "#16a34a",
};


const CATEGORY_ICON = {
  bestDressed: FaCrown,
  famousCharacter: FaStar,
  bestDuo: FaUserFriends,
};


const HalloweenVotePage = () => {
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);
  const [width, height] = useWindowSize();

  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState({
    bestDressed: false,
    famousCharacter: false,
    bestDuo: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCategory, setSuccessCategory] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [votingCandidate, setVotingCandidate] = useState(null);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const candidatesRes = await axios.get(
        `${url}/api/pccoer/halloween/candidates`
      );
      setCandidates(candidatesRes.data.data || []);

      if (token) {
        const voteStatusRes = await axios.get(
          `${url}/api/pccoer/halloween/vote-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (voteStatusRes?.data?.hasVoted) {
          setHasVoted(voteStatusRes.data.hasVoted);
        }
      }
    } catch (err) {
      console.error("Error fetching Halloween voting data:", err);
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
      alert(`You have already voted in ${CATEGORY_LABELS[category]}!`);
      return;
    }

    try {
      setVotingCandidate(candidateId);
      
      await axios.post(
        `${url}/api/pccoer/halloween/vote`,
        { candidateId, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHasVoted((prev) => ({ ...prev, [category]: true }));
      setSuccessCategory(category);
      setShowSuccess(true);
      setShowConfetti(true);

      setTimeout(() => {
        setShowSuccess(false);
        setShowConfetti(false);
        setActiveCategory(null);
        setVotingCandidate(null);
      }, 4000);
    } catch (err) {
      console.error("Error submitting vote:", err);
      setVotingCandidate(null);

      if (err.response?.status === 409) {
        alert(`⚠️ You have already voted in ${CATEGORY_LABELS[category]}!`);
        setHasVoted((prev) => ({ ...prev, [category]: true }));
      } else if (err.response?.status === 401) {
        alert("Please log in again to vote.");
        window.dispatchEvent(new Event("open-login-popup"));
      } else {
        alert(
          "Something went wrong while submitting your vote. Please try again later."
        );
      }
    }
  };

  const CategoryHeader = ({ category }) => {
    const Icon = CATEGORY_ICON[category] || FaUsers;
    
    return (
      <div className={styles.categoryHeader}>
        <div className={styles.headerContent}>
          <div 
            className={styles.categoryIconWrapper}
            style={{ background: CATEGORY_COLORS[category] }}
          >
            <Icon className={styles.headerIcon} />
          </div>
          <div className={styles.headerText}>
            <h3>{CATEGORY_LABELS[category]}</h3>
            <p className={styles.categorySubtitle}>
              {hasVoted[category] 
                ? "✓ You've voted in this category" 
                : "Click on a candidate to cast your vote"}
            </p>
          </div>
        </div>
        {hasVoted[category] && (
          <div className={styles.votedTag}>
            <FaCheckCircle /> Voted
          </div>
        )}
      </div>
    );
  };

  const CandidateCard = ({ candidate, category, compact }) => {
    const isVoting = votingCandidate === candidate._id;
    
    return (
      <motion.div
        className={`${styles.candidateCard} ${compact ? styles.compact : ""} ${
          hasVoted[category] ? styles.disabled : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={!hasVoted[category] ? { scale: 1.03, y: -5 } : {}}
        whileTap={!hasVoted[category] ? { scale: 0.98 } : {}}
        onClick={() => !hasVoted[category] && handleVote(candidate._id, category)}
      >
        <div className={styles.candidateImage}>
          <img src={candidate.image} alt={candidate.name} loading="lazy" />
          {!hasVoted[category] && (
            <div className={styles.voteOverlay}>
              {isVoting ? (
                <>
                  <FaSpinner className={`${styles.voteIcon} ${styles.spinning}`} />
                  <span>Voting...</span>
                </>
              ) : (
                <>
                  <FaVoteYea className={styles.voteIcon} />
                  <span>Vote Now</span>
                </>
              )}
            </div>
          )}
          {hasVoted[category] && (
            <div className={styles.votedOverlay}>
              <FaCheckCircle className={styles.checkIcon} />
            </div>
          )}
        </div>
        <div className={styles.candidateDetails}>
          <h4 title={candidate.name}>{candidate.name}</h4>
          {candidate.meta && (
            <p className={styles.meta} title={candidate.meta}>
              {candidate.meta}
            </p>
          )}
        </div>
        <div 
          className={styles.candidateBorder}
          style={{ background: CATEGORY_COLORS[category] }}
        />
      </motion.div>
    );
  };

  const CategorySection = ({ category }) => {
    const list = candidates.filter((c) => c.category === category);
    const visible = list.slice(0, 2); // Show only 2 candidates
    const hasMore = list.length > 2; // Check if more than 2 candidates exist

    return (
      <motion.div
        className={styles.categorySection}
        id={`category-${category}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CategoryHeader category={category} />
        {hasVoted[category] ? (
          <motion.div 
            className={styles.votedConfirmation}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <FaCheckCircle className={styles.successIcon} />
            <h3>Thank You for Voting!</h3>
            <p>Your vote in {CATEGORY_LABELS[category]} has been recorded.</p>
          </motion.div>
        ) : (
          <>
            <div className={styles.candidatesGrid}>
              {visible.map((c, index) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CandidateCard candidate={c} category={category} />
                </motion.div>
              ))}
              {visible.length === 0 && (
                <div className={styles.emptyState}>
                  <FaGhost className={styles.emptyIcon} />
                  <p>No candidates yet.</p>
                </div>
              )}
            </div>
            {hasMore && (
              <button
                className={styles.viewAllBtnBottom}
                onClick={() => setActiveCategory(category)}
              >
                View All {list.length} Candidates <FaArrowRight className={styles.arrowIcon} />
              </button>
            )}
          </>
        )}
      </motion.div>
    );
  };

  const CategoryViewPage = ({ category }) => {
    const list = candidates.filter((c) => c.category === category);
    const Icon = CATEGORY_ICON[category] || FaUsers;

    return (
      <motion.div 
        className={styles.categoryViewPage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={styles.categoryViewHeader}>
          <button
            className={styles.backButton}
            onClick={() => setActiveCategory(null)}
          >
            <FaArrowLeft /> Back
          </button>
          <div className={styles.categoryViewTitle}>
            <div 
              className={styles.categoryIconWrapper}
              style={{ background: CATEGORY_COLORS[category] }}
            >
              <Icon className={styles.headerIcon} />
            </div>
            <h2>{CATEGORY_LABELS[category]}</h2>
          </div>
        </div>
        <div className={styles.categoryCandidatesGrid}>
          {list.map((c, index) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CandidateCard candidate={c} category={category} compact />
            </motion.div>
          ))}
          {list.length === 0 && (
            <div className={styles.emptyState}>
              <FaGhost className={styles.emptyIcon} />
              <p>No candidates available.</p>
            </div>
          )}
        </div>
        {hasVoted[category] && (
          <motion.div 
            className={styles.votedConfirmation}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <FaCheckCircle className={styles.successIcon} />
            <h3>You've already voted here!</h3>
            <p>Only one vote per category is allowed.</p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Enhanced floating particles
  const Particles = () => (
    <div className={styles.particles}>
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.particle}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.3, 0.15, 0.3, 0],
            scale: [0, 1.2, 0.9, 0.6, 0],
            x: [0, Math.random() * 200 - 100],
            y: [0, -Math.random() * 200],
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          style={{
            background:
              i % 4 === 0
                ? "#EB6123"
                : i % 4 === 1
                ? "#7349AC"
                : i % 4 === 2
                ? "#16a34a"
                : "#FFD401",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );

  // Floating Halloween emojis
  const FloatingEmojis = () => (
    <div className={styles.floatingEmojis}>
      {['🎃', '👻', '🦇', '🕷️', '💀', '🕸️'].map((emoji, i) => (
        <motion.div
          key={i}
          className={styles.floatingEmoji}
          initial={{ opacity: 0, y: -50 }}
          animate={{
            opacity: [0, 0.6, 0.4, 0.6, 0],
            y: [0, Math.random() * 300 + 200],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
          }}
          style={{
            left: `${(i * 16) + Math.random() * 10}%`,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );

  const allVoted = hasVoted.bestDressed && hasVoted.famousCharacter && hasVoted.bestDuo;

  return (
    <div className={styles.halloweenContainer}>
      <Particles />
      <FloatingEmojis />
      
      {/* Confetti on successful vote */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
        }}>
          <Confetti 
            width={width} 
            height={height}
            numberOfPieces={400}
            recycle={false}
            gravity={0.3}
            colors={['#7349AC', '#EB6123', '#16a34a', '#ff6b00', '#FFD401', '#ff1493']}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeCategory ? (
          <CategoryViewPage category={activeCategory} key="category-view" />
        ) : (
          <motion.div
            key="main-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.header
              className={styles.voteHeader}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className={styles.headerBadge}
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 250, delay: 0.2 }}
              >
                <FaGhost />
              </motion.div>
              <h1>🎃 Halloween Costume Contest 2025 🎃</h1>
              <p>Cast your spooky votes in three thrilling categories</p>
              
              {allVoted && (
                <motion.div 
                  className={styles.allVotedBanner}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  <FaCheckCircle /> You've voted in all categories! 🎉
                </motion.div>
              )}
              
              <div className={styles.votingProgress}>
                <div className={styles.progressBar}>
                  <motion.div 
                    className={styles.progressFill}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(Object.values(hasVoted).filter(Boolean).length / 3) * 100}%` 
                    }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  />
                </div>
                <p className={styles.progressText}>
                  {Object.values(hasVoted).filter(Boolean).length} of 3 categories voted
                </p>
              </div>
              
              <div className={styles.headerDivider}></div>
            </motion.header>

            {isLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}>
                  <FaSpinner className={styles.spinnerIcon} />
                </div>
                <p>Summoning spooky candidates...</p>
              </div>
            ) : (
              <div className={styles.votingSection}>
                <CategorySection category="bestDressed" />
                <CategorySection category="famousCharacter" />
                <CategorySection category="bestDuo" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className={styles.successNotification}
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className={styles.notificationContent}>
              <div 
                className={styles.notificationIcon}
                style={{ background: CATEGORY_COLORS[successCategory] }}
              >
                <FaCheckCircle />
              </div>
              <div className={styles.notificationText}>
                <h3>Vote Submitted! 🎉</h3>
                <p>
                  You've successfully voted in{" "}
                  {CATEGORY_LABELS[successCategory]}
                </p>
              </div>
            </div>
            <button
              className={styles.closeNotification}
              onClick={() => setShowSuccess(false)}
            >
              ✖
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HalloweenVotePage;
