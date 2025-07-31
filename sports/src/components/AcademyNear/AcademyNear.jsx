import React from "react";
import styles from "./AcademyNear.module.css";
import cricketAcademy from "../../assets/sports_assets/cricket-academy.avif";
import swimmingAcademy from "../../assets/sports_assets/swimming-academy.avif";
import badmintonAcademy from "../../assets/sports_assets/badminton-academy.avif";
import { useNavigate } from "react-router-dom";

const Academies = [
  {
    id: 1,
    name: "Champions Cricket Academy",
    sport: "Cricket",
    description: "Professional cricket training with certified coaches and modern facilities",
    location: "Sector 15, Noida",
    coachName: "Rajesh Kumar",
    coachingType: "Individual & Group",
    monthlyFee: 3000,
    rating: 4.8,
    studentsEnrolled: 120,
    image: cricketAcademy,
    sportColor: "#4CAF50"
  },
  {
    id: 2,
    name: "AquaLife Swimming Academy",
    sport: "Swimming",
    description: "Learn swimming from basics to competitive levels with expert instructors",
    location: "Sector 22, Gurgaon",
    coachName: "Priya Sharma",
    coachingType: "Individual & Group",
    monthlyFee: 2500,
    rating: 4.9,
    studentsEnrolled: 200,
    image: swimmingAcademy,
    sportColor: "#00BCD4"
  },
  {
    id: 3,
    name: "Shuttle Masters Academy",
    sport: "Badminton",
    description: "Comprehensive badminton training with tournament preparation and fitness focus",
    location: "Sector 18, Delhi",
    coachName: "Amit Singh",
    coachingType: "Individual & Group",
    monthlyFee: 2000,
    rating: 4.7,
    studentsEnrolled: 75,
    image: badmintonAcademy,
    sportColor: "#9C27B0"
  }
];

const AcademyNear = () => {
  const navigate = useNavigate();

  const handleExploreMore = () => {
    navigate('/academy');
  };

  const handleAcademyClick = (academyId) => {
    navigate(`/academy/${academyId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.mainTitle}>Academies Near You</h1>
      </div>
      
      <div className={styles.glassContainer}>
        <div className={styles.academiesContainer}>
          {Academies.map((academy) => (
            <div 
              key={academy.id} 
              className={styles.academyCard}
              onClick={() => handleAcademyClick(academy.id)}
              role="article"
              aria-label={`${academy.name} academy card`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleAcademyClick(academy.id);
                }
              }}
            >
              <div className={styles.academyImage}>
                <img 
                  src={academy.image} 
                  alt={academy.name}
                  loading="lazy"
                />
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
                <h3 className={styles.academyName}>{academy.name}</h3>
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
        <button 
          className={styles.exploreButton} 
          onClick={handleExploreMore}
          aria-label="Explore more academies"
        >
          Explore More Academies →
        </button>
      </div>
    </div>
  );
};

export default AcademyNear;
