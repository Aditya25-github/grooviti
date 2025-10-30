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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Halloween.module.css";

const CATEGORY_LABELS = {
  bestDressed: "🏆 Best Dressed",
  famousCharacter: "🌟 Most Famous Character",
  bestDuo: "🤝 Best Duo",
};

const CATEGORY_ICON = {
  bestDressed: FaCrown,
  famousCharacter: FaGhost,
  bestDuo: FaUserFriends,
};

const HalloweenVotePage = () => {
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);

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
      await axios.post(
        `${url}/api/pccoer/halloween/vote`,
        { candidateId, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHasVoted((prev) => ({ ...prev, [category]: true }));
      setSuccessCategory(category);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setActiveCategory(null);
      }, 2000);
    } catch (err) {
      console.error("Error submitting vote:", err);

      if (err.response?.status === 409) {
        // Backend says the user already voted
        alert(`⚠️ You have already voted in ${CATEGORY_LABELS[category]}!`);
        setHasVoted((prev) => ({ ...prev, [category]: true })); // immediately update UI
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
          <Icon className={styles.headerIcon} />
          <h3>{CATEGORY_LABELS[category]}</h3>
        </div>
        {hasVoted[category] ? (
          <div className={styles.votedTag}>
            <FaCheckCircle /> Voted
          </div>
        ) : (
          <button
            className={styles.viewAllBtn}
            onClick={() => setActiveCategory(category)}
          >
            View All <FaArrowRight className={styles.arrowIcon} />
          </button>
        )}
      </div>
    );
  };

  const CandidateCard = ({ candidate, category, compact }) => (
    <motion.div
      className={`${styles.candidateCard} ${compact ? styles.compact : ""}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      onClick={() => handleVote(candidate._id, category)}
    >
      <div className={styles.candidateImage}>
        <img src={candidate.image} alt={candidate.name} />
        {!hasVoted[category] && (
          <div className={styles.voteOverlay}>
            <FaVoteYea className={styles.voteIcon} />
            <span>Vote Now</span>
          </div>
        )}
      </div>
      <div className={styles.candidateDetails}>
        <h4 title={candidate.name}>{candidate.name}</h4>
        {candidate.meta ? (
          <p className={styles.meta} title={candidate.meta}>
            {candidate.meta}
          </p>
        ) : null}
      </div>
    </motion.div>
  );

  const CategorySection = ({ category }) => {
    const list = candidates.filter((c) => c.category === category);
    const visible = list.slice(0, 2);
    const hasMore = list.length > 2;

    return (
      <motion.div
        className={styles.categorySection}
        id={`category-${category}`}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CategoryHeader category={category} />
        {hasVoted[category] ? (
          <div className={styles.votedConfirmation}>
            <FaCheckCircle className={styles.successIcon} />
            <h3>You've voted in {CATEGORY_LABELS[category]}!</h3>
            <p>Thanks for joining the Halloween fun.</p>
          </div>
        ) : (
          <div className={styles.candidatesGrid}>
            {visible.map((c) => (
              <CandidateCard key={c._id} candidate={c} category={category} />
            ))}
            {visible.length === 0 && (
              <div className={styles.emptyState}>No candidates yet.</div>
            )}
          </div>
        )}
        {hasMore && !hasVoted[category] && (
          <button
            className={styles.viewAllBtn}
            onClick={() => setActiveCategory(category)}
          >
            View All <FaArrowRight className={styles.arrowIcon} />
          </button>
        )}
      </motion.div>
    );
  };

  const CategoryViewPage = ({ category }) => {
    const list = candidates.filter((c) => c.category === category);
    const Icon = CATEGORY_ICON[category] || FaUsers;

    return (
      <div className={styles.categoryViewPage}>
        <div className={styles.categoryViewHeader}>
          <button
            className={styles.backButton}
            onClick={() => setActiveCategory(null)}
          >
            <FaArrowLeft />
          </button>
          <h2>
            <Icon className={styles.headerIcon} /> {CATEGORY_LABELS[category]}
          </h2>
        </div>
        <div className={styles.categoryCandidatesGrid}>
          {list.map((c) => (
            <CandidateCard
              key={c._id}
              candidate={c}
              category={category}
              compact
            />
          ))}
          {list.length === 0 && (
            <div className={styles.emptyState}>No candidates available.</div>
          )}
        </div>
        {hasVoted[category] && (
          <div className={styles.votedConfirmation}>
            <FaCheckCircle className={styles.successIcon} />
            <h3>You've already voted here!</h3>
            <p>Only one vote per category.</p>
          </div>
        )}
      </div>
    );
  };

  // Floating particles with spooky colors
  const Particles = () => (
    <div className={styles.particles}>
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.particle}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.25, 0.1, 0.25, 0],
            scale: [0, 1, 0.8, 0.5, 0],
            x: [0, Math.random() * 160 - 80],
            y: [0, Math.random() * 160 - 80],
          }}
          transition={{
            duration: 10 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 2,
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

  return (
    <div className={styles.halloweenContainer}>
      <Particles />
      {activeCategory ? (
        <CategoryViewPage category={activeCategory} />
      ) : (
        <>
          <motion.header
            className={styles.voteHeader}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={styles.headerBadge}
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.25 }}
            >
              <FaGhost />
            </motion.div>
            <h1>Halloween Costume Votes 2025</h1>
            <p>Cast your vote in the three spooky categories below</p>
            <div className={styles.headerDivider}></div>
          </motion.header>

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}>
                <FaSpinner className={styles.spinnerIcon} />
              </div>
              <p>Summoning candidates...</p>
            </div>
          ) : (
            <div className={styles.votingSection}>
              <CategorySection category="bestDressed" />
              <CategorySection category="famousCharacter" />
              <CategorySection category="bestDuo" />
            </div>
          )}
        </>
      )}

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className={styles.successNotification}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className={styles.notificationContent}>
              <FaCheckCircle className={styles.successIcon} />
              <div>
                <h3>Vote Submitted!</h3>
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
