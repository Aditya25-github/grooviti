import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PlayTogether.module.css';

const PlayTogether = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [sortBy, setSortBy] = useState('Recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const sports = [
    { name: 'All Sports' },
    { name: 'Cricket' },
    { name: 'Football' },
    { name: 'Badminton' },
    { name: 'Swimming' },
    { name: 'Tennis' },
    { name: 'Table Tennis' }
  ];

  // Function to generate DiceBear avatar URLs
  const getDiceBearAvatar = (name, size = 150) => {
    const seed = name.toLowerCase().replace(/\s+/g, '_');
    return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}&size=${size}&backgroundColor=f0f0f0`;
  };

  const players = [
    {
      id: 1,
      name: 'Rahul Sharma',
      sport: 'Cricket',
      profileImage: getDiceBearAvatar('Rahul Sharma'),
      description: 'Looking for cricket teammates for weekend matches. Experienced batsman seeking bowlers and all-rounders.',
      location: 'Sector 18, Noida',
      skillLevel: 'Intermediate',
      availability: 'Weekends',
      lookingFor: 'Team Players',
      age: 25,
      experience: '5 years',
      sportColor: '#4CAF50',
      timePosted: '2 hours ago',
      // Added enrollment data
      enrolled: {
        current: 4,
        total: 8,
        teamType: 'Cricket Team'
      }
    },
    {
      id: 2,
      name: 'Priya Singh',
      sport: 'Badminton',
      profileImage: getDiceBearAvatar('Priya Singh'),
      description: 'Advanced badminton player looking for doubles partner for tournaments and regular practice sessions.',
      location: 'Gurgaon, Haryana',
      skillLevel: 'Advanced',
      availability: 'Evenings',
      lookingFor: 'Doubles Partner',
      age: 28,
      experience: '8 years',
      sportColor: '#9C27B0',
      timePosted: '4 hours ago',
      enrolled: {
        current: 1,
        total: 2,
        teamType: 'Doubles Team'
      }
    },
    {
      id: 3,
      name: 'Arjun Patel',
      sport: 'Football',
      profileImage: getDiceBearAvatar('Arjun Patel'),
      description: 'Midfielder seeking team for local league. Good passing skills and team coordination.',
      location: 'CP, New Delhi',
      skillLevel: 'Intermediate',
      availability: 'Weekends',
      lookingFor: 'Team',
      age: 22,
      experience: '6 years',
      sportColor: '#2196F3',
      timePosted: '6 hours ago',
      enrolled: {
        current: 7,
        total: 11,
        teamType: 'Football Team'
      }
    },
    {
      id: 4,
      name: 'Sneha Gupta',
      sport: 'Swimming',
      profileImage: getDiceBearAvatar('Sneha Gupta'),
      description: 'Competitive swimmer looking for training partner. Focus on freestyle and butterfly strokes.',
      location: 'Rohini, Delhi',
      skillLevel: 'Advanced',
      availability: 'Mornings',
      lookingFor: 'Training Partner',
      age: 24,
      experience: '10 years',
      sportColor: '#00BCD4',
      timePosted: '8 hours ago',
      enrolled: {
        current: 2,
        total: 4,
        teamType: 'Training Group'
      }
    },
    {
      id: 5,
      name: 'Vikram Kumar',
      sport: 'Tennis',
      profileImage: getDiceBearAvatar('Vikram Kumar'),
      description: 'Tennis enthusiast seeking regular playing partner. Prefer someone with similar skill level.',
      location: 'Vasant Kunj, Delhi',
      skillLevel: 'Beginner',
      availability: 'Flexible',
      lookingFor: 'Playing Partner',
      age: 30,
      experience: '2 years',
      sportColor: '#FF9800',
      timePosted: '10 hours ago',
      enrolled: {
        current: 1,
        total: 2,
        teamType: 'Tennis Pair'
      }
    },
    {
      id: 6,
      name: 'Anita Rao',
      sport: 'Table Tennis',
      profileImage: getDiceBearAvatar('Anita Rao'),
      description: 'Table tennis player looking for opponents and practice partners. Love playing competitive matches.',
      location: 'Lajpat Nagar, Delhi',
      skillLevel: 'Intermediate',
      availability: 'Evenings',
      lookingFor: 'Opponent',
      age: 26,
      experience: '4 years',
      sportColor: '#F44336',
      timePosted: '12 hours ago',
      enrolled: {
        current: 3,
        total: 6,
        teamType: 'Practice Group'
      }
    },
    {
      id: 7,
      name: 'Rohit Verma',
      sport: 'Cricket',
      profileImage: getDiceBearAvatar('Rohit Verma'),
      description: 'Fast bowler looking to join cricket team. Available for practice sessions and matches.',
      location: 'Greater Kailash, Delhi',
      skillLevel: 'Advanced',
      availability: 'Weekends',
      lookingFor: 'Team',
      age: 27,
      experience: '9 years',
      sportColor: '#4CAF50',
      timePosted: '1 day ago',
      enrolled: {
        current: 6,
        total: 11,
        teamType: 'Cricket Team'
      }
    },
    {
      id: 8,
      name: 'Kavya Joshi',
      sport: 'Badminton',
      profileImage: getDiceBearAvatar('Kavya Joshi'),
      description: 'Beginner badminton player seeking coach or experienced player for guidance and practice.',
      location: 'Dwarka, New Delhi',
      skillLevel: 'Beginner',
      availability: 'Weekdays',
      lookingFor: 'Mentor/Coach',
      age: 21,
      experience: '1 year',
      sportColor: '#9C27B0',
      timePosted: '1 day ago',
      enrolled: {
        current: 1,
        total: 3,
        teamType: 'Learning Group'
      }
    },
    {
      id: 9,
      name: 'Suresh Menon',
      sport: 'Football',
      profileImage: getDiceBearAvatar('Suresh Menon'),
      description: 'Goalkeeper with 7 years experience looking for team. Excellent reflexes and leadership skills.',
      location: 'Janakpuri, Delhi',
      skillLevel: 'Advanced',
      availability: 'Weekends',
      lookingFor: 'Team',
      age: 29,
      experience: '7 years',
      sportColor: '#2196F3',
      timePosted: '2 days ago',
      enrolled: {
        current: 8,
        total: 11,
        teamType: 'Football Team'
      }
    },
    {
      id: 10,
      name: 'Deepika Shah',
      sport: 'Swimming',
      profileImage: getDiceBearAvatar('Deepika Shah'),
      description: 'Recreational swimmer looking for swimming buddy. Focus on fitness and technique improvement.',
      location: 'Vasundhara, Ghaziabad',
      skillLevel: 'Intermediate',
      availability: 'Mornings',
      lookingFor: 'Swimming Buddy',
      age: 32,
      experience: '5 years',
      sportColor: '#00BCD4',
      timePosted: '2 days ago',
      enrolled: {
        current: 2,
        total: 4,
        teamType: 'Swimming Group'
      }
    },
    // Continue with remaining players with similar enrollment data...
    {
      id: 11,
      name: 'Amit Agarwal',
      sport: 'Tennis',
      profileImage: getDiceBearAvatar('Amit Agarwal'),
      description: 'Experienced tennis player seeking doubles partner for club tournaments and weekend games.',
      location: 'South Extension, Delhi',
      skillLevel: 'Advanced',
      availability: 'Weekends',
      lookingFor: 'Doubles Partner',
      age: 35,
      experience: '12 years',
      sportColor: '#FF9800',
      timePosted: '3 days ago',
      enrolled: {
        current: 1,
        total: 2,
        teamType: 'Doubles Team'
      }
    },
    {
      id: 12,
      name: 'Ravi Krishnan',
      sport: 'Table Tennis',
      profileImage: getDiceBearAvatar('Ravi Krishnan'),
      description: 'Professional table tennis player looking for challenging opponents and practice partners.',
      location: 'Karol Bagh, Delhi',
      skillLevel: 'Professional',
      availability: 'Daily',
      lookingFor: 'Challenging Opponent',
      age: 31,
      experience: '15 years',
      sportColor: '#F44336',
      timePosted: '3 days ago',
      enrolled: {
        current: 4,
        total: 8,
        teamType: 'Practice League'
      }
    }
  ];

  // Handle player card click navigation
  const handlePlayerClick = (playerId) => {
    navigate(`/communities/${playerId}`);
  };

  // Comprehensive search function
  const searchPlayers = (players, query) => {
    if (!query.trim()) return players;
    
    const searchTerm = query.toLowerCase();
    
    return players.filter(player => {
      return (
        player.name.toLowerCase().includes(searchTerm) ||
        player.sport.toLowerCase().includes(searchTerm) ||
        player.description.toLowerCase().includes(searchTerm) ||
        player.location.toLowerCase().includes(searchTerm) ||
        player.skillLevel.toLowerCase().includes(searchTerm) ||
        player.availability.toLowerCase().includes(searchTerm) ||
        player.lookingFor.toLowerCase().includes(searchTerm) ||
        player.age.toString().includes(searchTerm) ||
        player.experience.toLowerCase().includes(searchTerm)
      );
    });
  };

  // Filter and search players
  useEffect(() => {
    let filtered = players;
    
    // First filter by sport
    if (selectedSport !== 'All Sports') {
      filtered = filtered.filter(player => player.sport === selectedSport);
    }
    
    // Then apply search
    filtered = searchPlayers(filtered, searchQuery);
    
    setFilteredPlayers(filtered);
    // Reset visible count when filters change
    setVisibleCount(6);
  }, [selectedSport, searchQuery]);

  // Initialize with all players
  useEffect(() => {
    setFilteredPlayers(players);
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle sport selection
  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
  };

  // Handle load more players
  const loadMorePlayers = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  // Get players to display (limited by visibleCount)
  const playersToDisplay = filteredPlayers.slice(0, visibleCount);
  
  // Check if there are more players to load
  const hasMorePlayers = visibleCount < filteredPlayers.length;

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>Find Your Sports Partner</h1>
          <p className={styles.subtitle}>Connect with players, find teammates, and join the sports community</p>
          
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search for players, sports, locations..."
              className={styles.mainSearchInput}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className={styles.searchButton}>Search</button>
          </div>

          <div className={styles.sportsCategories}>
            {sports.map((sport, index) => (
              <button
                key={index}
                className={`${styles.sportButton} ${
                  selectedSport === sport.name ? styles.active : ''
                }`}
                onClick={() => handleSportSelect(sport.name)}
              >
                {sport.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Available Players Section */}
      <section className={styles.playersSection}>
        <div className={styles.playersHeader}>
          <h2>
            {selectedSport === 'All Sports' 
              ? searchQuery 
                ? `Search Results (${filteredPlayers.length})`
                : 'Players Looking to Connect'
              : `${selectedSport} Players (${filteredPlayers.length})`
            }
          </h2>
          <div className={styles.headerRight}>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option>Sort by Recent</option>
              <option>Sort by Skill Level</option>
              <option>Sort by Location</option>
            </select>
          </div>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className={styles.noPlayers}>
            <p>
              {searchQuery 
                ? `No players found for "${searchQuery}". Try different keywords.`
                : `No players found for ${selectedSport}. Try selecting a different sport.`
              }
            </p>
          </div>
        ) : (
          <div className={styles.playersGrid}>
            {playersToDisplay.map((player) => (
              <div 
                key={player.id} 
                className={styles.playerCard}
                onClick={() => handlePlayerClick(player.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.profileSection}>
                    <img src={player.profileImage} alt={player.name} className={styles.profileImage} />
                    <div className={styles.playerBasicInfo}>
                      <h3>{player.name}</h3>
                      <div className={styles.playerMeta}>
                        <span className={styles.timePosted}>{player.timePosted}</span>
                        <span 
                          className={styles.sportBadge}
                          style={{ backgroundColor: player.sportColor }}
                        >
                          {player.sport}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.skillLevel}>
                    {player.skillLevel}
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <p className={styles.playerDescription}>{player.description}</p>
                  
                  <div className={styles.playerDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailItem}>
                        <i className="fas fa-map-marker-alt"></i>
                        {player.location}
                      </span>
                      <span className={styles.detailItem}>
                        <i className="fas fa-clock"></i>
                        {player.availability}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailItem}>
                        <i className="fas fa-search"></i>
                        {player.lookingFor}
                      </span>
                      <span className={styles.detailItem}>
                        <i className="fas fa-trophy"></i>
                        {player.experience}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.footerLeft}>
                    <span className={styles.age}>Age: {player.age}</span>
                    <span className={styles.enrollment}>
                      <i className="fas fa-users"></i>
                      {player.enrolled.current}/{player.enrolled.total} enrolled
                    </span>
                  </div>
                  <button 
                    className={styles.connectBtn}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when button is clicked
                      handlePlayerClick(player.id);
                    }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show Load More button only if there are more players to load */}
        {filteredPlayers.length > 0 && hasMorePlayers && (
          <button 
            className={styles.loadMoreBtn}
            onClick={loadMorePlayers}
          >
            Load More Players
          </button>
        )}

        {/* Show message when all players are loaded */}
        {filteredPlayers.length > 6 && !hasMorePlayers && (
          <div className={styles.allLoadedMessage}>
            <p>All players loaded ({filteredPlayers.length} total)</p>
          </div>
        )}
      </section>

      {/* Spacer to push content to footer */}
      <div className={styles.spacer}></div>
    </div>
  );
};

export default PlayTogether;
