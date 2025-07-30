import React, { useState, useEffect } from 'react';
import styles from './Academy.module.css';

const Academy = () => {
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [sortBy, setSortBy] = useState('Price');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAcademies, setFilteredAcademies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const sports = [
    { name: 'All Sports' },
    { name: 'Cricket' },
    { name: 'Football' },
    { name: 'Badminton' },
    { name: 'Swimming' },
    { name: 'Tennis' }
  ];

  const sportImages = {
    'Cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop',
    'Football': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
    'Swimming': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop',
    'Badminton': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
    'Tennis': 'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=400&h=300&fit=crop',
    'Table Tennis': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  };

  const academies = [
    {
      id: 1,
      name: 'Elite Cricket Academy',
      sport: 'Cricket',
      image: sportImages['Cricket'],
      description: 'Professional cricket training with certified coaches and modern facilities',
      location: 'Sector 18, Noida',
      coachName: 'Rahul Sharma',
      coachingType: 'Individual & Group',
      monthlyFee: 5000,
      rating: 4.5,
      studentsEnrolled: 120,
      sportColor: '#4CAF50'
    },
    {
      id: 2,
      name: 'Champions Football Academy',
      sport: 'Football',
      image: sportImages['Football'],
      description: 'FIFA certified coaching with focus on technique and tactical development',
      location: 'Gurgaon, Haryana',
      coachName: 'Sunil Chhetri',
      coachingType: 'Group Training',
      monthlyFee: 4000,
      rating: 4.7,
      studentsEnrolled: 85,
      sportColor: '#2196F3'
    },
    {
      id: 3,
      name: 'Royal Cricket Training Center',
      sport: 'Cricket',
      image: sportImages['Cricket'],
      description: 'Advanced cricket coaching with video analysis and fitness training',
      location: 'Greater Kailash, Delhi',
      coachName: 'Virat Kumar',
      coachingType: 'Individual & Group',
      monthlyFee: 5500,
      rating: 4.6,
      studentsEnrolled: 95,
      sportColor: '#4CAF50'
    },
    {
      id: 4,
      name: 'AquaLife Swimming Academy',
      sport: 'Swimming',
      image: sportImages['Swimming'],
      description: 'Learn swimming from basics to competitive levels with expert instructors',
      location: 'CP, New Delhi',
      coachName: 'Priya Singh',
      coachingType: 'Individual & Group',
      monthlyFee: 3500,
      rating: 4.4,
      studentsEnrolled: 200,
      sportColor: '#00BCD4'
    },
    {
      id: 5,
      name: 'Metro Football Training',
      sport: 'Football',
      image: sportImages['Football'],
      description: 'Youth football development program with professional coaching staff',
      location: 'Janakpuri, Delhi',
      coachName: 'Arjun Menon',
      coachingType: 'Group Training',
      monthlyFee: 3800,
      rating: 4.3,
      studentsEnrolled: 110,
      sportColor: '#2196F3'
    },
    {
      id: 6,
      name: 'Shuttle Badminton Academy',
      sport: 'Badminton',
      image: sportImages['Badminton'],
      description: 'Comprehensive badminton training with tournament preparation',
      location: 'Dwarka, New Delhi',
      coachName: 'Saina Gupta',
      coachingType: 'Individual & Group',
      monthlyFee: 4200,
      rating: 4.5,
      studentsEnrolled: 75,
      sportColor: '#9C27B0'
    },
    {
      id: 7,
      name: 'Grand Slam Tennis Academy',
      sport: 'Tennis',
      image: sportImages['Tennis'],
      description: 'Professional tennis coaching for all ages with court technique focus',
      location: 'Vasant Kunj, Delhi',
      coachName: 'Leander Paes',
      coachingType: 'Individual Training',
      monthlyFee: 6000,
      rating: 4.8,
      studentsEnrolled: 60,
      sportColor: '#FF9800'
    },
    {
      id: 8,
      name: 'Blue Wave Swimming School',
      sport: 'Swimming',
      image: sportImages['Swimming'],
      description: 'Swimming lessons for beginners to advanced with safety focus',
      location: 'Rohini, Delhi',
      coachName: 'Ankita Raina',
      coachingType: 'Group Training',
      monthlyFee: 3200,
      rating: 4.2,
      studentsEnrolled: 150,
      sportColor: '#00BCD4'
    },
    {
      id: 9,
      name: 'Spin Masters Table Tennis',
      sport: 'Table Tennis',
      image: sportImages['Table Tennis'],
      description: 'Table tennis coaching with emphasis on technique and match play',
      location: 'Lajpat Nagar, Delhi',
      coachName: 'Sharath Kamal',
      coachingType: 'Individual & Group',
      monthlyFee: 2800,
      rating: 4.3,
      studentsEnrolled: 90,
      sportColor: '#F44336'
    },
    {
      id: 10,
      name: 'Stadium Cricket Institute',
      sport: 'Cricket',
      image: sportImages['Cricket'],
      description: 'Premier cricket academy with former international players as coaches',
      location: 'Pragati Maidan, Delhi',
      coachName: 'MS Dhoni',
      coachingType: 'Individual Training',
      monthlyFee: 7000,
      rating: 4.9,
      studentsEnrolled: 50,
      sportColor: '#4CAF50'
    },
    {
      id: 11,
      name: 'Smash Badminton Center',
      sport: 'Badminton',
      image: sportImages['Badminton'],
      description: 'Badminton academy with focus on competitive play and fitness',
      location: 'Karol Bagh, Delhi',
      coachName: 'PV Sindhu',
      coachingType: 'Group Training',
      monthlyFee: 3800,
      rating: 4.4,
      studentsEnrolled: 100,
      sportColor: '#9C27B0'
    },
    {
      id: 12,
      name: 'Ace Tennis Academy',
      sport: 'Tennis',
      image: sportImages['Tennis'],
      description: 'Tennis academy with modern courts and experienced coaching staff',
      location: 'South Extension, Delhi',
      coachName: 'Mahesh Bhupathi',
      coachingType: 'Individual & Group',
      monthlyFee: 5500,
      rating: 4.6,
      studentsEnrolled: 80,
      sportColor: '#FF9800'
    },
    {
      id: 13,
      name: 'Pro Cricket Academy',
      sport: 'Cricket',
      image: sportImages['Cricket'],
      description: 'Cricket training with emphasis on all-round development and mental toughness',
      location: 'Faridabad, Haryana',
      coachName: 'Rohit Sharma',
      coachingType: 'Individual Training',
      monthlyFee: 6200,
      rating: 4.7,
      studentsEnrolled: 70,
      sportColor: '#4CAF50'
    },
    {
      id: 14,
      name: 'Victory Football Academy',
      sport: 'Football',
      image: sportImages['Football'],
      description: 'Youth football academy with pathway to professional clubs',
      location: 'Indirapuram, Ghaziabad',
      coachName: 'Bhaichung Bhutia',
      coachingType: 'Group Training',
      monthlyFee: 4500,
      rating: 4.5,
      studentsEnrolled: 120,
      sportColor: '#2196F3'
    },
    {
      id: 15,
      name: 'Splash Swimming Institute',
      sport: 'Swimming',
      image: sportImages['Swimming'],
      description: 'Swimming academy with rehabilitation and therapeutic programs',
      location: 'Vasundhara, Ghaziabad',
      coachName: 'Nisha Millet',
      coachingType: 'Individual Training',
      monthlyFee: 4000,
      rating: 4.3,
      studentsEnrolled: 65,
      sportColor: '#00BCD4'
    },
    {
      id: 16,
      name: 'Champion Badminton Club',
      sport: 'Badminton',
      image: sportImages['Badminton'],
      description: 'Badminton training with international coaching methodology',
      location: 'Mayur Vihar, Delhi',
      coachName: 'Kidambi Srikanth',
      coachingType: 'Individual & Group',
      monthlyFee: 4800,
      rating: 4.6,
      studentsEnrolled: 85,
      sportColor: '#9C27B0'
    },
    {
      id: 17,
      name: 'Baseline Tennis Institute',
      sport: 'Tennis',
      image: sportImages['Tennis'],
      description: 'Tennis academy with specialized programs for juniors and adults',
      location: 'Alaknanda, Delhi',
      coachName: 'Somdev Devvarman',
      coachingType: 'Individual Training',
      monthlyFee: 6500,
      rating: 4.8,
      studentsEnrolled: 45,
      sportColor: '#FF9800'
    },
    {
      id: 18,
      name: 'Quick Fire Table Tennis',
      sport: 'Table Tennis',
      image: sportImages['Table Tennis'],
      description: 'Table tennis academy with focus on speed and precision training',
      location: 'Tilak Nagar, Delhi',
      coachName: 'Manika Batra',
      coachingType: 'Group Training',
      monthlyFee: 3000,
      rating: 4.2,
      studentsEnrolled: 110,
      sportColor: '#F44336'
    }
  ];

  // Comprehensive search function
  const searchAcademies = (academies, query) => {
    if (!query.trim()) return academies;
    
    const searchTerm = query.toLowerCase();
    
    return academies.filter(academy => {
      return (
        academy.name.toLowerCase().includes(searchTerm) ||
        academy.sport.toLowerCase().includes(searchTerm) ||
        academy.description.toLowerCase().includes(searchTerm) ||
        academy.location.toLowerCase().includes(searchTerm) ||
        academy.coachName.toLowerCase().includes(searchTerm) ||
        academy.coachingType.toLowerCase().includes(searchTerm) ||
        academy.monthlyFee.toString().includes(searchTerm) ||
        academy.rating.toString().includes(searchTerm) ||
        academy.studentsEnrolled.toString().includes(searchTerm)
      );
    });
  };

  // Filter and search academies
  useEffect(() => {
    let filtered = academies;
    
    // First filter by sport
    if (selectedSport !== 'All Sports') {
      filtered = filtered.filter(academy => academy.sport === selectedSport);
    }
    
    // Then apply search
    filtered = searchAcademies(filtered, searchQuery);
    
    setFilteredAcademies(filtered);
    // Reset visible count when filters change
    setVisibleCount(6);
  }, [selectedSport, searchQuery]);

  // Initialize with all academies
  useEffect(() => {
    setFilteredAcademies(academies);
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle sport selection
  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
  };

  // Handle load more academies
  const loadMoreAcademies = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  // Get academies to display (limited by visibleCount)
  const academiesToDisplay = filteredAcademies.slice(0, visibleCount);
  
  // Check if there are more academies to load
  const hasMoreAcademies = visibleCount < filteredAcademies.length;

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>Find Your Perfect Academy</h1>
          <p className={styles.subtitle}>Discover top sports academies and professional coaches near you</p>
          
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search for academies, coaches, sports..."
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

      {/* Available Academies Section */}
      <section className={styles.academiesSection}>
        <div className={styles.academiesHeader}>
          <h2>
            {selectedSport === 'All Sports' 
              ? searchQuery 
                ? `Search Results (${filteredAcademies.length})`
                : 'Top Academies'
              : `${selectedSport} Academies (${filteredAcademies.length})`
            }
          </h2>
          <div className={styles.headerRight}>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option>Sort by Price</option>
              <option>Sort by Rating</option>
              <option>Sort by Students</option>
            </select>
          </div>
        </div>

        {filteredAcademies.length === 0 ? (
          <div className={styles.noAcademies}>
            <p>
              {searchQuery 
                ? `No academies found for "${searchQuery}". Try different keywords.`
                : `No academies found for ${selectedSport}. Try selecting a different sport.`
              }
            </p>
          </div>
        ) : (
          <div className={styles.academiesGrid}>
            {academiesToDisplay.map((academy) => (
              <div key={academy.id} className={styles.academyCard}>
                <div className={styles.academyImage}>
                  <img src={academy.image} alt={academy.name} />
                  <span 
                    className={styles.sportTag}
                    style={{ backgroundColor: academy.sportColor }}
                  >
                    {academy.sport}
                  </span>
                  <div className={styles.ratingBadge}>
                    <i className="fas fa-star"></i>
                    {academy.rating}
                  </div>
                </div>
                <div className={styles.academyInfo}>
                  <h3>{academy.name}</h3>
                  <p className={styles.academyDescription}>{academy.description}</p>
                  <div className={styles.academyDetails}>
                    <span className={styles.location}>
                      <i className="fas fa-map-marker-alt"></i> {academy.location}
                    </span>
                    <span className={styles.coach}>
                      <i className="fas fa-user-tie"></i> Coach: {academy.coachName}
                    </span>
                    <span className={styles.coachingType}>
                      <i className="fas fa-users"></i> {academy.coachingType}
                    </span>
                    <span className={styles.students}>
                      <i className="fas fa-graduation-cap"></i> {academy.studentsEnrolled} students
                    </span>
                  </div>
                  <div className={styles.academyFooter}>
                    <span className={styles.fee}>₹{academy.monthlyFee.toLocaleString()}/month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show Load More button only if there are more academies to load */}
        {filteredAcademies.length > 0 && hasMoreAcademies && (
          <button 
            className={styles.loadMoreBtn}
            onClick={loadMoreAcademies}
          >
            Load More Academies
          </button>
        )}

        {/* Show message when all academies are loaded */}
        {filteredAcademies.length > 6 && !hasMoreAcademies && (
          <div className={styles.allLoadedMessage}>
            <p>All academies loaded ({filteredAcademies.length} total)</p>
          </div>
        )}
      </section>

      {/* Spacer to push content to footer */}
      <div className={styles.spacer}></div>
    </div>
  );
};

export default Academy;
