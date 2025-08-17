import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./VenueDetails.module.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const fallbackImages = [
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop'
];

// Helper function to get "YYYY-MM-DD" format date string in local time
const toLocalYMD = (d) => {
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().split("T")[0];
};

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  // Precompute next 7 days for date selection
  const next7Days = useMemo(() => {
    const days = [];
    const start = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push({
        value: toLocalYMD(d),
        label: d.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
      });
    }
    return days;
  }, []);

  // Component state
  const [selectedDate, setSelectedDate] = useState(() => toLocalYMD(new Date()));
  const [venue, setVenue] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch venue details
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        let fetchedVenue = null;
        try {
          const res = await axios.get(`${url}/api/turfs/${id}`);
          fetchedVenue = res.data.turf || res.data;
        } catch {
          const res = await axios.get(`${url}/api/turfs/all`);
          fetchedVenue = res.data.turfs?.find(t => t._id === id);
        }
        setVenue(fetchedVenue || null);

        if (fetchedVenue) {
          if (fetchedVenue.sports && Object.keys(fetchedVenue.sports).length) {
            setSelectedSport(Object.keys(fetchedVenue.sports)[0]);
          } else if (fetchedVenue.turfType) {
            setSelectedSport(fetchedVenue.turfType);
          }
        }
      } catch {
        setVenue(null);
      }
    };
    fetchVenue();
  }, [id, url]);

  // Fetch available slots for selected venue and date
  useEffect(() => {
    if (!venue?._id || !selectedDate) return;
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setErrorSlots("");
        const res = await axios.get(`${url}/api/slots/by-date`, {
          params: { turfId: venue._id, date: selectedDate },
        });
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.slots || [];
        setSlots(data);
      } catch {
        setErrorSlots("Failed to load slots");
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [venue, selectedDate, url]);

  // Reset image index on venue change
  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedTimeSlot('');  // Reset selected slot on venue change for clarity
  }, [venue]);

  if (!venue) {
    return (
      <div className={styles.container}>
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          height: '50vh', color: 'white', fontSize: '1.2rem'
        }}>
          Venue details not found.
        </div>
      </div>
    );
  }

  const images =
    (venue.galleryImages && venue.galleryImages.length && venue.galleryImages) ||
    (venue.image ? [venue.image] : fallbackImages);

  const numImages = images.length;

  // Image navigation with wrapping
  const nextImage = () => setCurrentImageIndex(i => (i + 1) % numImages);
  const prevImage = () => setCurrentImageIndex(i => (i - 1 + numImages) % numImages);
  const handleIndicatorClick = idx => setCurrentImageIndex(idx);

  const sports = venue.sports && Object.keys(venue.sports).length
    ? venue.sports
    : {
      [venue.turfType || ""]: {
        price: venue.pricePerHour || "N/A",
        duration: 'hour',
        description: venue.description || '',
        facilities: (venue.features || []).join(', ') || 'Standard turf facilities'
      }
    };

  const selectedSportObj = sports[selectedSport] || {};
  const amenities = venue.amenities && venue.amenities.length ? venue.amenities : [];
  const reviews = venue.reviews && venue.reviews.length ? venue.reviews : [];

  const handleTimeSlotSelect = (slotId) => setSelectedTimeSlot(slotId);
  const handleSportSelect = (sport) => setSelectedSport(sport);

  // Keyboard nav for image slider
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  };

  // Book Now action: navigate to booking page with selection passed in params
  const handleBookNow = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and a slot first.");
      return;
    }
    navigate(
      `/bookvenue?turfId=${venue._id}&slotId=${selectedTimeSlot}&date=${selectedDate}&sport=${encodeURIComponent(selectedSport)}`
    );
  };

  // Slot button helper: check availability
  const isSlotAvailable = (slot) =>
    slot.status === "available" && (slot.bookedTickets ?? 0) < (slot.totalTickets ?? 1);

  // Format time helper
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      {/* Hero Image Section with arrows and indicators */}
      <section
        className={styles.heroSection}
      >
        <div
          className={styles.imageContainer}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Venue images - arrow keys to navigate"
        >
          <img
            src={images[currentImageIndex]}
            alt={venue.name}
            className={styles.heroImage}
            draggable={false}
          />
          <button
            className={styles.prevBtn}
            onClick={prevImage}
            aria-label="Previous image"
            disabled={numImages < 2}
            style={numImages < 2 ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className={styles.nextBtn}
            onClick={nextImage}
            aria-label="Next image"
            disabled={numImages < 2}
            style={numImages < 2 ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          <div className={styles.imageIndicators}>
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.indicator} ${idx === currentImageIndex ? styles.active : ''}`}
                onClick={() => handleIndicatorClick(idx)}
                aria-label={`Go to image ${idx + 1}`}
                disabled={numImages < 2}
                style={numImages < 2 ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
              />
            ))}
          </div>
        </div>

        {/* Venue Basic Info Overlay */}
        <div className={styles.venueInfoOverlay}>
          <div className={styles.venueBasicInfo}>
            <h1>{venue.name}</h1>
            <div className={styles.ratingLocation}>
              {venue.rating !== undefined && (
                <div className={styles.rating}>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <i key={star} className={`fas fa-star ${star <= Math.floor(venue.rating) ? styles.filled : ''}`} />
                    ))}
                  </div>
                  <span>{venue.rating}{venue.totalReviews ? ` (${venue.totalReviews} reviews)` : ''}</span>
                </div>
              )}
              {(venue.address || venue.city || venue.state) && (
                <div className={styles.location}>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{[venue.address, venue.city, venue.state].filter(Boolean).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className={styles.mainContent}>
        {/* Date selection */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-clock"></i> Venue Timing
          </h2>
          <div>
            <h4>Select a Date</h4>
            <div className={styles.timeSlots}>
              {next7Days.map(d => (
                <button
                  key={d.value}
                  className={`${styles.timeSlot} ${selectedDate === d.value ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedDate(d.value);
                    setSelectedTimeSlot('');
                  }}
                  type="button"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slots for selected date */}
          <div className={styles.timingContainer}>
            <div className={styles.timingCategory}>
              <h4>Available Slots</h4>
              {loadingSlots ? (
                <p>Loading slots…</p>
              ) : errorSlots ? (
                <p>{errorSlots}</p>
              ) : slots.length === 0 ? (
                <p>No slots for {selectedDate}. Try another date.</p>
              ) : (
                <div className={styles.timeSlots}>
                  {slots.map(slot => {
                    const available = isSlotAvailable(slot);
                    const startTimeFormatted = formatTime(slot.startTime);
                    const endTimeFormatted = formatTime(slot.endTime);
                    return (
                      <button
                        key={slot._id}
                        className={`${styles.timeSlot} ${selectedTimeSlot === slot._id ? styles.selected : ''} ${!available ? styles.unavailableSlot : ''}`}
                        onClick={() => available && handleTimeSlotSelect(slot._id)}
                        disabled={!available}
                        title={`${startTimeFormatted} – ${endTimeFormatted}`}
                        type="button"
                      >
                        {startTimeFormatted} – {endTimeFormatted}
                        {!available ? " (Unavailable)" : ""}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sports & Pricing */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-futbol"></i> Available Sports & Pricing
          </h2>
          <div className={styles.sportsContainer}>
            {Object.entries(sports).map(([sport, details]) => (
              <div
                key={sport}
                className={`${styles.sportCard} ${selectedSport === sport ? styles.selectedSport : ''}`}
                onClick={() => handleSportSelect(sport)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSportSelect(sport);
                  }
                }}
              >
                <div className={styles.sportHeader}>
                  <h4>{sport}</h4>
                  <span className={styles.sportPrice}>₹{details.price}/{details.duration}</span>
                </div>
                <p className={styles.sportDescription}>{details.description}</p>
                <p className={styles.sportFacilities}>{details.facilities}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Location */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-map-marker-alt"></i> Location
          </h2>
          <div className={styles.locationContainer}>
            <div className={styles.locationInfo}>
              <p>{[venue.address, venue.city, venue.state].filter(Boolean).join(', ')}</p>
              {venue.description && <p className={styles.locationDescription}>{venue.description}</p>}
            </div>
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapContent}>
                <i className="fas fa-map"></i>
                <p>Interactive Map</p>
                <small>Click to view on Google Maps</small>
              </div>
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-star"></i> Amenities
          </h2>
          <div className={styles.amenitiesGrid}>
            {amenities.map((amenity, idx) => (
              <div
                key={idx}
                className={`${styles.amenityItem} ${!amenity.available ? styles.unavailable : ''}`}
              >
                <i className={`${amenity.icon} ${styles.amenityIcon}`}></i>
                <span>{amenity.name}</span>
                {!amenity.available && <span className={styles.unavailableLabel}>Not Available</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Reviews & Ratings */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-star"></i> Reviews & Ratings
          </h2>
          <div className={styles.reviewsContainer}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <img
                      src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${review.name}&size=40`}
                      alt={review.name}
                      className={styles.reviewerAvatar}
                    />
                    <div>
                      <h5>{review.name}</h5>
                      <div className={styles.reviewRating}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <i
                            key={star}
                            className={`fas fa-star ${star <= review.rating ? styles.filled : ''}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className={styles.reviewDate}>{review.date}</span>
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
              </div>
            ))}
            <button className={styles.viewAllReviews}>View all reviews</button>
          </div>
        </section>
      </div>

      {/* Sticky Quick Booking Card */}
      <div className={styles.stickyQuickBooking}>
        <div className={styles.quickBookingCard}>
          <h3>Quick Book</h3>
          <div className={styles.priceDisplay}>
            <span className={styles.price}>
              ₹{selectedSportObj.price || venue.pricePerHour || 800}
            </span>
            <span className={styles.priceUnit}>/{selectedSportObj.duration || "hour"}</span>
            <span className={styles.startingPrice}>
              Starting price for {(selectedSport || venue.turfType || "").toLowerCase()}
            </span>
          </div>
          <button className={styles.bookNowBtn} onClick={handleBookNow}>Book Now</button>
          <div className={styles.shareActions}>
            <button className={styles.shareBtn}>
              <i className="fas fa-share-alt"></i> Share
            </button>
            <button className={styles.corporateBtn}>
              <i className="fas fa-building"></i> Corporate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
