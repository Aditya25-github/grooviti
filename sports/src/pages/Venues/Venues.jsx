import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Venues.module.css';
import PopularSports from "../../components/PopularSports/PopularSports";

const Venues = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [sortBy, setSortBy] = useState('All'); // Changed default
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const sportImages = {
    'Cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop',
    'Football': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
    'Swimming': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop',
    'Badminton': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
    'Tennis': 'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=400&h=300&fit=crop',
    'Table Tennis': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  };

  const venues = [
    {
      id: 1,
      name: 'Elite Cricket Ground',
      sport: 'Cricket',
      image: sportImages['Cricket'],
      description: 'Professional cricket ground with modern facilities and flood lights',
      location: 'Sector 18, Noida',
      size: '120m x 80m',
      price: 2500,
      slotsAvailable: 5,
      rating: 4.5,
      distance: 2.3,
      sportColor: '#4CAF50'
    },
    {
      id: 2,
      name: 'Champions Football Turf',
      sport: 'Football',
      image: sportImages['Football'],
      description: 'FIFA standard artificial turf with proper drainage system',
      location: 'Gurgaon, Haryana',
      size: '100m x 65m',
      price: 1800,
      slotsAvailable: 3,
      rating: 4.2,
      distance: 5.7,
      sportColor: '#2196F3'
    },
    {
      id: 3,
      name: 'Royal Cricket Academy',
      sport: 'Cricket',
      image: sportImages['Cricket'],
      description: 'Indoor cricket nets with bowling machines and professional coaching',
      location: 'Greater Kailash, Delhi',
      size: '110m x 75m',
      price: 2200,
      slotsAvailable: 4,
      rating: 4.7,
      distance: 3.1,
      sportColor: '#4CAF50'
    },
    {
      id: 4,
      name: 'Aqua Sports Complex',
      sport: 'Swimming',
      image: sportImages['Swimming'],
      description: 'Olympic size swimming pool with temperature control',
      location: 'CP, New Delhi',
      size: '50m x 25m',
      price: 800,
      slotsAvailable: 8,
      rating: 4.0,
      distance: 1.8,
      sportColor: '#00BCD4'
    },
    {
      id: 5,
      name: 'Metro Football Arena',
      sport: 'Football',
      image: sportImages['Football'],
      description: 'Full-size football ground with natural grass and floodlights',
      location: 'Janakpuri, Delhi',
      size: '105m x 68m',
      price: 2000,
      slotsAvailable: 2,
      rating: 4.3,
      distance: 4.2,
      sportColor: '#2196F3'
    },
    {
      id: 6,
      name: 'Shuttle Arena',
      sport: 'Badminton',
      image: sportImages['Badminton'],
      description: 'Premium badminton courts with wooden flooring',
      location: 'Dwarka, New Delhi',
      size: '13.4m x 6.1m',
      price: 600,
      slotsAvailable: 6,
      rating: 4.4,
      distance: 6.5,
      sportColor: '#9C27B0'
    },
    {
      id: 7,
      name: 'Grand Slam Tennis Club',
      sport: 'Tennis',
      image: sportImages['Tennis'],
      description: 'Professional tennis courts with clay and hard court options',
      location: 'Vasant Kunj, Delhi',
      size: '23.77m x 8.23m',
      price: 1200,
      slotsAvailable: 4,
      rating: 4.8,
      distance: 3.7,
      sportColor: '#FF9800'
    },
    {
      id: 8,
      name: 'Blue Waters Swimming Pool',
      sport: 'Swimming',
      image: sportImages['Swimming'],
      description: 'Semi-olympic pool with diving boards and kids section',
      location: 'Rohini, Delhi',
      size: '40m x 20m',
      price: 650,
      slotsAvailable: 10,
      rating: 3.9,
      distance: 7.2,
      sportColor: '#00BCD4'
    },
    {
      id: 9,
      name: 'Ping Pong Paradise',
      sport: 'Table Tennis',
      image: sportImages['Table Tennis'],
      description: 'Air-conditioned hall with 8 professional table tennis tables',
      location: 'Lajpat Nagar, Delhi',
      size: '8 Tables Available',
      price: 300,
      slotsAvailable: 12,
      rating: 4.1,
      distance: 2.9,
      sportColor: '#F44336'
    },
    {
      id: 10,
      name: 'Stadium Cricket Ground',
      sport: 'Cricket',
      image: sportImages['Cricket'],
      description: 'International standard cricket ground with pavilion seating',
      location: 'Pragati Maidan, Delhi',
      size: '150m x 120m',
      price: 3500,
      slotsAvailable: 2,
      rating: 4.9,
      distance: 4.8,
      sportColor: '#4CAF50'
    },
    {
      id: 11,
      name: 'Smash Badminton Center',
      sport: 'Badminton',
      image: sportImages['Badminton'],
      description: 'Multi-court badminton facility with professional lighting',
      location: 'Karol Bagh, Delhi',
      size: '6 Courts Available',
      price: 550,
      slotsAvailable: 8,
      rating: 4.2,
      distance: 3.4,
      sportColor: '#9C27B0'
    },
    {
      id: 12,
      name: 'Champions Tennis Academy',
      sport: 'Tennis',
      image: sportImages['Tennis'],
      description: 'Multiple courts with coaching facilities and equipment rental',
      location: 'South Extension, Delhi',
      size: '4 Courts Available',
      price: 1000,
      slotsAvailable: 6,
      rating: 4.6,
      distance: 2.1,
      sportColor: '#FF9800'
    },
    {
      id: 13,
      name: 'Professional Cricket Hub',
      sport: 'Cricket',
      image: sportImages['Cricket'],
      description: 'State-of-the-art cricket facility with multiple pitches and nets',
      location: 'Faridabad, Haryana',
      size: '130m x 90m',
      price: 2800,
      slotsAvailable: 3,
      rating: 4.4,
      distance: 8.1,
      sportColor: '#4CAF50'
    },
    {
      id: 14,
      name: 'Victory Football Ground',
      sport: 'Football',
      image: sportImages['Football'],
      description: 'Premium football turf with spectator seating and changing rooms',
      location: 'Indirapuram, Ghaziabad',
      size: '110m x 70m',
      price: 2200,
      slotsAvailable: 4,
      rating: 4.1,
      distance: 9.3,
      sportColor: '#2196F3'
    },
    {
      id: 15,
      name: 'Splash Swimming Academy',
      sport: 'Swimming',
      image: sportImages['Swimming'],
      description: 'Modern swimming complex with coaching programs for all ages',
      location: 'Vasundhara, Ghaziabad',
      size: '45m x 20m',
      price: 750,
      slotsAvailable: 6,
      rating: 4.3,
      distance: 7.9,
      sportColor: '#00BCD4'
    },
    {
      id: 16,
      name: 'Ace Badminton Club',
      sport: 'Badminton',
      image: sportImages['Badminton'],
      description: 'Premier badminton facility with tournament-grade courts',
      location: 'Mayur Vihar, Delhi',
      size: '10 Courts Available',
      price: 700,
      slotsAvailable: 12,
      rating: 4.5,
      distance: 5.2,
      sportColor: '#9C27B0'
    },
    {
      id: 17,
      name: 'Baseline Tennis Center',
      sport: 'Tennis',
      image: sportImages['Tennis'],
      description: 'Professional tennis courts with clay and synthetic surfaces',
      location: 'Alaknanda, Delhi',
      size: '6 Courts Available',
      price: 1400,
      slotsAvailable: 8,
      rating: 4.7,
      distance: 4.6,
      sportColor: '#FF9800'
    },
    {
      id: 18,
      name: 'Spin Masters Table Tennis',
      sport: 'Table Tennis',
      image: sportImages['Table Tennis'],
      description: 'Dedicated table tennis center with professional coaching',
      location: 'Tilak Nagar, Delhi',
      size: '12 Tables Available',
      price: 350,
      slotsAvailable: 15,
      rating: 4.0,
      distance: 6.8,
      sportColor: '#F44336'
    }
  ];

  // Handle venue card click navigation
  const handleVenueClick = (venueId) => {
    navigate(`/venues/${venueId}`);
  };

  // Comprehensive search function
  const searchVenues = (venues, query) => {
    if (!query.trim()) return venues;
    
    const searchTerm = query.toLowerCase();
    
    return venues.filter(venue => {
      return (
        venue.name.toLowerCase().includes(searchTerm) ||
        venue.sport.toLowerCase().includes(searchTerm) ||
        venue.description.toLowerCase().includes(searchTerm) ||
        venue.location.toLowerCase().includes(searchTerm) ||
        venue.size.toLowerCase().includes(searchTerm) ||
        venue.price.toString().includes(searchTerm) ||
        venue.slotsAvailable.toString().includes(searchTerm)
      );
    });
  };

  // Updated sorting function with "All" option
  const sortVenues = (venues, sortOption) => {
    const sortedVenues = [...venues];
    
    switch (sortOption) {
      case 'All':
        return sortedVenues; // Return venues in original order
      
      case 'Sort by Price':
        return sortedVenues.sort((a, b) => a.price - b.price); // Low to High
      
      case 'Sort by Rating':
        return sortedVenues.sort((a, b) => b.rating - a.rating); // High to Low
      
      case 'Sort by Distance':
        return sortedVenues.sort((a, b) => a.distance - b.distance); // Near to Far
      
      default:
        return sortedVenues;
    }
  };

  // Filter, search, and sort venues
  useEffect(() => {
    let filtered = venues;
    
    // First filter by sport
    if (selectedSport !== 'All Sports') {
      filtered = filtered.filter(venue => venue.sport === selectedSport);
    }
    
    // Then apply search
    filtered = searchVenues(filtered, searchQuery);
    
    // Finally apply sorting
    filtered = sortVenues(filtered, sortBy);
    
    setFilteredVenues(filtered);
    // Reset visible count when filters change
    setVisibleCount(6);
  }, [selectedSport, searchQuery, sortBy]);

  // Initialize with all venues
  useEffect(() => {
    const initialVenues = sortVenues(venues, sortBy);
    setFilteredVenues(initialVenues);
  }, []);

  // Function to handle sport selection from PopularSports component
  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handle load more venues
  const loadMoreVenues = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  // Get venues to display (limited by visibleCount)
  const venuesToDisplay = filteredVenues.slice(0, visibleCount);
  
  // Check if there are more venues to load
  const hasMoreVenues = visibleCount < filteredVenues.length;

  return (
    <div className={styles.container}>
      {/* Popular Sports Component */}
      <PopularSports onSportSelect={handleSportSelect} />

      {/* Available Venues Section */}
      <section className={styles.venuesSection}>
        <div className={styles.venuesHeader}>
          <h2 className={styles.venuesTitle}>
            {selectedSport === 'All Sports' 
              ? searchQuery 
                ? `Search Results (${filteredVenues.length})`
                : 'Available Venues'
              : `${selectedSport} Venues (${filteredVenues.length})`
            }
          </h2>
          <div className={styles.headerRight}>
            <div className={styles.searchContainer}>
              <input 
                type="text" 
                placeholder="Search venues..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search venues"
              />
              <button 
                className={styles.searchButton}
                aria-label="Search"
                type="button"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
            <select 
              value={sortBy} 
              onChange={handleSortChange}
              className={styles.filterSelect}
              aria-label="Sort venues"
            >
              <option value="All">All</option>
              <option value="Sort by Price">Sort by Price</option>
              <option value="Sort by Rating">Sort by Rating</option>
              <option value="Sort by Distance">Sort by Distance</option>
            </select>
          </div>
        </div>

        {filteredVenues.length === 0 ? (
          <div className={styles.noVenues}>
            <div className={styles.noVenuesIcon}>
              <i className="fas fa-search"></i>
            </div>
            <p>
              {searchQuery 
                ? `No venues found for "${searchQuery}". Try different keywords.`
                : `No venues found for ${selectedSport}. Try selecting a different sport.`
              }
            </p>
          </div>
        ) : (
          <div className={styles.venuesGrid}>
            {venuesToDisplay.map((venue) => (
              <div 
                key={venue.id} 
                className={styles.venueCard}
                onClick={() => handleVenueClick(venue.id)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${venue.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleVenueClick(venue.id);
                  }
                }}
              >
                <div className={styles.venueImage}>
                  <img 
                    src={venue.image} 
                    alt={venue.name}
                    loading="lazy"
                  />
                  <span 
                    className={styles.sportTag}
                    style={{ backgroundColor: venue.sportColor }}
                  >
                    {venue.sport}
                  </span>
                  {venue.rating && (
                    <div className={styles.ratingBadge}>
                      <i className="fas fa-star"></i>
                      {venue.rating}
                    </div>
                  )}
                </div>
                <div className={styles.venueInfo}>
                  <h3>{venue.name}</h3>
                  <p className={styles.venueDescription}>{venue.description}</p>
                  <div className={styles.venueDetails}>
                    <span className={styles.location}>
                      <i className="fas fa-map-marker-alt"></i> {venue.location}
                    </span>
                    <span className={styles.size}>
                      <i className="fas fa-ruler-combined"></i> {venue.size}
                    </span>
                    {venue.distance && (
                      <span className={styles.distance}>
                        <i className="fas fa-route"></i> {venue.distance} km away
                      </span>
                    )}
                  </div>
                  <div className={styles.venueFooter}>
                    <span className={styles.price}>₹{venue.price.toLocaleString()}/hr</span>
                    <span className={styles.availability}>
                      {venue.slotsAvailable} slots available
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show Load More button only if there are more venues to load */}
        {filteredVenues.length > 0 && hasMoreVenues && (
          <button 
            className={styles.loadMoreBtn}
            onClick={loadMoreVenues}
            aria-label="Load more venues"
          >
            Load More Venues
            <i className="fas fa-chevron-down"></i>
          </button>
        )}

        {/* Show message when all venues are loaded */}
        {filteredVenues.length > 6 && !hasMoreVenues && (
          <div className={styles.allLoadedMessage}>
            <p>All venues loaded ({filteredVenues.length} total)</p>
          </div>
        )}
      </section>

      {/* Spacer to push content to footer */}
      <div className={styles.spacer}></div>
    </div>
  );
};

export default Venues;
