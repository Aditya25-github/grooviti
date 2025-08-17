import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from './VenueDetails.module.css';
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const fallbackImages = [
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop'
];

// helper: always "YYYY-MM-DD"
const toLocalYMD = (d) => {
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().split("T")[0];
};

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  // next 7 days
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

  // state
  const [selectedDate, setSelectedDate] = useState(() => toLocalYMD(new Date()));
  const [venue, setVenue] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // fetch venue
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        let backendVenue = null;
        try {
          const res = await axios.get(`${url}/api/turfs/${id}`);
          backendVenue = res.data.turf || res.data;
        } catch {
          const res = await axios.get(`${url}/api/turfs/all`);
          backendVenue = res.data.turfs?.find(t => t._id === id);
        }
        setVenue(backendVenue || null);

        if (backendVenue) {
          if (backendVenue.sports && Object.keys(backendVenue.sports).length) {
            setSelectedSport(Object.keys(backendVenue.sports)[0]);
          } else if (backendVenue.turfType) {
            setSelectedSport(backendVenue.turfType);
          }
        }
      } catch {
        setVenue(null);
      }
    };
    fetchVenue();
  }, [id, url]);

  // fetch slots when venue/date change
  useEffect(() => {
    if (!venue?._id || !selectedDate) return;
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setErrorSlots("");
        console.log("Fetching slots with:", {
          turfId: venue._id,
          date: selectedDate,
        });
        const res = await axios.get(`${url}/api/slots/by-date`, {
          params: { turfId: venue._id, date: selectedDate },
        });
        console.log("Raw slot response:", res.data);

        // handle if backend sends {slots: []}
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.slots || [];
        setSlots(data);
      } catch (e) {
        setErrorSlots("Failed to load slots");
        console.error("Error fetching slots:", e);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [venue, selectedDate, url]);

  // reset image index
  useEffect(() => {
    setCurrentImageIndex(0);
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
  const nextImage = () => setCurrentImageIndex(i => (i + 1) % numImages);
  const prevImage = () => setCurrentImageIndex(i => (i - 1 + numImages) % numImages);
  const handleIndicatorClick = (idx) => setCurrentImageIndex(idx);

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

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  };

  const handleBookNow = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and a slot first.");
      return;
    }
    navigate(
      `/book?turfId=${venue._id}&slotId=${selectedTimeSlot}&date=${selectedDate}&sport=${encodeURIComponent(selectedSport)}`
    );
  };
  return (
    <div className={styles.container}>
      {/* Hero Image Section */}
      <section className={styles.heroSection}>
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
            aria-label="Previous"
            disabled={numImages < 2}
            tabIndex={0}
            style={numImages < 2 ? { opacity: 0.4, pointerEvents:'none' } : undefined}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className={styles.nextBtn}
            onClick={nextImage}
            aria-label="Next"
            disabled={numImages < 2}
            tabIndex={0}
            style={numImages < 2 ? { opacity: 0.4, pointerEvents:'none' } : undefined}
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
                tabIndex={0}
                style={numImages < 2 ? { opacity: 0.4, pointerEvents:'none' } : undefined}
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

      <div className={styles.mainContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-clock"></i> Venue Timing
          </h2>

          {/* Date blocks (next 7 days) */}
          <div>
            <h4>Select a Date</h4>
            <div className={styles.timeSlots}>
              {next7Days.map((d) => (
                <button
                  key={d.value}
                  className={`${styles.timeSlot} ${selectedDate === d.value ? styles.selected : ""}`}
                  onClick={() => {
                    setSelectedDate(d.value);
                    setSelectedTimeSlot("");
                  }}
                  type="button"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slots from backend */}
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
                  {slots.map((slot) => {
  const isAvailable =
    slot.status === "available" &&
    (slot.bookedTickets ?? 0) < (slot.totalTickets ?? 1);

  // Convert slot times to 24-hour HH:mm
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);
  const formatTime = (d) =>
    `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

  return (
    <button
      key={slot._id}
      className={`${styles.timeSlot} ${selectedTimeSlot === slot._id ? styles.selected : ""} ${!isAvailable ? styles.unavailableSlot : ""}`}
      onClick={() => isAvailable && handleTimeSlotSelect(slot._id)}
      type="button"
      disabled={!isAvailable}
      title={`${formatTime(start)} – ${formatTime(end)}`}
    >
      {formatTime(start)} – {formatTime(end)}
      {!isAvailable ? " (Unavailable)" : ""}
    </button>
  );
})}

                </div>
              )}
            </div>
          </div>
        </section>

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

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-star"></i> Amenities
          </h2>
          <div className={styles.amenitiesGrid}>
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className={`${styles.amenityItem} ${!amenity.available ? styles.unavailable : ''}`}
              >
                <i className={`${amenity.icon} ${styles.amenityIcon}`}></i>
                <span>{amenity.name}</span>
                {!amenity.available && <span className={styles.unavailableLabel}>Not Available</span>}
              </div>
            ))}
          </div>
        </section>

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
