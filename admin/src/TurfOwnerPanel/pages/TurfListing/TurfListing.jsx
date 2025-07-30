import React, { useState } from "react";
import styles from "./TurfListing.module.css";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaStar,
  FaEdit,
  FaWrench,
} from "react-icons/fa";

const initialTurfs = [
  {
    id: "turf1",
    name: "Premier Football Turf",
    image: "/turf_images/premier_football.jpg",
    location: "Downtown Area",
    status: "Active",
    price: 1200,
    rating: 4.8,
    reviews: 124,
    bookingsToday: 18,
    type: "Football",
  },
  {
    id: "turf2",
    name: "Elite Cricket Ground",
    image: "/turf_images/elite_cricket.jpg",
    location: "Sports Complex",
    status: "Active",
    price: 2000,
    rating: 4.9,
    reviews: 89,
    bookingsToday: 12,
    type: "Cricket",
  },
  {
    id: "turf3",
    name: "City Multi-sports Arena",
    image: "/turf_images/multisports_arena.jpg",
    location: "Central City",
    status: "Maintenance",
    price: 1500,
    rating: 4.5,
    reviews: 49,
    bookingsToday: 0,
    type: "Multi-Sport",
  },
];

const TurfListing = () => {
  const [turfs] = useState(initialTurfs);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Turf Listings</h1>
        <p className={styles.subtitle}>
          Manage and monitor all your turf properties easily.
        </p>
        <button className={styles.addBtn}>+ Add New Turf</button>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Turfs</div>
          <div className={styles.statValue}>{turfs.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Turfs</div>
          <div className={styles.statValue}>
            {turfs.filter((t) => t.status === "Active").length}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Under Maintenance</div>
          <div className={styles.statValue}>
            {turfs.filter((t) => t.status === "Maintenance").length}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg. Rating</div>
          <div className={styles.statValue}>
            {(
              turfs.reduce((sum, t) => sum + t.rating, 0) / turfs.length
            ).toFixed(1)}
            <FaStar className={styles.starIcon} />
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {turfs.map((turf) => (
          <div key={turf.id} className={styles.card}>
            <div className={styles.imageSection}>
              <img
                src={turf.image}
                alt={turf.name}
                className={styles.cardImage}
                onError={(e) =>
                  (e.target.src =
                    "https://images.unsplash.com/photo-1464983953574-0892a716854b")
                }
              />
              <span
                className={`${styles.statusBadge} ${
                  turf.status === "Active" ? styles.active : styles.maintenance
                }`}
              >
                {turf.status}
              </span>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{turf.name}</h3>
              <p className={styles.cardType}>{turf.type}</p>
              <div className={styles.infoRow}>
                <FaMapMarkerAlt className={styles.mapIcon} />
                <span>{turf.location}</span>
              </div>
              <div className={styles.priceRow}>
                <FaRupeeSign className={styles.rupIcon} />
                <span>{turf.price}/hour</span>
              </div>
              <div className={styles.cardMeta}>
                <span>
                  <FaStar className={styles.starIcon} /> {turf.rating} (
                  {turf.reviews} reviews)
                </span>
                <span>{turf.bookingsToday} bookings today</span>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.editBtn}>
                  <FaEdit /> Edit
                </button>
                <button className={styles.maintenanceBtn}>
                  <FaWrench /> Maintenance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TurfListing;
