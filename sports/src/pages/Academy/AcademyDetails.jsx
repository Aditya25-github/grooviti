import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './AcademyDetails.module.css';
// import toast from 'react-hot-toast';

const AcademyDetails = () => {
  const { id } = useParams();
  const [academy, setAcademy] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactPopup, setShowContactPopup] = useState(false);

  // Toggle states for showing expanded/collapsed content
  const [showAllCoaches, setShowAllCoaches] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  // Your full detailed academiesData as provided
  const academiesData = {
    1: {
      id: 1,
      name: 'Elite Cricket Academy',
      rating: 4.5,
      totalReviews: 324,
      location: 'Sector 18, Noida, Uttar Pradesh 201301',
      images: [
        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop'
      ],
      description: 'Elite Cricket Academy is a premier sports training institute offering world-class coaching across multiple sports disciplines.',
      stats: {
        yearsFounded: 2010,
        totalExperience: 15,
        studentsTrained: 2500,
        currentStudents: 450,
        successRate: 92,
        championships: 28
      },
      headCoach: {
        name: 'Rahul Sharma',
        experience: '15 years',
        specialization: 'Cricket & Sports Management',
        achievements: 'Former Ranji Trophy Player, Level 3 Certified Coach',
        avatar: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=RahulSharma&size=100',
        phone: '+91 98765 43210',
        email: 'rahul.sharma@elitecricket.com'
      },
      trainingPrograms: {
        Cricket: {
          description: 'Comprehensive cricket training from basics to advanced levels',
          batches: {
            'Morning Batch (6-8 AM)': {
              coach: 'Vikas Kumar',
              experience: '8 years',
              price: 5000,
              maxStudents: 15,
              currentStudents: 12,
              level: 'Beginner to Intermediate',
              schedule: 'Mon, Wed, Fri'
            },
            'Evening Batch (4-6 PM)': {
              coach: 'Priya Sharma',
              experience: '10 years',
              price: 5500,
              maxStudents: 12,
              currentStudents: 10,
              level: 'Intermediate to Advanced',
              schedule: 'Tue, Thu, Sat'
            },
            'Weekend Intensive (9-12 PM)': {
              coach: 'Rohit Verma',
              experience: '12 years',
              price: 6000,
              maxStudents: 10,
              currentStudents: 8,
              level: 'Advanced & Competition Prep',
              schedule: 'Sat, Sun'
            }
          }
        },
        Football: {
          description: 'Professional football training with tactical development',
          batches: {
            'Kids Batch (5-7 PM)': {
              coach: 'Arjun Menon',
              experience: '6 years',
              price: 3500,
              maxStudents: 20,
              currentStudents: 18,
              level: 'Ages 6-12, Beginner',
              schedule: 'Mon, Wed, Fri'
            },
            'Youth Batch (6-8 PM)': {
              coach: 'Sunil Kumar',
              experience: '9 years',
              price: 4000,
              maxStudents: 16,
              currentStudents: 14,
              level: 'Ages 13-17, Intermediate',
              schedule: 'Tue, Thu, Sat'
            },
            'Adult Batch (7-9 PM)': {
              coach: 'Kiran Singh',
              experience: '11 years',
              price: 4500,
              maxStudents: 14,
              currentStudents: 12,
              level: 'Adults, All levels',
              schedule: 'Mon, Wed, Fri'
            }
          }
        },
        Badminton: {
          description: 'Technical badminton training with tournament preparation',
          batches: {
            'Morning Batch (6-8 AM)': {
              coach: 'Saina Gupta',
              experience: '7 years',
              price: 3000,
              maxStudents: 12,
              currentStudents: 10,
              level: 'Beginner to Intermediate',
              schedule: 'Mon, Wed, Fri'
            },
            'Evening Batch (5-7 PM)': {
              coach: 'Prakash Reddy',
              experience: '9 years',
              price: 3500,
              maxStudents: 10,
              currentStudents: 9,
              level: 'Intermediate to Advanced',
              schedule: 'Tue, Thu, Sat'
            },
            'Competition Batch (4-6 PM)': {
              coach: 'Naina Patel',
              experience: '12 years',
              price: 4200,
              maxStudents: 8,
              currentStudents: 7,
              level: 'Tournament Players',
              schedule: 'Mon, Wed, Fri'
            }
          }
        }
      },
      coachingStaff: [
        {
          name: 'Rahul Sharma',
          position: 'Head Coach & Director',
          experience: '15 years',
          specialization: 'Cricket, Sports Management',
          qualification: 'Level 3 Certified, Former Ranji Player'
        },
        {
          name: 'Vikas Kumar',
          position: 'Senior Cricket Coach',
          experience: '8 years',
          specialization: 'Batting Techniques, Youth Training',
          qualification: 'Level 2 Certified, Former District Player'
        },
        {
          name: 'Priya Sharma',
          position: 'Cricket Coach',
          experience: '10 years',
          specialization: 'Bowling, Fitness Training',
          qualification: 'Level 2 Certified, Sports Science Graduate'
        },
        {
          name: 'Rohit Verma',
          position: 'Advanced Cricket Coach',
          experience: '12 years',
          specialization: 'Match Strategy, Competition Prep',
          qualification: 'Level 3 Certified, Former State Player'
        },
        {
          name: 'Arjun Menon',
          position: 'Football Coach',
          experience: '6 years',
          specialization: 'Youth Development, Basic Skills',
          qualification: 'UEFA B License, Child Psychology'
        },
        {
          name: 'Sunil Kumar',
          position: 'Football Coach',
          experience: '9 years',
          specialization: 'Tactical Training, Fitness',
          qualification: 'AFC Pro License, Former Club Player'
        },
        {
          name: 'Kiran Singh',
          position: 'Senior Football Coach',
          experience: '11 years',
          specialization: 'Advanced Tactics, Adult Training',
          qualification: 'UEFA A License, Former Professional'
        },
        {
          name: 'Saina Gupta',
          position: 'Badminton Coach',
          experience: '7 years',
          specialization: 'Technical Training, Beginners',
          qualification: 'BWF Level 2, Former State Champion'
        },
        {
          name: 'Prakash Reddy',
          position: 'Badminton Coach',
          experience: '9 years',
          specialization: 'Advanced Techniques, Strategy',
          qualification: 'BWF Level 3, Former National Player'
        },
        {
          name: 'Naina Patel',
          position: 'Senior Badminton Coach',
          experience: '12 years',
          specialization: 'Competition Training, Mental Coaching',
          qualification: 'BWF Level 3, Former International Player'
        }
      ],
      achievements: [
        {
          year: '2024',
          title: 'Best Sports Academy Award',
          description: 'Recognized by Delhi Sports Authority for excellence in multi-sport training',
          category: 'Academy Recognition'
        },
        {
          year: '2023',
          title: 'State Championship Winners',
          description: '15 students won state-level championships across different sports',
          category: 'Student Achievements'
        },
        {
          year: '2023',
          title: 'Cricket Excellence Award',
          description: 'Top cricket academy in North India by Cricket Association',
          category: 'Sport-Specific Award'
        },
        {
          year: '2022',
          title: 'Youth Development Recognition',
          description: 'Outstanding contribution to youth sports development',
          category: 'Community Impact'
        },
        {
          year: '2022',
          title: 'National Level Qualifications',
          description: '25+ students qualified for national level competitions',
          category: 'Student Achievements'
        },
        {
          year: '2021',
          title: 'COVID Safety Excellence',
          description: 'Best safety protocols during pandemic training',
          category: 'Safety & Management'
        },
        {
          year: '2021',
          title: 'Coach Training Center',
          description: 'Certified as official coach training center by Sports Authority',
          category: 'Institutional Recognition'
        },
        {
          year: '2020',
          title: 'Digital Innovation Award',
          description: 'Pioneer in online sports training and virtual coaching',
          category: 'Innovation'
        }
      ],
      facilities: [
        { name: 'Indoor Nets', icon: 'fas fa-home', available: true },
        { name: 'Professional Coaching', icon: 'fas fa-chalkboard-teacher', available: true },
        { name: 'Video Analysis', icon: 'fas fa-video', available: true },
        { name: 'Fitness Training', icon: 'fas fa-dumbbell', available: true },
        { name: 'Equipment Provided', icon: 'fas fa-tools', available: true },
        { name: 'Changing Rooms', icon: 'fas fa-door-open', available: true },
        { name: 'Parking', icon: 'fas fa-parking', available: true },
        { name: 'Refreshments', icon: 'fas fa-coffee', available: true },
        { name: 'Medical Support', icon: 'fas fa-first-aid', available: true },
        { name: 'Air Conditioning', icon: 'fas fa-snowflake', available: true }
      ],
      testimonials: [
        {
          id: 1,
          name: 'Vikas Sharma',
          rating: 5,
          comment: 'Excellent coaching and facilities. My son has improved tremendously in just 3 months. The individual attention from coaches is remarkable.',
          date: '2 days ago',
          program: 'Cricket - Evening Batch',
          coach: 'Priya Sharma'
        },
        {
          id: 2,
          name: 'Priya Gupta',
          rating: 5,
          comment: 'Best cricket academy in the area. Coach Rahul is very experienced and patient with kids. Highly recommend!',
          date: '1 week ago',
          program: 'Cricket - Morning Batch',
          coach: 'Vikas Kumar'
        },
        {
          id: 3,
          name: 'Arjun Patel',
          rating: 4,
          comment: 'Great football training program. My son loves the evening batch and has made great friends.',
          date: '3 days ago',
          program: 'Football - Youth Batch',
          coach: 'Sunil Kumar'
        }
      ],
      contact: {
        phone: '+91 98765 43210',
        email: 'info@elitecricket.com',
        address: 'Sector 18, Noida, Uttar Pradesh 201301'
      }
    },
  };

  // Load academy data based on ID param
  useEffect(() => {
    const academyData = academiesData[parseInt(id)];
    if (academyData) {
      setAcademy(academyData);
      const firstProgram = Object.keys(academyData.trainingPrograms)[0];
      setSelectedProgram(firstProgram);
      const firstBatch = Object.keys(academyData.trainingPrograms[firstProgram].batches)[0];
      setSelectedBatch(firstBatch);
    } else {
      setAcademy(null);  
    }
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: academy?.name || "Sports Academy",
      text: `Check out this amazing sports academy: ${academy?.name || ""}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Academy shared successfully!");
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Share failed: " + err.message);
        }
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleContactNow = () => {
    setShowContactPopup(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const closeContactPopup = () => {
    setShowContactPopup(false);
  };

  if (!academy) {
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
          Loading academy details...
        </div>
      </div>
    );
  }

  // Image navigation handlers
  const nextImage = () => {
    setCurrentImageIndex(prev => prev === academy.images.length - 1 ? 0 : prev + 1);
  };
  const prevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? academy.images.length - 1 : prev - 1);
  };

  // Select program and batch handlers
  const handleProgramSelect = (program) => {
    setSelectedProgram(program);
    const firstBatch = Object.keys(academy.trainingPrograms[program].batches)[0];
    setSelectedBatch(firstBatch);
  };
  const handleBatchSelect = (batch) => setSelectedBatch(batch);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.imageContainer}>
          <img 
            src={academy.images[currentImageIndex]} 
            alt={academy.name} 
            className={styles.heroImage} 
          />
          {academy.images.length > 1 && (
            <>
              <button className={styles.prevBtn} onClick={prevImage}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className={styles.nextBtn} onClick={nextImage}>
                <i className="fas fa-chevron-right"></i>
              </button>
              <div className={styles.imageIndicators}>
                {academy.images.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${index === currentImageIndex ? styles.active : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className={styles.academyInfoOverlay}>
          <div className={styles.academyBasicInfo}>
            <h1>{academy.name}</h1>
            <div className={styles.ratingLocation}>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {[1,2,3,4,5].map(star => (
                    <i 
                      key={star}
                      className={`fas fa-star ${star <= Math.floor(academy.rating) ? styles.filled : ''}`} 
                    />
                  ))}
                </div>
                <span>{academy.rating} ({academy.totalReviews} reviews)</span>
              </div>
              <div className={styles.location}>
                <i className="fas fa-map-marker-alt"></i>
                <span>{academy.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Academy Overview Stats with Quick Contact Card */}
        <div className={styles.academyOverviewSection}>
          <div className={styles.academyOverviewContent}>
            <h2 className={styles.sectionTitle}>
              <i className="fas fa-chart-line"></i> Academy Overview
            </h2>
            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{academy.stats.totalExperience}</div>
                <div className={styles.statLabel}>Years Experience</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{academy.stats.studentsTrained.toLocaleString()}</div>
                <div className={styles.statLabel}>Students Trained</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{academy.stats.currentStudents}</div>
                <div className={styles.statLabel}>Current Students</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{academy.stats.successRate}%</div>
                <div className={styles.statLabel}>Success Rate</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{academy.stats.championships}</div>
                <div className={styles.statLabel}>Championships Won</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{new Date().getFullYear() - academy.stats.yearsFounded}</div>
                <div className={styles.statLabel}>Years Established</div>
              </div>
            </div>
            <p className={styles.academyDescription}>{academy.description}</p>
          </div>

          {/* Quick Contact Card - Now positioned next to Academy Overview */}
          <div className={styles.quickContactCardWrapper}>
            <div className={styles.quickContactCard}>
              <h3>Quick Contact</h3>
              <div className={styles.priceDisplay}>
                <span className={styles.price}>
                  ₹{academy.trainingPrograms[selectedProgram]?.batches[selectedBatch]?.price || 3000}
                </span>
                <span className={styles.priceUnit}>/month</span>
                <span className={styles.startingPrice}>
                  {selectedBatch ? `${selectedBatch} - ${selectedProgram}` : 'Selected Program'}
                </span>
              </div>
              <button className={styles.contactNowBtn} onClick={handleContactNow}>
                Contact Now
              </button>
              <div className={styles.shareActions}>
                <button className={styles.shareBtn} onClick={handleShare}>
                  <i className="fas fa-share-alt"></i> Share
                </button>
                <button className={styles.messageBtn}>
                  <i className="fas fa-envelope"></i> Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Popup */}
        {showContactPopup && (
          <div className={styles.contactPopupOverlay}>
            <div className={styles.contactPopup}>
              <button className={styles.closePopupBtn} onClick={closeContactPopup}>
                <i className="fas fa-times"></i>
              </button>
              <h3>Contact Information</h3>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <i className="fas fa-phone"></i>
                  <span>{academy.contact.phone}</span>
                  <button 
                    className={styles.copyBtn}
                    onClick={() => copyToClipboard(academy.contact.phone)}
                  >
                    <i className="fas fa-copy"></i> Copy
                  </button>
                </div>
                <div className={styles.contactItem}>
                  <i className="fas fa-envelope"></i>
                  <span>{academy.contact.email}</span>
                  <button 
                    className={styles.copyBtn}
                    onClick={() => copyToClipboard(academy.contact.email)}
                  >
                    <i className="fas fa-copy"></i> Copy
                  </button>
                </div>
                <div className={styles.contactItem}>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{academy.contact.address}</span>
                </div>
              </div>
              <div className={styles.contactActions}>
                <a 
                  href={`tel:${academy.contact.phone.replace(/[^0-9+]/g, '')}`} 
                  className={styles.callBtn}
                >
                  <i className="fas fa-phone"></i> Call Now
                </a>
                <a 
                  href={`mailto:${academy.contact.email}`} 
                  className={styles.emailBtn}
                >
                  <i className="fas fa-envelope"></i> Send Email
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the sections remain exactly the same */}
        {/* Head Coach Information */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-user-tie"></i> Meet Our Head Coach
          </h2>
          <div className={styles.coachContainer}>
            <div className={styles.coachInfo}>
              <img 
                src={academy.headCoach.avatar}
                alt={academy.headCoach.name}
                className={styles.coachAvatar}
              />
              <div className={styles.coachDetails}>
                <h3>{academy.headCoach.name}</h3>
                <p className={styles.experience}>{academy.headCoach.experience} of coaching experience</p>
                <p className={styles.specialization}>Specialization: {academy.headCoach.specialization}</p>
                <p className={styles.achievements}>{academy.headCoach.achievements}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Training Programs & Batches */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-graduation-cap"></i> Training Programs & Batches
          </h2>
          <div className={styles.programTabs}>
            {Object.keys(academy.trainingPrograms).map((program) => (
              <button
                key={program}
                className={`${styles.programTab} ${selectedProgram === program ? styles.activeTab : ''}`}
                onClick={() => handleProgramSelect(program)}
              >
                {program}
              </button>
            ))}
          </div>
          <div className={styles.programDescription}>
            <p>{academy.trainingPrograms[selectedProgram]?.description}</p>
          </div>
          <div className={styles.batchesContainer}>
            {Object.entries(academy.trainingPrograms[selectedProgram]?.batches || {}).map(([batchName, batchDetails]) => (
              <div 
                key={batchName}
                className={`${styles.batchCard} ${selectedBatch === batchName ? styles.selectedBatch : ''}`}
                onClick={() => handleBatchSelect(batchName)}
              >
                <div className={styles.batchHeader}>
                  <h4>{batchName}</h4>
                  <span className={styles.batchPrice}>₹{batchDetails.price}/month</span>
                </div>
                <div className={styles.batchDetails}>
                  <div className={styles.batchInfo}>
                    <span className={styles.coach}>
                      <i className="fas fa-user-tie"></i>
                      Coach: {batchDetails.coach}
                    </span>
                    <span className={styles.coachExp}>
                      <i className="fas fa-medal"></i>
                      {batchDetails.experience} experience
                    </span>
                  </div>
                  <div className={styles.batchInfo}>
                    <span className={styles.level}>
                      <i className="fas fa-layer-group"></i>
                      {batchDetails.level}
                    </span>
                    <span className={styles.schedule}>
                      <i className="fas fa-calendar"></i>
                      {batchDetails.schedule}
                    </span>
                  </div>
                  <div className={styles.capacity}>
                    <span className={styles.students}>
                      <i className="fas fa-users"></i>
                      {batchDetails.currentStudents}/{batchDetails.maxStudents} students
                    </span>
                    <div className={styles.capacityBar}>
                      <div 
                        className={styles.capacityFill}
                        style={{ width: `${(batchDetails.currentStudents / batchDetails.maxStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coaching Staff */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-users"></i> Our Coaching Staff
          </h2>
          <div className={styles.staffGrid}>
            {(showAllCoaches ? academy.coachingStaff : [academy.coachingStaff[0]]).map((staff, idx) => (
              <div key={idx} className={styles.staffCard}>
                <img 
                  src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${staff.name}&size=60`}
                  alt={staff.name}
                  className={styles.staffAvatar}
                />
                <div className={styles.staffInfo}>
                  <h4>{staff.name}</h4>
                  <p className={styles.position}>{staff.position}</p>
                  <p className={styles.staffExperience}>{staff.experience} experience</p>
                  <p className={styles.staffSpecialization}>{staff.specialization}</p>
                  <p className={styles.qualification}>{staff.qualification}</p>
                </div>
              </div>
            ))}
          </div>
          {academy.coachingStaff.length > 1 && (
            <button className={styles.toggleSectionBtn} onClick={() => setShowAllCoaches(prev => !prev)}>
              <i className={`fas fa-chevron-${showAllCoaches ? 'up' : 'down'}`}></i>
              {showAllCoaches ? 'Show Less Coaches' : `Show All Coaches (${academy.coachingStaff.length})`}
            </button>
          )}
        </section>

        {/* Achievements */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-trophy"></i> Achievements & Recognition
          </h2>
          <div className={styles.achievementsContainer}>
            {(showAllAchievements ? academy.achievements : [academy.achievements[0]]).map((achievement, idx) => (
              <div key={idx} className={styles.achievementCard}>
                <div className={styles.achievementYear}>{achievement.year}</div>
                <div className={styles.achievementContent}>
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                  <span className={styles.achievementCategory}>{achievement.category}</span>
                </div>
              </div>
            ))}
          </div>
          {academy.achievements.length > 1 && (
            <button className={styles.toggleSectionBtn} onClick={() => setShowAllAchievements(prev => !prev)}>
              <i className={`fas fa-chevron-${showAllAchievements ? 'up' : 'down'}`}></i>
              {showAllAchievements ? 'Show Less Achievements' : `Show All (${academy.achievements.length})`}
            </button>
          )}
        </section>

        {/* Location Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-map-marker-alt"></i> Location
          </h2>
          <div className={styles.locationContainer}>
            <div className={styles.locationInfo}>
              <p>{academy.location}</p>
              <p className={styles.locationDescription}>{academy.description}</p>
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

        {/* Facilities Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-star"></i> Facilities
          </h2>
          <div className={styles.facilitiesGrid}>
            {academy.facilities.map((facility, idx) => (
              <div 
                key={idx} 
                className={`${styles.facilityItem} ${!facility.available ? styles.unavailable : ''}`}
              >
                <i className={`${facility.icon} ${styles.facilityIcon}`}></i>
                <span>{facility.name}</span>
                {!facility.available && <span className={styles.unavailableLabel}>Not Available</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Student Testimonials */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-comments"></i> Student Testimonials
          </h2>
          <div className={styles.testimonialsContainer}>
            {(showAllTestimonials ? academy.testimonials : [academy.testimonials[0]]).map(testimonial => (
              <div key={testimonial.id} className={styles.testimonialCard}>
                <div className={styles.testimonialHeader}>
                  <div className={styles.studentInfo}>
                    <img 
                      src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${testimonial.name}&size=40`}
                      alt={testimonial.name}
                      className={styles.studentAvatar}
                    />
                    <div>
                      <h5>{testimonial.name}</h5>
                      <div className={styles.testimonialRating}>
                        {[1,2,3,4,5].map(star => (
                          <i 
                            key={star} 
                            className={`fas fa-star ${star <= testimonial.rating ? styles.filled : ''}`} 
                          />
                        ))}
                      </div>
                      <span className={styles.programTag}>{testimonial.program}</span>
                      <span className={styles.coachTag}>Coach: {testimonial.coach}</span>
                    </div>
                  </div>
                  <span className={styles.testimonialDate}>{testimonial.date}</span>
                </div>
                <p className={styles.testimonialComment}>{testimonial.comment}</p>
              </div>
            ))}
            {academy.testimonials.length > 1 && (
              <button className={styles.toggleSectionBtn} onClick={() => setShowAllTestimonials(prev => !prev)}>
                <i className={`fas fa-chevron-${showAllTestimonials ? 'up' : 'down'}`}></i>
                {showAllTestimonials ? 'Show Fewer Testimonials' : `Show All (${academy.testimonials.length})`}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AcademyDetails;