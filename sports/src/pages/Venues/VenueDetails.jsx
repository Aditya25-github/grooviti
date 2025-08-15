import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './VenueDetails.module.css';

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Complete venues data that matches your Venues.jsx cards
  const venuesData = {
    1: {
      id: 1,
      name: 'Elite Cricket Ground',
      rating: 4.5,
      totalReviews: 324,
      location: 'Sector 18, Noida, Uttar Pradesh 201301',
      images: [
        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop'
      ],
      description: 'Professional cricket ground with modern facilities and flood lights for an exceptional playing experience.',
      
      timings: {
        weekdays: {
          slots: ['6 AM', '7 AM', '8 AM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM']
        },
        weekends: {
          slots: ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM']
        }
      },

      sports: {
        'Cricket': {
          price: 2500,
          duration: 'hour',
          description: 'Professional cricket ground with modern facilities',
          facilities: 'Professional turf, Floodlights, Changing rooms, Equipment rental'
        }
      },

      amenities: [
        { name: 'Parking', icon: 'fas fa-parking', available: true },
        { name: 'Washrooms', icon: 'fas fa-restroom', available: true },
        { name: 'Security', icon: 'fas fa-shield-alt', available: true },
        { name: 'Equipment Rental', icon: 'fas fa-tools', available: true },
        { name: 'Free WiFi', icon: 'fas fa-wifi', available: true },
        { name: 'Water Facility', icon: 'fas fa-tint', available: true },
        { name: 'Cafeteria', icon: 'fas fa-coffee', available: true },
        { name: 'First Aid', icon: 'fas fa-first-aid', available: true }
      ],

      reviews: [
        {
          id: 1,
          name: 'Rahul Sharma',
          rating: 5,
          comment: 'Excellent facilities and well-maintained turf. Perfect for weekend cricket matches with great lighting.',
          date: '2 days ago'
        },
        {
          id: 2,
          name: 'Vikas Kumar',
          rating: 4,
          comment: 'Great venue for cricket practice. Good parking space and clean facilities.',
          date: '1 week ago'
        }
      ]
    },
    2: {
      id: 2,
      name: 'Champions Football Turf',
      rating: 4.7,
      totalReviews: 156,
      location: 'Gurgaon, Haryana 122001',
      images: [
        'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop'
      ],
      description: 'FIFA standard artificial turf with proper drainage system and professional-grade playing surface.',
      
      timings: {
        weekdays: {
          slots: ['6 AM', '7 AM', '8 AM', '6 PM', '7 PM', '8 PM', '9 PM']
        },
        weekends: {
          slots: ['6 AM', '7 AM', '8 AM', '9 AM', '6 PM', '7 PM', '8 PM', '9 PM']
        }
      },

      sports: {
        'Football': {
          price: 1800,
          duration: 'hour',
          description: 'FIFA standard artificial turf field',
          facilities: 'Artificial turf, Floodlights, Changing rooms, Equipment rental'
        }
      },

      amenities: [
        { name: 'Parking', icon: 'fas fa-parking', available: true },
        { name: 'Washrooms', icon: 'fas fa-restroom', available: true },
        { name: 'Security', icon: 'fas fa-shield-alt', available: true },
        { name: 'Equipment Rental', icon: 'fas fa-tools', available: true },
        { name: 'Water Facility', icon: 'fas fa-tint', available: true },
        { name: 'Cafeteria', icon: 'fas fa-coffee', available: false },
        { name: 'Free WiFi', icon: 'fas fa-wifi', available: true },
        { name: 'First Aid', icon: 'fas fa-first-aid', available: true }
      ],

      reviews: [
        {
          id: 1,
          name: 'Arjun Patel',
          rating: 5,
          comment: 'Amazing football turf! Perfect surface quality and great for weekend games with friends.',
          date: '3 days ago'
        },
        {
          id: 2,
          name: 'Suresh Menon',
          rating: 4,
          comment: 'Good facility with proper drainage. Slightly expensive but worth it for the quality.',
          date: '5 days ago'
        }
      ]
    },
    3: {
      id: 3,
      name: 'Royal Cricket Academy',
      rating: 4.6,
      totalReviews: 189,
      location: 'Greater Kailash, Delhi 110048',
      images: [
        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop'
      ],
      description: 'Indoor cricket nets with bowling machines and professional coaching facilities.',
      
      timings: {
        weekdays: {
          slots: ['6 AM', '7 AM', '8 AM', '9 AM', '5 PM', '6 PM', '7 PM', '8 PM']
        },
        weekends: {
          slots: ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '5 PM', '6 PM', '7 PM', '8 PM']
        }
      },

      sports: {
        'Cricket': {
          price: 2200,
          duration: 'hour',
          description: 'Indoor cricket nets with bowling machines',
          facilities: 'Indoor nets, Bowling machine, Professional coaching, Air conditioning'
        }
      },

      amenities: [
        { name: 'Parking', icon: 'fas fa-parking', available: true },
        { name: 'Washrooms', icon: 'fas fa-restroom', available: true },
        { name: 'Security', icon: 'fas fa-shield-alt', available: true },
        { name: 'Equipment Rental', icon: 'fas fa-tools', available: true },
        { name: 'Professional Coaching', icon: 'fas fa-chalkboard-teacher', available: true },
        { name: 'Air Conditioning', icon: 'fas fa-snowflake', available: true },
        { name: 'Water Facility', icon: 'fas fa-tint', available: true },
        { name: 'Free WiFi', icon: 'fas fa-wifi', available: true }
      ],

      reviews: [
        {
          id: 1,
          name: 'Rohit Verma',
          rating: 5,
          comment: 'Excellent indoor nets with bowling machine. Perfect for practice sessions.',
          date: '1 day ago'
        }
      ]
    },
    4: {
      id: 4,
      name: 'Aqua Sports Complex',
      rating: 4.4,
      totalReviews: 267,
      location: 'CP, New Delhi 110001',
      images: [
        'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop'
      ],
      description: 'Olympic size swimming pool with temperature control and professional training facilities.',
      
      timings: {
        weekdays: {
          slots: ['6 AM', '7 AM', '8 AM', '9 AM', '6 PM', '7 PM', '8 PM']
        },
        weekends: {
          slots: ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '6 PM', '7 PM', '8 PM']
        }
      },

      sports: {
        'Swimming': {
          price: 800,
          duration: 'hour',
          description: 'Olympic size swimming pool with temperature control',
          facilities: 'Temperature controlled, Changing rooms, Swimming gear rental, Lifeguard'
        }
      },

      amenities: [
        { name: 'Parking', icon: 'fas fa-parking', available: true },
        { name: 'Washrooms', icon: 'fas fa-restroom', available: true },
        { name: 'Changing Rooms', icon: 'fas fa-door-open', available: true },
        { name: 'Lockers', icon: 'fas fa-key', available: true },
        { name: 'Swimming Gear Rental', icon: 'fas fa-tools', available: true },
        { name: 'Lifeguard', icon: 'fas fa-life-ring', available: true },
        { name: 'Water Facility', icon: 'fas fa-tint', available: true },
        { name: 'First Aid', icon: 'fas fa-first-aid', available: true }
      ],

      reviews: [
        {
          id: 1,
          name: 'Sneha Gupta',
          rating: 4,
          comment: 'Clean pool with good temperature control. Perfect for regular swimming sessions.',
          date: '4 days ago'
        }
      ]
    },
    5: {
      id: 5,
      name: 'Metro Football Arena',
      rating: 4.3,
      totalReviews: 134,
      location: 'Janakpuri, Delhi 110058',
      images: [
        'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop'
      ],
      description: 'Full-size football ground with natural grass and floodlights for evening matches.',
      
      timings: {
        weekdays: {
          slots: ['6 AM', '7 AM', '6 PM', '7 PM', '8 PM', '9 PM']
        },
        weekends: {
          slots: ['6 AM', '7 AM', '8 AM', '9 AM', '6 PM', '7 PM', '8 PM', '9 PM']
        }
      },

      sports: {
        'Football': {
          price: 2000,
          duration: 'hour',
          description: 'Full-size football ground with natural grass',
          facilities: 'Natural grass, Floodlights, Changing rooms, Goal posts'
        }
      },

      amenities: [
        { name: 'Parking', icon: 'fas fa-parking', available: true },
        { name: 'Washrooms', icon: 'fas fa-restroom', available: true },
        { name: 'Changing Rooms', icon: 'fas fa-door-open', available: true },
        { name: 'Water Facility', icon: 'fas fa-tint', available: true },
        { name: 'Floodlights', icon: 'fas fa-lightbulb', available: true },
        { name: 'Seating Area', icon: 'fas fa-chair', available: true }
      ],

      reviews: [
        {
          id: 1,
          name: 'Sanjay Reddy',
          rating: 4,
          comment: 'Good natural grass field. Great for weekend matches with proper lighting.',
          date: '6 days ago'
        }
      ]
    },
    6: {
      id: 6,
      name: 'Shuttle Arena',
      rating: 4.5,
      totalReviews: 89,
      location: 'Dwarka, New Delhi 110075',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop'
      ],
      description: 'Premium badminton courts with wooden flooring and air conditioning.',
      
      timings: {
        weekdays: {
          slots: ['6 AM', '7 AM', '8 AM', '6 PM', '7 PM', '8 PM', '9 PM']
        },
        weekends: {
          slots: ['6 AM', '7 AM', '8 AM', '9 AM', '6 PM', '7 PM', '8 PM', '9 PM']
        }
      },

      sports: {
        'Badminton': {
          price: 600,
          duration: 'hour',
          description: 'Premium badminton courts with wooden flooring',
          facilities: 'Wooden flooring, Air conditioning, Equipment rental, Professional lighting'
        }
      },

      amenities: [
        { name: 'Parking', icon: 'fas fa-parking', available: true },
        { name: 'Washrooms', icon: 'fas fa-restroom', available: true },
        { name: 'Air Conditioning', icon: 'fas fa-snowflake', available: true },
        { name: 'Equipment Rental', icon: 'fas fa-tools', available: true },
        { name: 'Water Facility', icon: 'fas fa-tint', available: true },
        { name: 'Professional Lighting', icon: 'fas fa-lightbulb', available: true }
      ],

      reviews: [
        {
          id: 1,
          name: 'Priya Singh',
          rating: 5,
          comment: 'Excellent courts with perfect wooden flooring. Great for competitive badminton.',
          date: '2 days ago'
        }
      ]
    },
    7: {
      id: 7,
      name: 'Grand Slam Tennis Club',
      rating: 4.8,
      totalReviews: 201,
      location: 'Vasant Kunj, Delhi 110070',
      images: [
        'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop'
      ],
      description: 'Professional tennis courts with clay and hard court options.',
      
      timings: {
        weekdays: {
          slots: ['6 AM', '7 AM', '8 AM', '6 PM', '7 PM', '8 PM']
        },
        weekends: {
          slots: ['6 AM', '7 AM', '8 AM', '9 AM', '6 PM', '7 PM', '8 PM']
        }
      },

      sports: {
        'Tennis': {
          price: 1200,
          duration: 'hour',
          description: 'Professional tennis courts with clay and hard surfaces',
          facilities: 'Clay courts, Hard courts, Equipment rental, Professional coaching'
        }
      },

      amenities: [
        { name: 'Parking', icon: 'fas fa-parking', available: true },
        { name: 'Washrooms', icon: 'fas fa-restroom', available: true },
        { name: 'Equipment Rental', icon: 'fas fa-tools', available: true },
        { name: 'Professional Coaching', icon: 'fas fa-chalkboard-teacher', available: true },
        { name: 'Water Facility', icon: 'fas fa-tint', available: true },
        { name: 'Changing Rooms', icon: 'fas fa-door-open', available: true }
      ],

      reviews: [
        {
          id: 1,
          name: 'Amit Agarwal',
          rating: 5,
          comment: 'Outstanding tennis facility with professional courts. Best in the city!',
          date: '1 day ago'
        }
      ]
    },
    8: {
      id: 8,
      name: 'Blue Waters Swimming Pool',
      rating: 4.2,
      totalReviews: 178,
      location: 'Rohini, Delhi 110085',
      images: [
        'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop'
      ],
      description: 'Semi-olympic pool with diving boards and kids section.',
      
      timings: {
        weekdays: {
          slots: ['6 AM', '7 AM', '8 AM', '6 PM', '7 PM', '8 PM']
        },
        weekends: {
          slots: ['6 AM', '7 AM', '8 AM', '9 AM', '6 PM', '7 PM', '8 PM']
        }
      },

      sports: {
        'Swimming': {
          price: 650,
          duration: 'hour',
          description: 'Semi-olympic pool with diving facility',
          facilities: 'Semi-olympic pool, Diving boards, Kids section, Changing rooms'
        }
      },

      amenities: [
        { name: 'Parking', icon: 'fas fa-parking', available: true },
        { name: 'Washrooms', icon: 'fas fa-restroom', available: true },
        { name: 'Changing Rooms', icon: 'fas fa-door-open', available: true },
        { name: 'Kids Section', icon: 'fas fa-child', available: true },
        { name: 'Diving Boards', icon: 'fas fa-swimmer', available: true },
        { name: 'Lifeguard', icon: 'fas fa-life-ring', available: true }
      ],

      reviews: [
        {
          id: 1,
          name: 'Deepika Shah',
          rating: 4,
          comment: 'Great pool for families with kids section. Clean and well-maintained.',
          date: '3 days ago'
        }
      ]
    }
  };

  // Load venue data based on ID
  useEffect(() => {
    const venueData = venuesData[parseInt(id)];
    if (venueData) {
      setVenue(venueData);
      // Set default selected sport to the first available sport
      const firstSport = Object.keys(venueData.sports)[0];
      setSelectedSport(firstSport);
    }
  }, [id]);

  // Loading state
  if (!venue) {
    return (
      <div className={styles.container}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          Loading venue details...
        </div>
      </div>
    );
  }

  // Image navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === venue.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? venue.images.length - 1 : prev - 1
    );
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
  };

  return (
    <div className={styles.container}>
      {/* Hero Image Section */}
      <section className={styles.heroSection}>
        <div className={styles.imageContainer}>
          <img 
            src={venue.images[currentImageIndex]} 
            alt={venue.name}
            className={styles.heroImage}
          />
          {venue.images.length > 1 && (
            <>
              <button className={styles.prevBtn} onClick={prevImage}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className={styles.nextBtn} onClick={nextImage}>
                <i className="fas fa-chevron-right"></i>
              </button>
              <div className={styles.imageIndicators}>
                {venue.images.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${
                      index === currentImageIndex ? styles.active : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Venue Basic Info Overlay */}
        <div className={styles.venueInfoOverlay}>
          <div className={styles.venueBasicInfo}>
            <h1>{venue.name}</h1>
            <div className={styles.ratingLocation}>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {[1,2,3,4,5].map(star => (
                    <i 
                      key={star}
                      className={`fas fa-star ${star <= Math.floor(venue.rating) ? styles.filled : ''}`}
                    />
                  ))}
                </div>
                <span>{venue.rating} ({venue.totalReviews} reviews)</span>
              </div>
              <div className={styles.location}>
                <i className="fas fa-map-marker-alt"></i>
                <span>{venue.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Venue Timing Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-clock"></i> Venue Timing
          </h2>
          <div className={styles.timingContainer}>
            <div className={styles.timingCategory}>
              <h4>Weekdays</h4>
              <div className={styles.timeSlots}>
                {venue.timings.weekdays.slots.map((slot, index) => (
                  <button
                    key={index}
                    className={`${styles.timeSlot} ${
                      selectedTimeSlot === slot ? styles.selected : ''
                    }`}
                    onClick={() => handleTimeSlotSelect(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.timingCategory}>
              <h4>Weekends</h4>
              <div className={styles.timeSlots}>
                {venue.timings.weekends.slots.map((slot, index) => (
                  <button
                    key={index}
                    className={`${styles.timeSlot} ${
                      selectedTimeSlot === slot ? styles.selected : ''
                    }`}
                    onClick={() => handleTimeSlotSelect(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Available Sports & Pricing */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-futbol"></i> Available Sports & Pricing
          </h2>
          <div className={styles.sportsContainer}>
            {Object.entries(venue.sports).map(([sport, details]) => (
              <div 
                key={sport}
                className={`${styles.sportCard} ${
                  selectedSport === sport ? styles.selectedSport : ''
                }`}
                onClick={() => handleSportSelect(sport)}
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
              <p>{venue.location}</p>
              <p className={styles.locationDescription}>{venue.description}</p>
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
            {venue.amenities.map((amenity, index) => (
              <div 
                key={index} 
                className={`${styles.amenityItem} ${
                  !amenity.available ? styles.unavailable : ''
                }`}
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
            {venue.reviews.map((review) => (
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
                        {[1,2,3,4,5].map(star => (
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
            <span className={styles.price}>₹{venue.sports[selectedSport]?.price || 800}</span>
            <span className={styles.priceUnit}>/{venue.sports[selectedSport]?.duration || 'hour'}</span>
            <span className={styles.startingPrice}>Starting price for {selectedSport.toLowerCase()}</span>
          </div>
          <button className={styles.bookNowBtn}>Book Now</button>
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
