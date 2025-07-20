import React, { useEffect, useState, useContext } from "react";
import { useSpring, animated, useTrail, config } from "react-spring";
import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Share2,
  Star,
  Heart,
  Users,
  Ticket,
  Navigation as NavigationIcon,
  Eye,
  ThumbsUp,
  MessageCircle,
  Shield,
  Award,
  Sparkles,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./EventDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const EventDetails = () => {
  const { id } = useParams();
  const { url, isLoggedIn, user } = useContext(StoreContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const navigate = useNavigate();

  // Intersection Observer refs
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [aboutRef, aboutInView] = useInView({ threshold: 0.1 });
  const [reviewsRef, reviewsInView] = useInView({ threshold: 0.1 });

  // Spring animations
  const heroSpring = useSpring({
    opacity: heroInView ? 1 : 0,
    transform: heroInView ? "translateY(0px)" : "translateY(30px)",
    config: config.gentle,
  });

  const aboutSpring = useSpring({
    opacity: aboutInView ? 1 : 0,
    transform: aboutInView ? "translateY(0px)" : "translateY(30px)",
    config: config.gentle,
  });

  const reviewsSpring = useSpring({
    opacity: reviewsInView ? 1 : 0,
    transform: reviewsInView ? "translateY(0px)" : "translateY(30px)",
    config: config.gentle,
  });

  // Trail animation for highlights
  const highlights = event?.highlights || [];
  const trail = useTrail(highlights.length, {
    opacity: aboutInView ? 1 : 0,
    transform: aboutInView ? "translateX(0px)" : "translateX(-20px)",
    config: config.gentle,
  });

  // Sample data
  const sampleFAQs = [
    {
      question: "Is the ticket refundable?",
      answer:
        "Tickets are non-refundable but can be transferred to another person up to 24 hours before the event.",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      question: "Can I bring a guest?",
      answer:
        "Yes, but they must have a valid ticket. Group discounts are available for 5+ people.",
      icon: <Users className="w-5 h-5" />,
    },
    {
      question: "Is parking available at the venue?",
      answer:
        "Yes, free parking is available on-site. Valet parking is also available for premium ticket holders.",
      icon: <NavigationIcon className="w-5 h-5" />,
    },
    {
      question: "What's the dress code?",
      answer:
        "Smart casual is recommended. Check your ticket for specific dress code requirements.",
      icon: <Award className="w-5 h-5" />,
    },
  ];

  const eventStats = [
    { label: "Views", value: "2.4K", icon: <Eye className="w-5 h-5" /> },
    { label: "Interested", value: "856", icon: <Heart className="w-5 h-5" /> },
    { label: "Going", value: "234", icon: <Users className="w-5 h-5" /> },
    { label: "Shared", value: "123", icon: <Share2 className="w-5 h-5" /> },
  ];

  const relatedEvents = [
    {
      id: 1,
      title: "Summer Music Festival",
      date: "2025-07-15",
      price: 1200,
      image:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=200&fit=crop",
      category: "Music",
      rating: 4.8,
      attendees: 1200,
    },
    {
      id: 2,
      title: "Tech Conference 2025",
      date: "2025-08-20",
      price: 2500,
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop",
      category: "Technology",
      rating: 4.9,
      attendees: 800,
    },
    {
      id: 3,
      title: "Food & Wine Festival",
      date: "2025-09-10",
      price: 1800,
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
      category: "Food",
      rating: 4.7,
      attendees: 600,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${url}/api/event/${id}`);
        if (res.data.success) {
          setEvent(res.data.data);
        } else {
          toast.error("Event not found");
        }
      } catch (err) {
        toast.error("Error fetching event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, url]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${url}/api/reviews/${id}`);
        if (res.data.success) {
          const sorted = res.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setReviews(sorted);
          if (isLoggedIn && user?._id) {
            const existing = sorted.find(
              (r) => r.userId?.toString() === user._id.toString()
            );
            setUserReview(existing || null);
            if (existing) {
              setReviewText(existing.comment);
              setRating(existing.rating);
            }
          }
        }
      } catch (err) {
        console.error("Review fetch failed", err);
      }
    };
    fetchReviews();
  }, [id, url, isLoggedIn, user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      if (isEditing && userReview) {
        const res = await axios.put(
          `${url}/api/reviews/${userReview._id}`,
          { comment: reviewText, rating },
          config
        );
        if (res.data.success) {
          const updated = res.data.data;
          setReviews((prev) =>
            prev.map((r) => (r._id === updated._id ? updated : r))
          );
          setUserReview(updated);
          setIsEditing(false);
          toast.success("Review updated successfully!");
        }
      } else {
        const res = await axios.post(
          `${url}/api/reviews/${id}`,
          { comment: reviewText, rating, userName: user.name },
          config
        );
        if (res.data.success) {
          setReviews((prev) => [res.data.data, ...prev]);
          setUserReview(res.data.data);
          setReviewText("");
          setRating(5);
          toast.success("Review submitted successfully!");
        }
      }
    } catch (err) {
      toast.error("Review submission failed.");
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await axios.delete(`${url}/api/reviews/${userReview._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== userReview._id));
        setUserReview(null);
        setReviewText("");
        setRating(5);
        setIsEditing(false);
        toast.success("Review deleted successfully!");
      }
    } catch (err) {
      toast.error("Failed to delete review.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: event?.name || "Event",
      text: `Check out this amazing event: ${event?.name || ""}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Event shared successfully!");
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Share failed: " + err.message);
        }
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard!");
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 fill-current text-yellow-400 opacity-50"
          />
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-text">Loading amazing event...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="error-container">
        <div className="error-content">
          <Zap className="w-16 h-16 text-blue-500 mb-4" />
          <h2>Event not found</h2>
          <p>The event you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            <Sparkles className="w-4 h-4 mr-2" />
            Discover Events
          </button>
        </div>
      </div>
    );
  }

  const ticketsLeft = event.totalTickets - event.ticketsSold;
  const images = [event.coverImage, ...(event.otherImages || [])];
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) /
    (reviews.length || 1);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="event-details" style={{ paddingTop: "105px" }}>
      <animated.section ref={heroRef} style={heroSpring} className="event-hero">
        <div className="hero-background">
          <div className="hero-image-container">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              effect="fade"
              loop
              spaceBetween={0}
              slidesPerView={1}
              onSlideChange={(swiper) => setActiveImage(swiper.realIndex)}
              className="hero-swiper"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="hero-slide">
                    <LazyLoadImage
                      src={img.url}
                      alt={`Event ${idx + 1}`}
                      effect="blur"
                      className="hero-image"
                    />
                    <div className="hero-overlay"></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Floating Elements */}
            <div className="hero-floating-elements">
              <div className="image-counter">
                <Eye className="w-4 h-4 mr-1" />
                {activeImage + 1} / {images.length}
              </div>

              <div className="hero-actions">
                <button
                  onClick={toggleBookmark}
                  className={`action-btn ${isBookmarked ? "bookmarked" : ""}`}
                >
                  <Heart
                    className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </button>
                <button onClick={handleShare} className="action-btn">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-coontent">
          <div className="hero-content-inner">
            <div className="event-category">
              <Sparkles className="w-4 h-4 mr-1" />
              {event.category || "Special Event"}
            </div>

            <h1 className="event-title">{event.name}</h1>

            <div className="event-meta">
              <div className="meta-item">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="meta-item">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>{event.time}</span>
              </div>
              <div className="meta-item">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>
                  {event.location?.address || event.location?.city || "—"}
                </span>
              </div>
            </div>

            {/* Event Stats */}
            <div className="event-stats">
              {eventStats.map((stat, index) => (
                <div key={index} className="stat-item">
                  {stat.icon}
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="event-rating">
                <div className="rating-stars">{renderStars(averageRating)}</div>
                <span className="rating-value">{averageRating.toFixed(1)}</span>
                <span className="rating-count">({reviews.length} reviews)</span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="hero-cta">
              <button
                className={`btn-primary ${ticketsLeft <= 0 ? "sold-out" : ""}`}
                onClick={() => navigate(`/event/${id}/buyticket`)}
                disabled={ticketsLeft <= 0}
              >
                {ticketsLeft > 0 ? (
                  <>
                    <Ticket className="w-5 h-5 mr-2" />
                    Book Now - ₹{event.price}
                    <span className="tickets-left">{ticketsLeft} left</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-5 h-5 mr-2" />
                    Sold Out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </animated.section>

      {/* Main Content */}
      <main className="event-main">
        <div className="event-content">
          {/* About Section */}
          <animated.section
            ref={aboutRef}
            style={aboutSpring}
            className="event-section about-section"
          >
            <div className="section-header">
              <h2 className="section-title">
                <Sparkles className="w-6 h-6 mr-2" />
                About This Event
              </h2>
            </div>

            <div className="section-content">
              <p className="event-description">{event.description}</p>

              {highlights.length > 0 && (
                <div className="event-highlights">
                  <h3 className="highlight-title">Event Highlights</h3>
                  <div className="highlight-grid">
                    {trail.map((style, index) => (
                      <animated.div
                        key={index}
                        style={style}
                        className="highlight-item"
                      >
                        <div className="highlight-icon">
                          <Award className="w-4 h-4" />
                        </div>
                        <span>{highlights[index]}</span>
                      </animated.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </animated.section>

          {/* Location Section */}
          {event.location && (
            <section className="event-section location-section">
              <div className="section-header">
                <h2 className="section-title">
                  <MapPin className="w-6 h-6 mr-2" />
                  Location & Directions
                </h2>
              </div>

              <div className="location-content">
                <div className="location-info">
                  <div className="location-address">
                    <h3>{event.location.address}</h3>
                    <p>
                      {event.location.city}, {event.location.state},{" "}
                      {event.location.country}
                    </p>
                  </div>

                  <div className="location-actions">
                    <button
                      className="btn-outline"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${event.location.latitude},${event.location.longitude}`,
                          "_blank"
                        )
                      }
                    >
                      <NavigationIcon className="w-4 h-4 mr-2" />
                      Get Directions
                    </button>
                  </div>
                </div>

                <div className="location-map">
                  {event.location.latitude && event.location.longitude ? (
                    <MapContainer
                      center={[
                        event.location.latitude,
                        event.location.longitude,
                      ]}
                      zoom={15}
                      scrollWheelZoom={false}
                      style={{
                        height: "300px",
                        width: "100%",
                        borderRadius: "12px",
                      }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker
                        position={[
                          event.location.latitude,
                          event.location.longitude,
                        ]}
                        icon={L.icon({
                          iconUrl:
                            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                        })}
                      >
                        <Popup>{event.name}</Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <div className="map-placeholder">
                      <MapPin className="w-12 h-12 text-gray-300" />
                      <p>Map not available</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Organizer Section */}
          <section className="event-section organizer-section">
            <div className="section-header">
              <h2 className="section-title">
                <User className="w-6 h-6 mr-2" />
                Event Organizer
              </h2>
            </div>

            <div className="organizer-card">
              <div className="organizer-avatar">
                <User className="w-8 h-8" />
              </div>
              <div className="organizer-info">
                <h3 className="organizer-name">{event.organizerName}</h3>
                <p className="organizer-role">Event Organizer</p>
                <div className="organizer-contacts">
                  {event.organizerEmail && (
                    <a
                      href={`mailto:${event.organizerEmail}`}
                      className="contact-link"
                    >
                      <Mail className="w-4 h-4" />
                      {event.organizerEmail}
                    </a>
                  )}
                  {event.organizerPhone && (
                    <a
                      href={`tel:${event.organizerPhone}`}
                      className="contact-link"
                    >
                      <Phone className="w-4 h-4" />
                      {event.organizerPhone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="event-section faq-section">
            <div className="section-header">
              <h2 className="section-title">
                <MessageCircle className="w-6 h-6 mr-2" />
                Frequently Asked Questions
              </h2>
            </div>

            <div className="faq-container">
              {sampleFAQs.map((faq, index) => (
                <details key={index} className="faq-item">
                  <summary className="faq-question">
                    <div className="faq-question-content">
                      <div className="faq-icon">{faq.icon}</div>
                      <span>{faq.question}</span>
                    </div>
                  </summary>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <animated.section
            ref={reviewsRef}
            style={reviewsSpring}
            className="event-section reviews-section"
          >
            <div className="section-header">
              <h2 className="section-title">
                <Star className="w-6 h-6 mr-2" />
                Reviews & Ratings
              </h2>
              {reviews.length > 0 && (
                <div className="reviews-summary">
                  <div className="rating-display">
                    <span className="rating-score">
                      {averageRating.toFixed(1)}
                    </span>
                    <div className="rating-stars">
                      {renderStars(averageRating)}
                    </div>
                  </div>
                  <span className="rating-count">
                    Based on {reviews.length} reviews
                  </span>
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="no-reviews">
                <Star className="w-12 h-12 text-gray-300 mb-4" />
                <h3>No reviews yet</h3>
                <p>Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="reviews-container">
                {displayedReviews.map((review, index) => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="review-user">
                        <div className="user-avatar">
                          {review.userName?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="user-info">
                          <span className="user-name">
                            {review.userName || "Anonymous"}
                          </span>
                          <div className="review-rating">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <div className="review-actions">
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        {isLoggedIn &&
                          userReview &&
                          review._id === userReview._id && (
                            <div className="user-review-actions">
                              <button
                                className="review-edit"
                                onClick={() => setIsEditing(true)}
                              >
                                Edit
                              </button>
                              <button
                                className="review-delete"
                                onClick={handleDeleteReview}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="review-content">
                      <p>{review.comment}</p>
                    </div>
                    <div className="review-footer">
                      <button className="review-like">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful
                      </button>
                    </div>
                  </div>
                ))}

                {reviews.length > 3 && (
                  <button
                    className="btn-outline"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews
                      ? "Show Less"
                      : `View All ${reviews.length} Reviews`}
                  </button>
                )}
              </div>
            )}

            {/* Review Form */}
            {isLoggedIn ? (
              (!userReview || isEditing) && (
                <div className="review-form-container">
                  <h3 className="form-title">
                    {isEditing ? "Edit Your Review" : "Write a Review"}
                  </h3>
                  <form onSubmit={handleSubmitReview} className="review-form">
                    <div className="rating-input">
                      <span className="rating-label">Your Rating:</span>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${
                              star <= rating ? "active" : ""
                            }`}
                            onClick={() => setRating(star)}
                          >
                            <Star className="w-6 h-6" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience with this event..."
                        rows={4}
                        required
                        className="form-textarea"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-primary">
                        {isEditing ? "Update Review" : "Submit Review"}
                      </button>
                      {isEditing && (
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => {
                            setIsEditing(false);
                            setReviewText(userReview?.comment || "");
                            setRating(userReview?.rating || 5);
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )
            ) : (
              <div className="login-prompt">
                <User className="w-12 h-12 text-gray-300 mb-4" />
                <h3>Share Your Experience</h3>
                <p>
                  Sign in to leave a review and help others discover great
                  events.
                </p>
                <button
                  className="btn-primary"
                  onClick={() =>
                    navigate("/login", { state: { from: `/event/${id}` } })
                  }
                >
                  Sign In to Review
                </button>
              </div>
            )}
          </animated.section>
        </div>

        {/* Enhanced Sidebar */}
        <aside className="event-sidebar">
          {/* Ticket Info Card */}
          <div className="sidebar-card ticket-card">
            <div className="ticket-header">
              <Ticket className="w-6 h-6" />
              <h3>Ticket Information</h3>
            </div>
            <div className="ticket-info">
              <div className="price-display">
                <span className="price">₹{event.price}</span>
                <span className="price-label">per person</span>
              </div>
              <div className="ticket-availability">
                <div className="availability-bar">
                  <div
                    className="availability-fill"
                    style={{
                      width: `${
                        ((event.totalTickets - ticketsLeft) /
                          event.totalTickets) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="availability-text">
                  {ticketsLeft} of {event.totalTickets} tickets left
                </span>
              </div>
            </div>
          </div>

          {/* Event Details Card */}
          <div className="sidebar-card details-card">
            <h3 className="sidebar-title">Event Details</h3>
            <div className="details-list">
              <div className="detail-item">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="detail-label">Date</span>
                  <span className="detail-value">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="detail-item">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{event.time}</span>
                </div>
              </div>
              <div className="detail-item">
                <MapPin className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="detail-label">Location</span>
                  <span className="detail-value">
                    {event.location?.address || event.location?.city || "—"}
                  </span>
                </div>
              </div>
              <div className="detail-item">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="detail-label">Organizer</span>
                  <span className="detail-value">{event.organizerName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Events Card */}
          {relatedEvents.length > 0 && (
            <div className="sidebar-card related-card">
              <h3 className="sidebar-title">You May Also Like</h3>
              <div className="related-events">
                {relatedEvents.map((relatedEvent) => (
                  <div
                    key={relatedEvent.id}
                    className="related-event"
                    onClick={() => navigate(`/event/${relatedEvent.id}`)}
                  >
                    <div className="related-image-container">
                      <LazyLoadImage
                        src={relatedEvent.image}
                        alt={relatedEvent.title}
                        effect="blur"
                        className="related-image"
                      />
                      <div className="related-category">
                        {relatedEvent.category}
                      </div>
                    </div>
                    <div className="related-info">
                      <h4>{relatedEvent.title}</h4>
                      <div className="related-meta">
                        <div className="related-date">
                          {new Date(relatedEvent.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="related-rating">
                          <Star className="w-3 h-3 fill-current text-yellow-400" />
                          {relatedEvent.rating}
                        </div>
                      </div>
                      <div className="related-price">₹{relatedEvent.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* Enhanced Floating Action Button */}
      {ticketsLeft > 0 && (
        <div className="floating-action">
          <button
            className="fab-button"
            onClick={() => navigate(`/event/${id}/buyticket`)}
          >
            <Ticket className="w-5 h-5" />
            <span className="fab-text">
              Book Now - ₹{event.price}
              <small>{ticketsLeft} tickets left</small>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
