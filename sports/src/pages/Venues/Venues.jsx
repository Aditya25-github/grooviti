import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from "../../context/StoreContext";
import { useContext } from 'react';
import styles from './Venues.module.css';
import PopularSports from "../../components/PopularSports/PopularSports";

const Venues = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [sortBy, setSortBy] = useState('All'); // Changed default
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
    const [venues, setVenues] = useState([]);
  const { url } = useContext(StoreContext);

  const sportImages = {
    'Cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop',
    'Football': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
    'Swimming': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop',
    'Badminton': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
    'Tennis': 'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=400&h=300&fit=crop',
    'Table Tennis': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  };

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

  useEffect(() => {
  const fetchVenues = async () => {
    try {
      const res = await axios.get(`${url}/api/turfs/All`);
      if (res.data.success && res.data.turfs) {
        setVenues(res.data.turfs);
        // Also sort them based on initial sort option
        const sorted = sortVenues(res.data.turfs, sortBy);
        setFilteredVenues(sorted);
      } else {
        console.warn("Invalid venue response structure");
      }
    } catch (err) {
      console.error("Failed to fetch venues:", err);
    }
  };

  fetchVenues();
}, []);

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
                    <span className={styles.price}>₹{venue.pricePerHour.toLocaleString()}/hr</span>
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
