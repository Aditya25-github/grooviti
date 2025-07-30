import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PlayTogetherDetails.module.css';

const PlayTogetherDetails = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Complete player data with detailed information
  const playersData = {
    1: {
      id: 1,
      name: 'Rahul Sharma',
      age: 25,
      profileImage: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=RahulSharma&size=150',
      coverImages: [
        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop'
      ],
      location: 'Sector 18, Noida, Uttar Pradesh 201301',
      primarySport: 'Cricket',
      skillLevel: 'Intermediate',
      experience: '5 years',
      
      // Player Stats
      stats: {
        matchesPlayed: 150,
        winRate: 68,
        teamsJoined: 12,
        partnersPlayed: 45,
        yearsPlaying: 5,
        averageRating: 4.2
      },

      // Single preferred venue
      venue: {
        name: 'Elite Cricket Ground',
        location: 'Sector 18, Noida',
        distance: '2 km away',
        rating: 4.5
      },

      // Enrolled Members
      enrolledMembers: [
        {
          id: 1,
          name: 'Rahul Sharma',
          profileImage: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=RahulSharma&size=60',
          role: 'Team Captain',
          skillLevel: 'Intermediate',
          position: 'Batsman',
          joinedDate: 'Team Creator'
        },
        {
          id: 2,
          name: 'Vikas Kumar',
          profileImage: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=VikasKumar&size=60',
          role: 'Player',
          skillLevel: 'Intermediate',
          position: 'Bowler',
          joinedDate: '2 days ago'
        },
        {
          id: 3,
          name: 'Amit Singh',
          profileImage: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=AmitSingh&size=60',
          role: 'Player',
          skillLevel: 'Advanced',
          position: 'All-rounder',
          joinedDate: '1 week ago'
        },
        {
          id: 4,
          name: 'Sunil Gupta',
          profileImage: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=SunilGupta&size=60',
          role: 'Player',
          skillLevel: 'Beginner',
          position: 'Wicket Keeper',
          joinedDate: '2 weeks ago'
        }
      ],
      
      // Team enrollment info
      enrollment: {
        current: 4,
        total: 8,
        teamType: 'Cricket Team',
        spotsAvailable: 4
      },

      // Playing achievements
      achievements: [
        {
          year: '2023',
          title: 'Local Cricket Tournament Winner',
          description: 'Won the annual Noida Cricket Championship with team',
          category: 'Team Achievement'
        },
        {
          year: '2023',
          title: 'Best Batsman Award',
          description: 'Highest run scorer in the tournament with 450+ runs',
          category: 'Individual Achievement'
        },
        {
          year: '2022',
          title: 'Century Club Member',
          description: 'Scored first century in local league match',
          category: 'Personal Milestone'
        },
        {
          year: '2021',
          title: 'Team Captain',
          description: 'Led office cricket team to inter-company championship',
          category: 'Leadership'
        }
      ],

      // Reviews from other players
      playerReviews: [
        {
          id: 1,
          reviewerName: 'Vikas Kumar',
          rating: 5,
          comment: 'Excellent team player! Rahul is very reliable and brings positive energy to the team. Great batting skills and supportive teammate.',
          date: '2 days ago',
          sportPlayed: 'Cricket',
          matchType: 'Weekend League'
        },
        {
          id: 2,
          reviewerName: 'Priya Singh',
          rating: 4,
          comment: 'Played several matches with Rahul. He is punctual, dedicated and always helps new players. Recommended!',
          date: '1 week ago',
          sportPlayed: 'Cricket',
          matchType: 'Friendly Match'
        },
        {
          id: 3,
          reviewerName: 'Arjun Patel',
          rating: 4,
          comment: 'Good player with strong basics. Easy to get along with and very committed to the game.',
          date: '2 weeks ago',
          sportPlayed: 'Football',
          matchType: 'Mixed Sports'
        }
      ],

      // Contact preferences
      contactPreferences: {
        preferredMethod: 'WhatsApp',
        responseTime: 'Within 2 hours',
        languages: ['Hindi', 'English'],
        bestTimeToContact: 'Evenings after 6 PM'
      },

      // Social proof
      socialProof: {
        joinedDate: 'Member since Jan 2021',
        verified: true,
        responseRate: 95,
        totalConnections: 78
      }
    },
    2: {
      id: 2,
      name: 'Priya Singh',
      age: 28,
      profileImage: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=PriyaSingh&size=150',
      coverImages: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop'
      ],
      location: 'Gurgaon, Haryana 122001',
      primarySport: 'Badminton',
      skillLevel: 'Advanced',
      experience: '8 years',
      
      stats: {
        matchesPlayed: 200,
        winRate: 72,
        teamsJoined: 8,
        partnersPlayed: 25,
        yearsPlaying: 8,
        averageRating: 4.6
      },

      venue: {
        name: 'Shuttle Arena',
        location: 'Dwarka, New Delhi',
        distance: '8 km away',
        rating: 4.5
      },

      enrolledMembers: [
        {
          id: 1,
          name: 'Priya Singh',
          profileImage: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=PriyaSingh&size=60',
          role: 'Team Creator',
          skillLevel: 'Advanced',
          position: 'Singles/Doubles',
          joinedDate: 'Team Creator'
        }
      ],

      enrollment: {
        current: 1,
        total: 2,
        teamType: 'Doubles Team',
        spotsAvailable: 1
      },

      achievements: [
        {
          year: '2024',
          title: 'State Championship Quarter-Finalist',
          description: 'Reached quarter-finals in Haryana State Badminton Championship',
          category: 'Tournament Achievement'
        },
        {
          year: '2023',
          title: 'Local Tournament Champion',
          description: 'Won Gurgaon Open Badminton Tournament (Women\'s Doubles)',
          category: 'Tournament Win'
        },
        {
          year: '2022',
          title: 'Club Champion',
          description: 'Internal club championship winner for 2 consecutive years',
          category: 'Club Achievement'
        }
      ],

      playerReviews: [
        {
          id: 1,
          reviewerName: 'Saina Gupta',
          rating: 5,
          comment: 'Exceptional player with great technique and strategy. Perfect doubles partner for competitive play.',
          date: '3 days ago',
          sportPlayed: 'Badminton',
          matchType: 'Tournament'
        },
        {
          id: 2,
          reviewerName: 'Kavya Joshi',
          rating: 5,
          comment: 'Played with Priya in several tournaments. She is very skilled and supportive. Highly recommended!',
          date: '1 week ago',
          sportPlayed: 'Badminton',
          matchType: 'Club Match'
        }
      ],

      contactPreferences: {
        preferredMethod: 'Message',
        responseTime: 'Within 1 hour',
        languages: ['Hindi', 'English'],
        bestTimeToContact: 'Evenings 6-9 PM'
      },

      socialProof: {
        joinedDate: 'Member since Mar 2020',
        verified: true,
        responseRate: 98,
        totalConnections: 92
      }
    }
  };

  // Load player data based on ID
  useEffect(() => {
    const playerData = playersData[parseInt(id)];
    if (playerData) {
      setPlayer(playerData);
    }
  }, [id]);

  // Loading state
  if (!player) {
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
          Loading player details...
        </div>
      </div>
    );
  }

  // Image navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === player.coverImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? player.coverImages.length - 1 : prev - 1
    );
  };

  return (
    <div className={styles.container}>
      {/* Hero Image Section */}
      <section className={styles.heroSection}>
        <div className={styles.imageContainer}>
          <img 
            src={player.coverImages[currentImageIndex]} 
            alt={`${player.name} playing ${player.primarySport}`}
            className={styles.heroImage}
          />
          {player.coverImages.length > 1 && (
            <>
              <button className={styles.prevBtn} onClick={prevImage}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className={styles.nextBtn} onClick={nextImage}>
                <i className="fas fa-chevron-right"></i>
              </button>
              <div className={styles.imageIndicators}>
                {player.coverImages.map((_, index) => (
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
        
        {/* Player Basic Info Overlay */}
        <div className={styles.playerInfoOverlay}>
          <div className={styles.playerBasicInfo}>
            <div className={styles.playerHeader}>
              <img 
                src={player.profileImage} 
                alt={player.name}
                className={styles.playerAvatar}
              />
              <div className={styles.playerIntro}>
                <h1>{player.name}</h1>
                <div className={styles.playerMeta}>
                  <span className={styles.age}>Age: {player.age}</span>
                  <span className={styles.experience}>{player.experience} experience</span>
                  <span className={styles.skillLevel}>{player.skillLevel}</span>
                </div>
                <div className={styles.location}>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{player.location}</span>
                </div>
                {player.socialProof.verified && (
                  <div className={styles.verifiedBadge}>
                    <i className="fas fa-check-circle"></i>
                    Verified Player
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Player Overview Stats */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-chart-line"></i> Player Stats
          </h2>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{player.stats.matchesPlayed}</div>
              <div className={styles.statLabel}>Matches Played</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{player.stats.winRate}%</div>
              <div className={styles.statLabel}>Win Rate</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{player.stats.teamsJoined}</div>
              <div className={styles.statLabel}>Teams Joined</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{player.stats.partnersPlayed}</div>
              <div className={styles.statLabel}>Partners Played</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{player.stats.averageRating}</div>
              <div className={styles.statLabel}>Average Rating</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{player.socialProof.totalConnections}</div>
              <div className={styles.statLabel}>Connections</div>
            </div>
          </div>
        </section>

        {/* Enrolled Members */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-users"></i> Team Members ({player.enrollment.current}/{player.enrollment.total})
          </h2>
          <div className={styles.enrollmentHeader}>
            <div className={styles.enrollmentInfo}>
              <span className={styles.teamType}>{player.enrollment.teamType}</span>
              <span className={styles.spotsAvailable}>
                {player.enrollment.spotsAvailable} spots available
              </span>
            </div>
            <div className={styles.enrollmentBar}>
              <div 
                className={styles.enrollmentFill}
                style={{ width: `${(player.enrollment.current / player.enrollment.total) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.membersGrid}>
            {player.enrolledMembers.map((member) => (
              <div key={member.id} className={styles.memberCard}>
                <img 
                  src={member.profileImage} 
                  alt={member.name}
                  className={styles.memberAvatar}
                />
                <div className={styles.memberInfo}>
                  <h4>{member.name}</h4>
                  <div className={styles.memberRole}>
                    <span className={`${styles.roleTag} ${
                      member.role === 'Team Captain' || member.role === 'Team Creator' 
                        ? styles.captainTag 
                        : styles.playerTag
                    }`}>
                      {member.role}
                    </span>
                    <span className={styles.skillBadge}>{member.skillLevel}</span>
                  </div>
                  <p className={styles.memberPosition}>{member.position}</p>
                  <span className={styles.joinedDate}>{member.joinedDate}</span>
                </div>
              </div>
            ))}
            
            {/* Show empty slots */}
            {Array.from({ length: player.enrollment.spotsAvailable }, (_, index) => (
              <div key={`empty-${index}`} className={styles.emptySlot}>
                <div className={styles.emptySlotIcon}>
                  <i className="fas fa-plus"></i>
                </div>
                <span>Open Spot</span>
              </div>
            ))}
          </div>
        </section>

        {/* Location & Venue - Integrated Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-map-marker-alt"></i> Location & Venue
          </h2>
          <div className={styles.locationVenueContainer}>
            {/* Left side - Venue Info */}
            <div className={styles.venueInfo}>
              <div className={styles.venueCard}>
                <div className={styles.venueDetails}>
                  <h3>{player.venue.name}</h3>
                  <div className={styles.venueLocation}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{player.venue.location}</span>
                  </div>
                  <div className={styles.venueDistance}>
                    <i className="fas fa-route"></i>
                    <span>{player.venue.distance}</span>
                  </div>
                  <div className={styles.venueRating}>
                    <i className="fas fa-star"></i>
                    <span>{player.venue.rating}</span>
                  </div>
                </div>
              </div>
              <div className={styles.playerLocationInfo}>
                <h4>Player Location</h4>
                <p>{player.location}</p>
              </div>
            </div>

            {/* Right side - Map */}
            <div className={styles.mapContainer}>
              <div className={styles.mapPlaceholder}>
                <div className={styles.mapContent}>
                  <i className="fas fa-map"></i>
                  <p>Interactive Map</p>
                  <small>View venue location on Google Maps</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-trophy"></i> Achievements
          </h2>
          <div className={styles.achievementsContainer}>
            {player.achievements.map((achievement, index) => (
              <div key={index} className={styles.achievementCard}>
                <div className={styles.achievementYear}>{achievement.year}</div>
                <div className={styles.achievementContent}>
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                  <span className={styles.achievementCategory}>{achievement.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Player Reviews */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-comments"></i> Player Reviews
          </h2>
          <div className={styles.reviewsContainer}>
            {player.playerReviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <img 
                      src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${review.reviewerName}&size=40`}
                      alt={review.reviewerName}
                      className={styles.reviewerAvatar}
                    />
                    <div>
                      <h5>{review.reviewerName}</h5>
                      <div className={styles.reviewRating}>
                        {[1,2,3,4,5].map(star => (
                          <i 
                            key={star}
                            className={`fas fa-star ${star <= review.rating ? styles.filled : ''}`}
                          />
                        ))}
                      </div>
                      <span className={styles.matchType}>{review.sportPlayed} - {review.matchType}</span>
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

      {/* Sticky Quick Connect Card */}
      <div className={styles.stickyQuickConnect}>
        <div className={styles.quickConnectCard}>
          <h3>Connect with {player.name}</h3>
          <div className={styles.playerQuickInfo}>
            <img src={player.profileImage} alt={player.name} className={styles.quickAvatar} />
            <div className={styles.quickDetails}>
              <span className={styles.quickName}>{player.name}</span>
              <span className={styles.quickSport}>{player.primarySport} • {player.skillLevel}</span>
              <span className={styles.quickResponse}>Responds in {player.contactPreferences.responseTime}</span>
            </div>
          </div>
          <button className={styles.connectNowBtn}>Connect Now</button>
          <div className={styles.shareActions}>
            <button className={styles.shareBtn}>
              <i className="fas fa-share-alt"></i> Share
            </button>
            <button className={styles.messageBtn}>
              <i className="fas fa-envelope"></i> Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayTogetherDetails;
