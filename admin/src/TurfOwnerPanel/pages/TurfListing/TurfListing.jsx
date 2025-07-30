import React, { useEffect, useState } from "react";
import styles from "./TurfListing.module.css";
import axios from "axios";
import { FaMapMarkerAlt, FaRupeeSign, FaStar, FaTrash } from "react-icons/fa";
import AddTurfForm from "../../components/AddTurfForm/AddTurfForm";
import EditTurfForm from "../../components/EditTurfForm/EditTurfForm";
import { toast } from "react-toastify";

const TurfListing = ({ url }) => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTurf, setEditingTurf] = useState(null);
  const [deletingTurf, setDeletingTurf] = useState(null);

  useEffect(() => {
    fetchTurfs();
  }, []);

  const fetchTurfs = async () => {
    try {
      const response = await axios.get(`${url}/api/turfs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
        },
      });
      const turfsArray = Array.isArray(response.data)
        ? response.data
        : response.data.turfs || [];

      setTurfs(turfsArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching turfs:", error);
      toast.error("Failed to fetch turfs");
      setLoading(false);
    }
  };

  const handleDeleteTurf = async (turfData) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${turfData.name}"?\n\nThis action cannot be undone and will permanently remove all associated data including:\n• Turf information\n• Images\n• Booking history\n• Reviews\n\nType "DELETE" to confirm.`
    );

    if (!isConfirmed) return;

    // Additional confirmation for safety
    const confirmText = prompt(
      `To confirm deletion of "${turfData.name}", please type "DELETE" (in capital letters):`
    );

    if (confirmText !== "DELETE") {
      toast.info("Deletion cancelled - confirmation text didn't match");
      return;
    }

    try {
      setDeletingTurf(turfData._id);

      const response = await axios.delete(`${url}/api/turfs/${turfData._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
        },
      });

      if (response.data.success) {
        toast.success(`"${turfData.name}" has been deleted successfully`);
        // Remove the deleted turf from the state
        setTurfs((prevTurfs) =>
          prevTurfs.filter((turf) => turf._id !== turfData._id)
        );
      }
    } catch (error) {
      console.error("Error deleting turf:", error);
      toast.error(
        error.response?.data?.message || `Failed to delete "${turfData.name}"`
      );
    } finally {
      setDeletingTurf(null);
    }
  };

  const handleMaintenanceToggle = async (turfId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "maintenance" : "active";

      const response = await axios.patch(
        `${url}/api/turfs/${turfId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Turf status updated to ${newStatus}`);
        fetchTurfs(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating turf status:", error);
      toast.error("Failed to update turf status");
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <h2 className={styles.title}>Turf Management</h2>
          <p className={styles.subtitle}>Manage your listed turfs</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAddForm(true)}>
          + Add Turf
        </button>
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Turfs</p>
          <p className={styles.statValue}>{turfs.length}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Active Turfs</p>
          <p className={styles.statValue}>
            {turfs.filter((t) => t.status === "active").length}
            <FaStar className={styles.starIcon} />
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Under Maintenance</p>
          <p className={styles.statValue}>
            {turfs.filter((t) => t.status === "maintenance").length}
          </p>
        </div>
      </div>

      {/* Turf Cards Grid */}
      <div className={styles.grid}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading turfs...</p>
          </div>
        ) : turfs.length === 0 ? (
          <div className={styles.noTurfsContainer}>
            <div className={styles.noTurfsIcon}>🏟️</div>
            <h3>No turfs found</h3>
            <p>Get started by adding your first turf</p>
            <button
              className={styles.addFirstTurfBtn}
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Turf
            </button>
          </div>
        ) : (
          turfs.map((turf) => (
            <div key={turf._id} className={styles.card}>
              <div className={styles.imageSection}>
                <img
                  src={turf.image ? `${turf.image}` : "/default-turf.jpg"}
                  alt={turf.name}
                  className={styles.cardImage}
                />
                <div
                  className={`${styles.statusBadge} ${
                    turf.status === "active"
                      ? styles.active
                      : styles.maintenance
                  }`}
                >
                  {turf.status}
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{turf.name}</h3>
                <p className={styles.cardType}>{turf.turfType}</p>

                <div className={styles.infoRow}>
                  <FaMapMarkerAlt className={styles.mapIcon} />
                  <span>{turf.address || "Location not set"}</span>
                </div>

                <div className={styles.priceRow}>
                  <FaRupeeSign className={styles.rupIcon} />
                  {turf.pricePerHour}/hr
                </div>

                {/* Features */}
                {turf.features && turf.features.length > 0 && (
                  <div className={styles.featuresRow}>
                    <div className={styles.features}>
                      {turf.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className={styles.featureTag}>
                          {feature}
                        </span>
                      ))}
                      {turf.features.length > 3 && (
                        <span className={styles.moreFeatures}>
                          +{turf.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className={styles.cardMeta}>
                  <span>ID: {turf._id.slice(-6)}</span>
                  <span>{new Date(turf.createdAt).toLocaleDateString()}</span>
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => setEditingTurf(turf)}
                  >
                    Edit
                  </button>

                  <button
                    className={`${styles.maintenanceBtn} ${
                      turf.status === "maintenance" ? styles.activateBtn : ""
                    }`}
                    onClick={() =>
                      handleMaintenanceToggle(turf._id, turf.status)
                    }
                  >
                    {turf.status === "active" ? "Maintenance" : "Activate"}
                  </button>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteTurf(turf)}
                    disabled={deletingTurf === turf._id}
                  >
                    {deletingTurf === turf._id ? (
                      <span className={styles.deletingSpinner}></span>
                    ) : (
                      <FaTrash className={styles.deleteIcon} />
                    )}
                    {deletingTurf === turf._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {editingTurf && (
        <EditTurfForm
          url={url}
          turfData={editingTurf}
          onClose={() => setEditingTurf(null)}
          onSuccess={fetchTurfs}
        />
      )}

      {/* Add Turf Modal */}
      {showAddForm && (
        <AddTurfForm
          url={url}
          onClose={() => setShowAddForm(false)}
          onSuccess={fetchTurfs}
        />
      )}
    </div>
  );
};

export default TurfListing;
