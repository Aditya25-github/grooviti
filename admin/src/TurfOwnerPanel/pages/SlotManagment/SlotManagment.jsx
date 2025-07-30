import React, { useState } from "react";
import styles from "./SlotManagment.module.css";
import {
  FaCalendarAlt,
  FaClock,
  FaSave,
  FaSync,
  FaDownload,
} from "react-icons/fa";

const SlotManagement = () => {
  const [selectedDate, setSelectedDate] = useState("15/01/2024");
  const [selectedTurf, setSelectedTurf] = useState("Turf A - Main Ground");

  // Time slots with booking sources
  const [timeSlots, setTimeSlots] = useState([
    {
      id: "06:00-07:00",
      time: "06:00 - 07:00",
      status: "available",
      source: null,
      customer: null,
    },
    {
      id: "07:00-08:00",
      time: "07:00 - 08:00",
      status: "available",
      source: null,
      customer: null,
    },
    {
      id: "08:00-09:00",
      time: "08:00 - 09:00",
      status: "booked-cash",
      source: "cash",
      customer: "John Doe",
    },
    {
      id: "09:00-10:00",
      time: "09:00 - 10:00",
      status: "available",
      source: null,
      customer: null,
    },
    {
      id: "10:00-11:00",
      time: "10:00 - 11:00",
      status: "booked-grooviti",
      source: "grooviti",
      customer: "Mike Smith",
    },
    {
      id: "11:00-12:00",
      time: "11:00 - 12:00",
      status: "available",
      source: null,
      customer: null,
    },
    {
      id: "12:00-13:00",
      time: "12:00 - 13:00",
      status: "booked-playo",
      source: "playo",
      customer: "Alex Johnson",
    },
    {
      id: "13:00-14:00",
      time: "13:00 - 14:00",
      status: "available",
      source: null,
      customer: null,
    },
    {
      id: "14:00-15:00",
      time: "14:00 - 15:00",
      status: "booked-khelomore",
      source: "khelomore",
      customer: "Sarah Wilson",
    },
    {
      id: "15:00-16:00",
      time: "15:00 - 16:00",
      status: "available",
      source: null,
      customer: null,
    },
    {
      id: "16:00-17:00",
      time: "16:00 - 17:00",
      status: "available",
      source: null,
      customer: null,
    },
    {
      id: "17:00-18:00",
      time: "17:00 - 18:00",
      status: "blocked",
      source: null,
      customer: null,
    },
  ]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSourceModal, setShowSourceModal] = useState(false);

  const bookingSources = [
    { id: "cash", name: "Cash", color: "#3b82f6" },
    { id: "playo", name: "Playo", color: "#f59e0b" },
    { id: "khelomore", name: "Khelomore", color: "#ef4444" },
    { id: "grooviti", name: "Grooviti", color: "#8b5cf6" },
  ];

  const handleSlotClick = (slot) => {
    if (slot.status === "available") {
      setSelectedSlot(slot);
      setShowSourceModal(true);
    }
  };

  const handleSourceSelect = (source) => {
    if (selectedSlot) {
      const customerName = prompt("Enter customer name:");
      if (customerName) {
        setTimeSlots((prev) =>
          prev.map((slot) =>
            slot.id === selectedSlot.id
              ? {
                  ...slot,
                  status: `booked-${source.id}`,
                  source: source.id,
                  customer: customerName,
                }
              : slot
          )
        );
      }
    }
    setShowSourceModal(false);
    setSelectedSlot(null);
  };

  const loadSlots = () => {
    console.log("Loading slots for:", selectedDate, selectedTurf);
    alert("Slots loaded successfully!");
  };

  const saveChanges = () => {
    console.log("Saving slot changes");
    alert("Changes saved successfully!");
  };

  // Statistics
  const availableSlots = timeSlots.filter(
    (slot) => slot.status === "available"
  ).length;
  const bookedSlots = timeSlots.filter((slot) =>
    slot.status.startsWith("booked")
  ).length;
  const blockedSlots = timeSlots.filter(
    (slot) => slot.status === "blocked"
  ).length;

  const getSlotClass = (status) => {
    switch (status) {
      case "available":
        return styles.slotAvailable;
      case "booked-cash":
        return styles.slotCash;
      case "booked-playo":
        return styles.slotPlayo;
      case "booked-khelomore":
        return styles.slotKhelomore;
      case "booked-grooviti":
        return styles.slotGrooviti;
      case "blocked":
        return styles.slotBlocked;
      default:
        return styles.slotDefault;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Slot Management</h1>
          <p className={styles.description}>
            Manage 1-hour slots and assign booking sources for your turfs
          </p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={saveChanges} className={styles.saveBtn}>
            <FaSave className={styles.btnIcon} />
            Save
          </button>
          <button className={styles.exportBtn}>
            <FaDownload className={styles.btnIcon} />
            Export
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controlsSection}>
        <div className={styles.dateControl}>
          <label className={styles.controlLabel}>Select Date</label>
          <div className={styles.dateInputWrapper}>
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.dateInput}
              placeholder="DD/MM/YYYY"
            />
            <FaCalendarAlt className={styles.dateIcon} />
          </div>
        </div>

        <div className={styles.turfControl}>
          <label className={styles.controlLabel}>Select Turf</label>
          <select
            value={selectedTurf}
            onChange={(e) => setSelectedTurf(e.target.value)}
            className={styles.turfSelect}
          >
            <option value="Turf A - Main Ground">Turf A - Main Ground</option>
            <option value="Turf B - Side Ground">Turf B - Side Ground</option>
            <option value="Turf C - Cricket Ground">
              Turf C - Cricket Ground
            </option>
          </select>
        </div>

        <button onClick={loadSlots} className={styles.loadBtn}>
          <FaSync className={styles.btnIcon} />
          Load Slots
        </button>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div
            className={`${styles.legendColor} ${styles.colorAvailable}`}
          ></div>
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.colorCash}`}></div>
          <span>Booked - Cash</span>
        </div>
        <div className={styles.legendItem}>
          <div
            className={`${styles.legendColor} ${styles.colorGrooviti}`}
          ></div>
          <span>Booked - Grooviti</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.colorPlayo}`}></div>
          <span>Booked - Playo</span>
        </div>
        <div className={styles.legendItem}>
          <div
            className={`${styles.legendColor} ${styles.colorKhelomore}`}
          ></div>
          <span>Booked - Khelomore</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.colorBlocked}`}></div>
          <span>Blocked</span>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{availableSlots}</div>
          <div className={styles.statLabel}>Available</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{bookedSlots}</div>
          <div className={styles.statLabel}>Booked</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{blockedSlots}</div>
          <div className={styles.statLabel}>Blocked</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {Math.round((bookedSlots / timeSlots.length) * 100)}%
          </div>
          <div className={styles.statLabel}>Occupancy</div>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className={styles.slotsSection}>
        <h2 className={styles.sectionTitle}>Time Slots - January 15, 2024</h2>

        <div className={styles.slotsGrid}>
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className={`${styles.slotCard} ${getSlotClass(slot.status)}`}
              onClick={() => handleSlotClick(slot)}
            >
              <div className={styles.slotTime}>{slot.time}</div>

              {slot.status.startsWith("booked") && (
                <div className={styles.slotDetails}>
                  <div className={styles.bookingSource}>
                    {bookingSources.find((s) => s.id === slot.source)?.name}
                  </div>
                  <div className={styles.customerName}>
                    Customer: {slot.customer}
                  </div>
                </div>
              )}

              {slot.status === "available" && (
                <div className={styles.slotAction}>
                  <div className={styles.selectSource}>Select Source</div>
                </div>
              )}

              {slot.status === "blocked" && (
                <div className={styles.slotDetails}>
                  <div className={styles.maintenanceBlock}>
                    Maintenance Block
                  </div>
                  <div className={styles.removeBlock}>Remove Block</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Source Selection Modal */}
      {showSourceModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Select Booking Source</h3>
            <p className={styles.modalDesc}>
              Choose the booking source for slot: {selectedSlot?.time}
            </p>

            <div className={styles.sourceOptions}>
              {bookingSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleSourceSelect(source)}
                  className={styles.sourceBtn}
                  style={{ borderColor: source.color }}
                >
                  <div
                    className={styles.sourceColor}
                    style={{ backgroundColor: source.color }}
                  ></div>
                  {source.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSourceModal(false)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      <div className={styles.bulkActions}>
        <h3 className={styles.bulkTitle}>Bulk Actions</h3>
        <div className={styles.bulkButtons}>
          <button className={styles.bulkBtn}>Block Multiple Slots</button>
          <button className={styles.bulkBtn}>Clear All Slots</button>
          <button className={styles.bulkBtn}>Export Schedule</button>
        </div>
      </div>
    </div>
  );
};

export default SlotManagement;
