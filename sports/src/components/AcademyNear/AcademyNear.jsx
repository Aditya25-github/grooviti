import React from "react";
import styles from "./AcademyNear.module.css";
import cricketAcademy from "../../assets/sports_assets/cricket-academy.avif";
import swimmingAcademy from "../../assets/sports_assets/swimming-academy.avif";
import badmintonAcademy from "../../assets/sports_assets/badminton-academy.avif";

const Academies = [
  {
    name: "Champions Cricket Academy",
    rating: "4.8",
    type: "Cricket Training",
    price: "₹3000/month",
    coach: "Rajesh Kumar",
    location: "Sector 15, Noida",
    image: cricketAcademy
  },
  {
    name: "AquaLife Swimming Academy",
    rating: "4.9",
    type: "Swimming Training",
    price: "₹2500/month",
    coach: "Priya Sharma",
    location: "Sector 22, Gurgaon",
    image: swimmingAcademy
  },
  {
    name: "Shuttle Masters Academy",
    rating: "4.7",
    type: "Badminton Training",
    price: "₹2000/month",
    coach: "Amit Singh",
    location: "Sector 18, Delhi",
    image: badmintonAcademy
  }
];

const AcademyNear = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Academies Near You</h1>
      <div className={styles.academiesContainer}>
        {Academies.map((academy, index) => (
          <div key={index} className={styles.academyCard}>
            <div className={styles.imageContainer}>
              <img 
                src={academy.image} 
                alt={academy.name} 
                className={styles.academyImage}
              />
            </div>
            <div className={styles.academyContent}>
              <h2 className={styles.academyName}>{academy.name}</h2>
              <div className={styles.ratingContainer}>
                <span className={styles.rating}>{academy.rating}</span>
              </div>
              <p className={styles.academyType}>{academy.type}</p>
              <p className={styles.academyPrice}>{academy.price}</p>
              <div className={styles.details}>
                <p className={styles.detailItem}>
                  <span className={styles.detailLabel}>Coach:</span> {academy.coach}
                </p>
                <p className={styles.detailItem}>
                  <span className={styles.detailLabel}>Location:</span> {academy.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademyNear;