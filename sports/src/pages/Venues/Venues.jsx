import React, { useState, useEffect,useContext} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Venues.module.css";
import PopularSports from "../../components/PopularSports/PopularSports";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";  
const sportImages = {
  Cricket: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop",
  Football: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop",
  Swimming: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop",
  Badminton: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
  Tennis: "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=400&h=300&fit=crop",
  "Table Tennis": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
};

const Venues = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [sortBy, setSortBy] = useState("Price");
  const [searchQuery, setSearchQuery] = useState("");
  const [allVenues, setAllVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const { url } = useContext(StoreContext);
  // Fetch turfs from backend API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get(`${url}/api/turfs/all`);
        if (res.data.success && Array.isArray(res.data.turfs)) {
          setAllVenues(res.data.turfs);
          setFilteredVenues(res.data.turfs);
        } else {
          setAllVenues([]);
          setFilteredVenues([]);
        }
      } catch (error) {
        setAllVenues([]);
        setFilteredVenues([]);
        console.log("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, [url]);
console.log("All venues fetched:", allVenues);
  const handleVenueClick = (venueId) => {
    navigate(`/venues/${venueId}`);
  };

  const searchVenues = (venues, query) => {
    if (!query.trim()) return venues;
    const searchTerm = query.toLowerCase();
    return venues.filter((venue) =>
      (venue.name?.toLowerCase().includes(searchTerm) ||
        venue.description?.toLowerCase().includes(searchTerm) ||
        venue.city?.toLowerCase().includes(searchTerm) ||
        venue.state?.toLowerCase().includes(searchTerm) ||
        venue.address?.toLowerCase().includes(searchTerm))
    );
  };

  useEffect(() => {
    let filtered = allVenues;

    if (selectedSport !== "All Sports") {
      filtered = filtered.filter(
        (venue) =>
          venue.turfType === selectedSport
      );
    }

    filtered = searchVenues(filtered, searchQuery);

    if (sortBy === "Price") {
      filtered = [...filtered].sort(
        (a, b) => Number(a.pricePerHour || a.price) - Number(b.pricePerHour || b.price)
      );
    } else if (sortBy === "Rating") {
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredVenues(filtered);
    setVisibleCount(6);
  }, [selectedSport, searchQuery, sortBy, allVenues]);

  const handleSportSelect = (sport) => setSelectedSport(sport);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const loadMoreVenues = () => setVisibleCount((prev) => prev + 6);

  const venuesToDisplay = filteredVenues.slice(0, visibleCount);
  const hasMoreVenues = visibleCount < filteredVenues.length;

  return (
    <div className={styles.container}>
      <PopularSports onSportSelect={handleSportSelect} />

      <section className={styles.venuesSection}>
        <div className={styles.venuesHeader}>
          <h2>
            {selectedSport === "All Sports"
              ? searchQuery
                ? `Search Results (${filteredVenues.length})`
                : "Available Venues"
              : `${selectedSport} Venues (${filteredVenues.length})`}
          </h2>
          <div className={styles.headerRight}>
            <input
              type="text"
              placeholder="Search venues, locations, facilities..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="Price">Sort by Price</option>
              <option value="Rating">Sort by Rating</option>
              <option value="Distance">Sort by Distance</option>
            </select>
          </div>
        </div>

        {filteredVenues.length === 0 ? (
          <div className={styles.noVenues}>
            <p>
              {searchQuery
                ? `No venues found for "${searchQuery}". Try different keywords.`
                : `No venues found for ${selectedSport}.`}
            </p>
          </div>
        ) : (
          <div className={styles.venuesGrid}>
            {venuesToDisplay.map((venue) => (
              <div
                key={venue._id}
                className={styles.venueCard}
                onClick={() => handleVenueClick(venue._id)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.venueImage}>
                  <img
                    src={
                      venue.image ||
                      (venue.turfType && sportImages[venue.turfType]) ||
                      "https://via.placeholder.com/400x300?text=Venue"
                    }
                    alt={venue.name}
                  />
                  <span
                    className={styles.sportTag}
                    style={{
                      backgroundColor:
                        venue.sportColor ||
                        (venue.turfType === "Cricket"
                          ? "#4CAF50"
                          : venue.turfType === "Football"
                          ? "#2196F3"
                          : venue.turfType === "Swimming"
                          ? "#00BCD4"
                          : venue.turfType === "Badminton"
                          ? "#9C27B0"
                          : venue.turfType === "Tennis"
                          ? "#FF9800"
                          : venue.turfType === "Table Tennis"
                          ? "#F44336"
                          : "#00b894"),
                    }}
                  >
                    {venue.turfType}
                  </span>
                </div>
                <div className={styles.venueInfo}>
                  <h3>{venue.name}</h3>
                  <p className={styles.venueDescription}>{venue.description}</p>
                  <div className={styles.venueDetails}>
                    <span className={styles.location}>
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      {(venue.address ? venue.address + ", " : "") +
                        (venue.city || "") +
                        (venue.state ? ", " + venue.state : "")}
                    </span>
                  </div>
                  <div className={styles.venueFooter}>
                    <span className={styles.price}>
                      ₹{venue.pricePerHour ?? venue.price}/hr
                    </span>
                    {venue.rating !== undefined && (
                      <span className={styles.rating}>
                        <i className="fas fa-star"></i> {venue.rating}
                        {venue.totalReviews ? ` (${venue.totalReviews})` : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredVenues.length > 0 && hasMoreVenues && (
          <button className={styles.loadMoreBtn} onClick={loadMoreVenues}>
            Load More Venues
          </button>
        )}
        {filteredVenues.length > 6 && !hasMoreVenues && (
          <div className={styles.allLoadedMessage}>
            <p>All venues loaded ({filteredVenues.length} total)</p>
          </div>
        )}
      </section>
      <div className={styles.spacer}></div>
    </div>
  );
};

export default Venues;
