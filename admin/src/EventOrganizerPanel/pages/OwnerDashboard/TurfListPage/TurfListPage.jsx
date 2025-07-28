import React, { useEffect, useState } from "react";
import styles from "./TurfListPage.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TurfListPage = ({ url, token }) => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/api/turfs/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTurfs(res.data.turfs || []);
      } catch (error) {
        toast.error("Failed to load turfs");
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, [url, token]);

  return (
    <div className={styles.container}>
      <h1>My Turfs</h1>
      {loading ? (
        <p>Loading turfs...</p>
      ) : turfs.length === 0 ? (
        <p>No turfs found. Add one from the dashboard.</p>
      ) : (
        <div className={styles.grid}>
          {turfs.map((turf) => (
            <div key={turf._id} className={styles.card}>
              <img
                src={turf.coverImageUrl || "/default-turf.jpg"}
                alt={turf.name}
                className={styles.coverImage}
              />
              <div className={styles.info}>
                <h3>{turf.name}</h3>
                <p>
                  Type: <strong>{turf.turfType || "N/A"}</strong>
                </p>
                <p>
                  Price/hr: <strong>₹{turf.pricePerHour || "N/A"}</strong>
                </p>
                <button
                  className={styles.detailsBtn}
                  onClick={() => navigate(`/turfs/${turf._id}`)}
                >
                  Manage Turf
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TurfListPage;
