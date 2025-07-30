import React, { useState } from "react";
import styles from "./Pricing.module.css";
import {
  FaTag,
  FaSave,
  FaPlus,
  FaEdit,
  FaTrash,
  FaClock,
  FaCalendarAlt,
  FaCopy,
  FaDownload,
  FaInfoCircle,
} from "react-icons/fa";

const Pricing = () => {
  const [activeTab, setActiveTab] = useState("turf-pricing");
  const [showAddPricing, setShowAddPricing] = useState(false);

  // Mock pricing data
  const [turfPricing] = useState([
    {
      id: "turf-a",
      name: "Premier Football Turf",
      type: "Football",
      basePrice: 1200,
      peakHourRate: 1500,
      offPeakRate: 800,
      weekendRate: 1400,
      tournamentRate: 2000,
      status: "active",
    },
    {
      id: "turf-b",
      name: "Elite Cricket Ground",
      type: "Cricket",
      basePrice: 2000,
      peakHourRate: 2500,
      offPeakRate: 1500,
      weekendRate: 2200,
      tournamentRate: 3000,
      status: "active",
    },
    {
      id: "turf-c",
      name: "City Multi-sports Arena",
      type: "Multi-Sport",
      basePrice: 1500,
      peakHourRate: 1800,
      offPeakRate: 1000,
      weekendRate: 1600,
      tournamentRate: 2500,
      status: "maintenance",
    },
  ]);

  const [timeSlots] = useState([
    {
      id: "morning",
      label: "Morning (6 AM - 12 PM)",
      rate: 800,
      type: "off-peak",
    },
    {
      id: "afternoon",
      label: "Afternoon (12 PM - 6 PM)",
      rate: 1200,
      type: "standard",
    },
    {
      id: "evening",
      label: "Evening (6 PM - 10 PM)",
      rate: 1500,
      type: "peak",
    },
    {
      id: "night",
      label: "Night (10 PM - 12 AM)",
      rate: 1000,
      type: "off-peak",
    },
  ]);

  const [specialRates] = useState([
    {
      id: "tournament",
      name: "Tournament Package",
      description: "Special rates for tournament bookings",
      rate: 2500,
      minDuration: "4 hours",
      discount: "10%",
      validUntil: "2025-12-31",
    },
    {
      id: "corporate",
      name: "Corporate Package",
      description: "Bulk booking rates for corporate events",
      rate: 2000,
      minDuration: "8 hours",
      discount: "15%",
      validUntil: "2025-12-31",
    },
  ]);

  const [newPricingForm, setNewPricingForm] = useState({
    turfName: "",
    turfType: "",
    basePrice: "",
    peakHourRate: "",
    offPeakRate: "",
    weekendRate: "",
    tournamentRate: "",
  });

  // Statistics
  const totalTurfs = turfPricing.length;
  const activeTurfs = turfPricing.filter((t) => t.status === "active").length;
  const averagePrice = Math.round(
    turfPricing.reduce((sum, t) => sum + t.basePrice, 0) / totalTurfs
  );
  const totalRevenue = 245680; // Mock data

  const handleInputChange = (field, value) => {
    setNewPricingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitPricing = (e) => {
    e.preventDefault();
    console.log("Submitting new pricing:", newPricingForm);
    alert("Pricing configuration saved successfully!");
    setNewPricingForm({
      turfName: "",
      turfType: "",
      basePrice: "",
      peakHourRate: "",
      offPeakRate: "",
      weekendRate: "",
      tournamentRate: "",
    });
    setShowAddPricing(false);
  };

  const handleEditPricing = (turfId) => {
    console.log("Edit pricing for:", turfId);
    alert(`Opening edit form for ${turfId}`);
  };

  const handleDeletePricing = (turfId) => {
    console.log("Delete pricing for:", turfId);
    if (
      window.confirm(
        "Are you sure you want to delete this pricing configuration?"
      )
    ) {
      alert(`Pricing for ${turfId} deleted`);
    }
  };

  const handleCopyPricing = (turfId) => {
    console.log("Copy pricing from:", turfId);
    alert(`Pricing copied from ${turfId}`);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return styles.statusActive;
      case "maintenance":
        return styles.statusMaintenance;
      default:
        return styles.statusDefault;
    }
  };

  const getSlotTypeClass = (type) => {
    switch (type) {
      case "peak":
        return styles.slotPeak;
      case "off-peak":
        return styles.slotOffPeak;
      case "standard":
        return styles.slotStandard;
      default:
        return styles.slotDefault;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Pricing Management</h1>
          <p className={styles.description}>
            Configure and manage pricing for all your turf venues
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>
            <FaDownload className={styles.btnIcon} />
            Export Pricing
          </button>
          <button
            onClick={() => setShowAddPricing(true)}
            className={styles.addBtn}
          >
            <FaPlus className={styles.btnIcon} />
            Add New Pricing
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏟️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totalTurfs}</div>
            <div className={styles.statLabel}>Total Turfs</div>
            <div className={styles.statChange}>{activeTurfs} active</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>₹{averagePrice}</div>
            <div className={styles.statLabel}>Average Price</div>
            <div className={styles.statChange}>per hour</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div className={styles.statLabel}>Monthly Revenue</div>
            <div className={styles.statChange}>+15% vs last month</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>78%</div>
            <div className={styles.statLabel}>Occupancy Rate</div>
            <div className={styles.statChange}>optimal pricing</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${
            activeTab === "turf-pricing" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("turf-pricing")}
        >
          <FaTag className={styles.tabIcon} />
          Turf Pricing
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "time-slots" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("time-slots")}
        >
          <FaClock className={styles.tabIcon} />
          Time Slots
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "special-rates" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("special-rates")}
        >
          <FaCalendarAlt className={styles.tabIcon} />
          Special Rates
        </button>
      </div>

      {/* Add Pricing Modal */}
      {showAddPricing && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Add New Pricing Configuration
              </h3>
              <button
                onClick={() => setShowAddPricing(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitPricing} className={styles.pricingForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Turf Name</label>
                  <input
                    type="text"
                    placeholder="Enter turf name"
                    value={newPricingForm.turfName}
                    onChange={(e) =>
                      handleInputChange("turfName", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Turf Type</label>
                  <select
                    value={newPricingForm.turfType}
                    onChange={(e) =>
                      handleInputChange("turfType", e.target.value)
                    }
                    className={styles.select}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Football">Football</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Multi-Sport">Multi-Sport</option>
                    <option value="Tennis">Tennis</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Base Price (₹/hour)</label>
                  <input
                    type="number"
                    placeholder="1200"
                    value={newPricingForm.basePrice}
                    onChange={(e) =>
                      handleInputChange("basePrice", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Peak Hour Rate (₹/hour)
                  </label>
                  <input
                    type="number"
                    placeholder="1500"
                    value={newPricingForm.peakHourRate}
                    onChange={(e) =>
                      handleInputChange("peakHourRate", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Off-Peak Rate (₹/hour)</label>
                  <input
                    type="number"
                    placeholder="800"
                    value={newPricingForm.offPeakRate}
                    onChange={(e) =>
                      handleInputChange("offPeakRate", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Weekend Rate (₹/hour)</label>
                  <input
                    type="number"
                    placeholder="1400"
                    value={newPricingForm.weekendRate}
                    onChange={(e) =>
                      handleInputChange("weekendRate", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tournament Rate (₹/hour)</label>
                <input
                  type="number"
                  placeholder="2000"
                  value={newPricingForm.tournamentRate}
                  onChange={(e) =>
                    handleInputChange("tournamentRate", e.target.value)
                  }
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>
                  <FaSave className={styles.btnIcon} />
                  Save Pricing
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPricing(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "turf-pricing" && (
          <div className={styles.turfPricingSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Turf Pricing Configuration
              </h2>
              <div className={styles.pricingTip}>
                <FaInfoCircle className={styles.tipIcon} />
                <span>
                  Adjust prices based on demand and competition analysis
                </span>
              </div>
            </div>

            <div className={styles.pricingGrid}>
              {turfPricing.map((turf) => (
                <div key={turf.id} className={styles.pricingCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.turfInfo}>
                      <h3 className={styles.turfName}>{turf.name}</h3>
                      <span className={styles.turfType}>{turf.type}</span>
                    </div>
                    <div
                      className={`${styles.turfStatus} ${getStatusClass(
                        turf.status
                      )}`}
                    >
                      {turf.status}
                    </div>
                  </div>

                  <div className={styles.pricingDetails}>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Base Price:</span>
                      <span className={styles.priceValue}>
                        ₹{turf.basePrice}/hr
                      </span>
                    </div>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Peak Hours:</span>
                      <span className={styles.priceValue}>
                        ₹{turf.peakHourRate}/hr
                      </span>
                    </div>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Off-Peak:</span>
                      <span className={styles.priceValue}>
                        ₹{turf.offPeakRate}/hr
                      </span>
                    </div>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Weekend:</span>
                      <span className={styles.priceValue}>
                        ₹{turf.weekendRate}/hr
                      </span>
                    </div>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Tournament:</span>
                      <span className={styles.priceValue}>
                        ₹{turf.tournamentRate}/hr
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      onClick={() => handleEditPricing(turf.id)}
                      className={styles.actionBtn}
                    >
                      <FaEdit className={styles.actionIcon} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleCopyPricing(turf.id)}
                      className={styles.actionBtn}
                    >
                      <FaCopy className={styles.actionIcon} />
                      Copy
                    </button>
                    <button
                      onClick={() => handleDeletePricing(turf.id)}
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    >
                      <FaTrash className={styles.actionIcon} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "time-slots" && (
          <div className={styles.timeSlotsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Time Slot Pricing</h2>
              <button className={styles.addSlotBtn}>
                <FaPlus className={styles.btnIcon} />
                Add Time Slot
              </button>
            </div>

            <div className={styles.slotsGrid}>
              {timeSlots.map((slot) => (
                <div key={slot.id} className={styles.slotCard}>
                  <div className={styles.slotHeader}>
                    <div className={styles.slotTime}>{slot.label}</div>
                    <div
                      className={`${styles.slotType} ${getSlotTypeClass(
                        slot.type
                      )}`}
                    >
                      {slot.type}
                    </div>
                  </div>
                  <div className={styles.slotPrice}>₹{slot.rate}/hour</div>
                  <div className={styles.slotActions}>
                    <button className={styles.slotActionBtn}>
                      <FaEdit className={styles.actionIcon} />
                    </button>
                    <button className={styles.slotActionBtn}>
                      <FaTrash className={styles.actionIcon} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "special-rates" && (
          <div className={styles.specialRatesSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Special Rates & Packages</h2>
              <button className={styles.addRateBtn}>
                <FaPlus className={styles.btnIcon} />
                Add Special Rate
              </button>
            </div>

            <div className={styles.ratesGrid}>
              {specialRates.map((rate) => (
                <div key={rate.id} className={styles.rateCard}>
                  <div className={styles.rateHeader}>
                    <h3 className={styles.rateName}>{rate.name}</h3>
                    <div className={styles.rateDiscount}>
                      {rate.discount} OFF
                    </div>
                  </div>
                  <p className={styles.rateDescription}>{rate.description}</p>
                  <div className={styles.rateDetails}>
                    <div className={styles.rateDetail}>
                      <span className={styles.detailLabel}>Rate:</span>
                      <span className={styles.detailValue}>
                        ₹{rate.rate}/hr
                      </span>
                    </div>
                    <div className={styles.rateDetail}>
                      <span className={styles.detailLabel}>Min Duration:</span>
                      <span className={styles.detailValue}>
                        {rate.minDuration}
                      </span>
                    </div>
                    <div className={styles.rateDetail}>
                      <span className={styles.detailLabel}>Valid Until:</span>
                      <span className={styles.detailValue}>
                        {rate.validUntil}
                      </span>
                    </div>
                  </div>
                  <div className={styles.rateActions}>
                    <button className={styles.actionBtn}>
                      <FaEdit className={styles.actionIcon} />
                      Edit
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    >
                      <FaTrash className={styles.actionIcon} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
