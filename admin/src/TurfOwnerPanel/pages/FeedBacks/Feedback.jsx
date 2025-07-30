import React, { useState } from "react";
import styles from "./Feedback.module.css";
import {
  FaStar,
  FaRegStar,
  FaFilter,
  FaDownload,
  FaReply,
  FaEye,
  FaTrash,
  FaUser,
  FaCalendarAlt,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";

const Feedback = () => {
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [turfFilter, setTurfFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock feedback data
  const [feedbacks] = useState([
    {
      id: "FB001",
      customerName: "John Smith",
      customerAvatar: "https://api.dicebear.com/9.x/micah/svg?seed=John",
      turfName: "Premier Football Turf",
      rating: 5,
      comment:
        "Excellent turf quality and well-maintained facilities. The booking process was smooth and staff was very helpful. Highly recommend!",
      date: "2025-01-28",
      time: "2:30 PM",
      status: "published",
      helpful: 12,
      replied: true,
      replyText:
        "Thank you for the wonderful feedback! We appreciate your business.",
    },
    {
      id: "FB002",
      customerName: "Sarah Johnson",
      customerAvatar: "https://api.dicebear.com/9.x/micah/svg?seed=Sarah",
      turfName: "Elite Cricket Ground",
      rating: 4,
      comment:
        "Good facilities but could use better lighting in the evening. The turf condition was decent for the price point.",
      date: "2025-01-27",
      time: "6:45 PM",
      status: "pending",
      helpful: 8,
      replied: false,
      replyText: null,
    },
    {
      id: "FB003",
      customerName: "Mike Davis",
      customerAvatar: "https://api.dicebear.com/9.x/micah/svg?seed=Mike",
      turfName: "City Multi-sports Arena",
      rating: 2,
      comment:
        "The turf was in poor condition with several patches missing. Very disappointing experience for the price paid.",
      date: "2025-01-26",
      time: "4:15 PM",
      status: "flagged",
      helpful: 3,
      replied: true,
      replyText:
        "We apologize for the inconvenience. We have addressed the maintenance issues.",
    },
    {
      id: "FB004",
      customerName: "Emma Wilson",
      customerAvatar: "https://api.dicebear.com/9.x/micah/svg?seed=Emma",
      turfName: "Premier Football Turf",
      rating: 5,
      comment:
        "Amazing experience! Clean facilities, well-maintained turf, and excellent customer service. Will definitely book again.",
      date: "2025-01-25",
      time: "10:20 AM",
      status: "published",
      helpful: 15,
      replied: true,
      replyText:
        "Thank you for choosing us! We look forward to serving you again.",
    },
    {
      id: "FB005",
      customerName: "Alex Thompson",
      customerAvatar: "https://api.dicebear.com/9.x/micah/svg?seed=Alex",
      turfName: "Elite Cricket Ground",
      rating: 3,
      comment:
        "Average experience. The turf was okay but the changing rooms need improvement. Staff was friendly though.",
      date: "2025-01-24",
      time: "8:30 PM",
      status: "published",
      helpful: 5,
      replied: false,
      replyText: null,
    },
  ]);

  // Statistics
  const totalFeedbacks = feedbacks.length;
  const averageRating = (
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
  ).toFixed(1);
  const pendingReviews = feedbacks.filter((f) => f.status === "pending").length;
  const publishedReviews = feedbacks.filter(
    (f) => f.status === "published"
  ).length;

  const ratingDistribution = {
    5: feedbacks.filter((f) => f.rating === 5).length,
    4: feedbacks.filter((f) => f.rating === 4).length,
    3: feedbacks.filter((f) => f.rating === 3).length,
    2: feedbacks.filter((f) => f.rating === 2).length,
    1: feedbacks.filter((f) => f.rating === 1).length,
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={styles.star}>
        {index < rating ? <FaStar /> : <FaRegStar />}
      </span>
    ));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "published":
        return styles.statusPublished;
      case "pending":
        return styles.statusPending;
      case "flagged":
        return styles.statusFlagged;
      default:
        return styles.statusDefault;
    }
  };

  const handleReply = (feedbackId) => {
    console.log("Reply to feedback:", feedbackId);
    alert(`Opening reply form for feedback ${feedbackId}`);
  };

  const handleView = (feedbackId) => {
    console.log("View feedback:", feedbackId);
    alert(`Opening detailed view for feedback ${feedbackId}`);
  };

  const handleDelete = (feedbackId) => {
    console.log("Delete feedback:", feedbackId);
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      alert(`Feedback ${feedbackId} deleted`);
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const ratingMatch =
      ratingFilter === "all" || feedback.rating.toString() === ratingFilter;
    const statusMatch =
      statusFilter === "all" || feedback.status === statusFilter;
    const turfMatch =
      turfFilter === "all" ||
      feedback.turfName.toLowerCase().includes(turfFilter.toLowerCase());
    const searchMatch =
      feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return ratingMatch && statusMatch && turfMatch && searchMatch;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Feedback & Ratings</h1>
          <p className={styles.description}>
            Manage customer feedback and maintain quality standards
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>
            <FaDownload className={styles.btnIcon} />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search feedback by customer name, booking ID, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            value={turfFilter}
            onChange={(e) => setTurfFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Turfs</option>
            <option value="premier">Premier Football Turf</option>
            <option value="elite">Elite Cricket Ground</option>
            <option value="multi">City Multi-sports Arena</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💬</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totalFeedbacks}</div>
            <div className={styles.statLabel}>Total Feedback</div>
            <div className={styles.statChange}>+12 this week</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{averageRating}</div>
            <div className={styles.statLabel}>Average Rating</div>
            <div className={styles.statChange}>+0.2 vs last month</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{pendingReviews}</div>
            <div className={styles.statLabel}>Pending Review</div>
            <div className={styles.statChange}>-3 from yesterday</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏸️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>3</div>
            <div className={styles.statLabel}>On Hold</div>
            <div className={styles.statChange}>+1 needs attention</div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className={styles.ratingDistribution}>
        <h2 className={styles.sectionTitle}>Rating Distribution</h2>
        <div className={styles.ratingBars}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className={styles.ratingBar}>
              <div className={styles.ratingLabel}>
                {rating} {renderStars(rating)}
              </div>
              <div className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{
                    width: `${
                      (ratingDistribution[rating] / totalFeedbacks) * 100
                    }%`,
                    backgroundColor:
                      rating >= 4
                        ? "#10b981"
                        : rating >= 3
                        ? "#f59e0b"
                        : "#ef4444",
                  }}
                ></div>
              </div>
              <div className={styles.ratingCount}>
                {ratingDistribution[rating]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className={styles.feedbackSection}>
        <h2 className={styles.sectionTitle}>Recent Feedback</h2>

        <div className={styles.feedbackList}>
          {filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className={styles.feedbackCard}>
              <div className={styles.feedbackHeader}>
                <div className={styles.customerInfo}>
                  <img
                    src={feedback.customerAvatar}
                    alt={feedback.customerName}
                    className={styles.customerAvatar}
                  />
                  <div className={styles.customerDetails}>
                    <div className={styles.customerName}>
                      {feedback.customerName}
                    </div>
                    <div className={styles.bookingInfo}>
                      Booking #{feedback.id} • {feedback.turfName}
                    </div>
                  </div>
                </div>

                <div className={styles.feedbackMeta}>
                  <div className={styles.rating}>
                    {renderStars(feedback.rating)}
                  </div>
                  <div
                    className={`${styles.status} ${getStatusClass(
                      feedback.status
                    )}`}
                  >
                    {feedback.status}
                  </div>
                </div>
              </div>

              <div className={styles.feedbackContent}>
                <p className={styles.comment}>{feedback.comment}</p>

                {feedback.replied && feedback.replyText && (
                  <div className={styles.reply}>
                    <div className={styles.replyHeader}>
                      <FaReply className={styles.replyIcon} />
                      <span>Your Reply:</span>
                    </div>
                    <p className={styles.replyText}>{feedback.replyText}</p>
                  </div>
                )}
              </div>

              <div className={styles.feedbackFooter}>
                <div className={styles.feedbackInfo}>
                  <div className={styles.dateTime}>
                    <FaCalendarAlt className={styles.infoIcon} />
                    {feedback.date} at {feedback.time}
                  </div>
                  <div className={styles.helpful}>
                    <FaThumbsUp className={styles.infoIcon} />
                    {feedback.helpful} found helpful
                  </div>
                </div>

                <div className={styles.feedbackActions}>
                  <button
                    onClick={() => handleView(feedback.id)}
                    className={styles.actionBtn}
                    title="View Details"
                  >
                    <FaEye className={styles.actionIcon} />
                    View
                  </button>
                  {!feedback.replied && (
                    <button
                      onClick={() => handleReply(feedback.id)}
                      className={styles.actionBtn}
                      title="Reply"
                    >
                      <FaReply className={styles.actionIcon} />
                      Reply
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    title="Delete"
                  >
                    <FaTrash className={styles.actionIcon} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFeedbacks.length === 0 && (
          <div className={styles.noFeedback}>
            <p>No feedback found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
