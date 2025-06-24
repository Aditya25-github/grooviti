import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./EventDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import EventHighlights from "../../components/EventHighlights/EventHighlights.jsx";
import RatingBreakdown from "../../components/RatingBreakdown/RatingBreakdown.jsx";
import OrganizerInfo from "../../components/OrganizerInfo/OrganizerInfo.jsx";
import EventFAQs from "../../components/EventFAQs/EventFAQs.jsx";
import RelatedEvents from "../../components/RelatedEvents/RelatedEvents.jsx";
import ReviewCard from "../../components/ReviewCard/ReviewCard.jsx";
import ReviewForm from "../../components/ReviewForm/ReviewForm.jsx";
import EventMeta from "../../components/EventMeta/EventMeta.jsx";
import EventTimeBox from "../../components/EventTimeBox/EventTimeBox.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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
  const isSignedIn = isLoggedIn && user;
  const navigate = useNavigate();
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const sampleFAQs = [
    {
      question: "Is the ticket refundable?",
      answer: "Tickets are non-refundable but can be transferred.",
    },
    {
      question: "Can I bring a guest?",
      answer: "Yes, but they must have a valid ticket.",
    },
    {
      question: "Is parking available at the venue?",
      answer: "Yes, free parking is available on-site.",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    console.log("Cover Image:", event?.coverImage);
    console.log("Other Images:", event?.otherImages);
  }, [event]);

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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.warn("User location not available:", err);
      }
    );
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${url}/api/reviews/${id}`);
        if (res.data.success) {
          const sorted = res.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setReviews(sorted);
          if (isSignedIn && user?._id) {
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
  }, [id, url, isSignedIn, user]);

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
          toast.success("Review updated!");
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
          toast.success("Review submitted!");
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
        toast.success("Review deleted!");
      }
    } catch (err) {
      toast.error("Failed to delete review.");
    }
  };

  const handleShare = () => {
    const shareData = {
      title: event.name,
      text: `Check out this event: ${event.name}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator
        .share(shareData)
        .catch((err) => toast.error("Share failed: " + err.message));
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.info("Link copied to clipboard!");
    }
  };

  if (loading) return <div className="event-details">Loading...</div>;
  if (!event) return <div className="event-details">Event not found.</div>;

  const ticketsLeft = event.totalTickets - event.ticketsSold;
  const { address, city, state, country } = event.location || {};
  const mapUrl =
    address || city
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          address || city
        )}&output=embed`
      : null;

  const images = [event.coverImage, ...(event.otherImages || [])];

  return (
    <motion.div
      className="event-details"
      style={{ paddingTop: "115px" }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      {/* Top Section */}
      <motion.div className="event-top-section">
        <motion.div
          className="event-slider"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          }}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop
            spaceBetween={10}
            slidesPerView={1}
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={`${url}/uploads/${img}`}
                  alt={`event-${idx}`}
                  style={{ width: "100%", borderRadius: "12px" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <motion.div
          className="event-info"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8 },
            },
          }}
        >
          <div className="event-header">
            <h1 className="event-title">{event.name}</h1>
            <EventTimeBox
              event={{
                date: "2025-07-01T18:00:00Z",
                endTime: "2025-07-01T20:00:00Z",
              }}
            />
            <div className="event-location">
              <span>📍</span>
              <span>{address || city || "—"}</span>
            </div>
          </div>

          <EventMeta
            event={event}
            location={event.location}
            ticketsLeft={ticketsLeft}
          />

          <div className="event-action-buttons">
            {ticketsLeft > 0 ? (
              <button
                className="book-now-btn"
                onClick={() => navigate(`/event/${id}/buyticket`)}
              >
                Book Now
              </button>
            ) : (
              <button className="book-now-btn sold-out-btn" disabled>
                Sold Out
              </button>
            )}
            <button className="secondary-btn" onClick={handleShare}>
              Share
            </button>
          </div>

          <div className="event-description">{event.description}</div>
          {event?.location?.latitude && event?.location?.longitude && (
            <div
              style={{
                height: "300px",
                marginTop: "20px",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <MapContainer
                center={[event.location.latitude, event.location.longitude]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={[event.location.latitude, event.location.longitude]}
                  icon={L.icon({
                    iconUrl:
                      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl:
                      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                    shadowSize: [41, 41],
                  })}
                >
                  <Popup>{event.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          <button
            className="secondary-btn"
            style={{ marginTop: "10px" }}
            onClick={() => window.open(`/event/${id}/direction`, "_blank")}
          >
            Get Directions
          </button>

          {ticketsLeft > 0 && (
            <div className="sticky-book-btn">
              <button onClick={() => navigate(`/event/${id}/buyticket`)}>
                Book Now for ₹{event.price}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      <EventHighlights highlights={event.highlights} />

      <RatingBreakdown reviews={reviews} />
      <OrganizerInfo
        name={event.organizerName}
        email={event.organizerEmail}
        phone={event.organizerPhone}
      />
      <EventFAQs faqs={sampleFAQs} />
      <RelatedEvents events={relatedEvents} />

      {/* Reviews Full Width */}
      <div className="event-reviews">
        <h2>Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}
        {reviews.map((rev) => (
          <ReviewCard
            key={rev._id}
            review={rev}
            isOwner={isSignedIn && userReview && rev._id === userReview._id}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDeleteReview}
          />
        ))}

        {isSignedIn ? (
          !userReview || isEditing ? (
            <ReviewForm
              reviewText={reviewText}
              setReviewText={setReviewText}
              rating={rating}
              setRating={setRating}
              isEditing={isEditing}
              onSubmit={handleSubmitReview}
              onCancel={() => {
                setIsEditing(false);
                setReviewText(userReview?.comment || "");
                setRating(userReview?.rating || 5);
              }}
            />
          ) : (
            <p>You have already submitted a review.</p>
          )
        ) : (
          <p className="login-reminder">Sign in to leave a review.</p>
        )}
      </div>
    </motion.div>
  );
};

export default EventDetails;
