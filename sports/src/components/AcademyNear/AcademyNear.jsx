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
<<<<<<< HEAD
    sport: "Cricket",
    description: "Professional cricket training with certified coaches and modern facilities",
    location: "Sector 15, Noida",
    coachName: "Rajesh Kumar",
    coachingType: "Individual & Group",
    monthlyFee: 3000,
    rating: 4.8,
    studentsEnrolled: 120,
=======
    rating: "4.8",
    type: "Cricket Training",
    price: "₹3000/month",
    coach: "Rajesh Kumar",
    location: "Sector 15, Noida",
>>>>>>> 4b3e7842 (too many changes so doing today)
    image: cricketAcademy,
    sportColor: "#4CAF50"
  },
  {
    id: 2,
    name: "AquaLife Swimming Academy",
<<<<<<< HEAD
    sport: "Swimming",
    description: "Learn swimming from basics to competitive levels with expert instructors",
    location: "Sector 22, Gurgaon",
    coachName: "Priya Sharma",
    coachingType: "Individual & Group",
    monthlyFee: 2500,
    rating: 4.9,
    studentsEnrolled: 200,
=======
    rating: "4.9",
    type: "Swimming Training",
    price: "₹2500/month",
    coach: "Priya Sharma",
    location: "Sector 22, Gurgaon",
>>>>>>> 4b3e7842 (too many changes so doing today)
    image: swimmingAcademy,
    sportColor: "#00BCD4"
  },
  {
    id: 3,
    name: "Shuttle Masters Academy",
<<<<<<< HEAD
    sport: "Badminton",
    description: "Comprehensive badminton training with tournament preparation and fitness focus",
    location: "Sector 18, Delhi",
    coachName: "Amit Singh",
    coachingType: "Individual & Group",
    monthlyFee: 2000,
    rating: 4.7,
    studentsEnrolled: 75,
=======
    rating: "4.7",
    type: "Badminton Training",
    price: "₹2000/month",
    coach: "Amit Singh",
    location: "Sector 18, Delhi",
>>>>>>> 4b3e7842 (too many changes so doing today)
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
<<<<<<< HEAD
    navigate(`/academy/${academyId}`);
=======
    navigate(`/academies/${academyId}`);
>>>>>>> 4b3e7842 (too many changes so doing today)
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.mainTitle}>Academies Near You</h1>
      </div>
      
      <div className={styles.glassContainer}>
<<<<<<< HEAD
        <div className={styles.academiesContainer}>
=======
        <div className={styles.academiesRow}>
>>>>>>> 4b3e7842 (too many changes so doing today)
          {Academies.map((academy) => (
            <div 
              key={academy.id} 
              className={styles.academyCard}
              onClick={() => handleAcademyClick(academy.id)}
<<<<<<< HEAD
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
=======
            >
              <div className={styles.imageContainer}>
                <img src={academy.image} alt={academy.name} />
>>>>>>> 4b3e7842 (too many changes so doing today)
                <span 
                  className={styles.sportTag}
                  style={{ backgroundColor: academy.sportColor }}
                >
<<<<<<< HEAD
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
=======
                  {academy.type}
                </span>
              </div>
              <div className={styles.academyContent}>
                <div className={styles.headerRow}>
                  <h2 className={styles.academyName}>{academy.name}</h2>
                  <div className={styles.ratingContainer}>
                    <span className={styles.rating}>{academy.rating}</span>
                  </div>
                </div>
                <p className={styles.academyPrice}>{academy.price}</p>
                <div className={styles.details}>
                  <p className={styles.detailItem}>
                    <span className={styles.detailLabel}>Coach:</span> {academy.coach}
                  </p>
                  <p className={styles.detailItem}>
                    <span className={styles.detailLabel}>Location:</span> {academy.location}
                  </p>
>>>>>>> 4b3e7842 (too many changes so doing today)
                </div>
              </div>
            </div>
          ))}
        </div>
<<<<<<< HEAD
        <button 
          className={styles.exploreButton} 
          onClick={handleExploreMore}
          aria-label="Explore more academies"
        >
=======
        <button className={styles.exploreButton} onClick={handleExploreMore}>
>>>>>>> 4b3e7842 (too many changes so doing today)
          Explore More Academies →
        </button>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default AcademyNear;
=======
export default AcademyNear;
>>>>>>> 4b3e7842 (too many changes so doing today)
