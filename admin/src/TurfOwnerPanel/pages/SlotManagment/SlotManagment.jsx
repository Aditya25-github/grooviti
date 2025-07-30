import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SlotManagement.module.css";
import {
  FaCalendarAlt,
  FaClock,
  FaSave,
  FaSync,
  FaDownload,
  FaCircle,
  FaTimes,
  FaEdit,
  FaRupeeSign,
} from "react-icons/fa";

const SlotManagement = ({ url, turfId }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTurf, setSelectedTurf] = useState("Current Turf");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // Generate 24-hour slots
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    const nextHour = ((i + 1) % 24).toString().padStart(2, "0");
    return {
      id: `${hour}:00-${nextHour}:00`,
      startTime: `${hour}:00`,
      endTime: `${nextHour}:00`,
      time: `${hour}:00 - ${nextHour}:00`,
    };
  });

  const bookingSources = [
    { id: "cash", name: "Cash", color: "#3b82f6" },
    { id: "playo", name: "Playo", color: "#f59e0b" },
    { id: "khelomore", name: "Khelomore", color: "#ef4444" },
    { id: "grooviti", name: "Grooviti", color: "#8b5cf6" },
  ];

  // Load existing slots for selected date
  useEffect(() => {
    if (!selectedDate || !turfId) return;
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${url}/api/slots?turfId=${turfId}&date=${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
            },
          }
        );
        setSlots(response.data);
      } catch (err) {
        console.error("Failed to fetch slots", err);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, turfId, url]);

  // Create merged slots data for display
  const mergedSlots = hours.map((hourSlot) => {
    const existingSlot = slots.find(
      (slot) => slot.startTime === hourSlot.startTime
    );
    if (existingSlot) {
      return {
        ...hourSlot,
        ...existingSlot,
        status:
          existingSlot.status === "booked"
            ? `booked-${existingSlot.source || "cash"}`
            : existingSlot.status,
        customer: existingSlot.customerName,
      };
    }
    return {
      ...hourSlot,
      status: "inactive",
      price: 0,
      source: null,
      customer: null,
    };
  });

  const toggleSlot = (hourSlot) => {
    const existing = slots.find(
      (slot) => slot.startTime === hourSlot.startTime
    );
    if (existing) {
      // Remove slot
      setSlots(slots.filter((slot) => slot.startTime !== hourSlot.startTime));
    } else {
      // Add new slot - show price modal
      setEditingSlot({
        startTime: hourSlot.startTime,
        endTime: hourSlot.endTime,
        price: 0,
        status: "available",
        customerName: "",
        source: "",
        totalTickets: 1,
        bookedTickets: 0,
      });
      setShowPriceModal(true);
    }
  };

  const handleSlotClick = (slot) => {
    if (slot.status === "available") {
      setSelectedSlot(slot);
      setShowSourceModal(true);
    } else if (slot.status === "inactive") {
      toggleSlot(slot);
    }
  };

  const updateSlotField = (startTime, field, value) => {
    setSlots(
      slots.map((slot) =>
        slot.startTime === startTime ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSourceSelect = (source) => {
    if (selectedSlot) {
      const customerName = prompt("Enter customer name:");
      if (customerName) {
        updateSlotField(selectedSlot.startTime, "status", "booked");
        updateSlotField(selectedSlot.startTime, "source", source.id);
        updateSlotField(selectedSlot.startTime, "customerName", customerName);
      }
    }
    setShowSourceModal(false);
    setSelectedSlot(null);
  };

  const handlePriceSubmit = (price) => {
    if (editingSlot && price > 0) {
      const newSlot = {
        ...editingSlot,
        price: parseFloat(price),
      };
      setSlots([...slots, newSlot]);
    }
    setShowPriceModal(false);
    setEditingSlot(null);
  };

  const handleRemoveBlock = (slotStartTime) => {
    updateSlotField(slotStartTime, "status", "available");
  };

  const saveSlots = async () => {
    if (!selectedDate) return alert("Please select a date first");
    try {
      setLoading(true);
      await axios.post(
        `${url}/api/slots`,
        {
          turfId,
          date: selectedDate,
          slots,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
          },
        }
      );
      alert("Slots saved successfully!");
    } catch (err) {
      console.error("Failed to save slots", err);
      alert("Failed to save slots");
    } finally {
      setLoading(false);
    }
  };

  const cancelSlotBooking = async (slot) => {
    if (!slot._id) {
      // If it's a local slot, just update locally
      updateSlotField(slot.startTime, "status", "available");
      updateSlotField(slot.startTime, "source", "");
      updateSlotField(slot.startTime, "customerName", "");
      return;
    }

    try {
      await axios.patch(
        `${url}/api/slots/${slot._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
          },
        }
      );
      // Refresh slots
      if (selectedDate && turfId) {
        const response = await axios.get(
          `${url}/api/slots?turfId=${turfId}&date=${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
            },
          }
        );
        setSlots(response.data);
      }
    } catch (err) {
      console.error("Cancel failed", err);
      alert("Failed to cancel booking");
    }
  };

  const loadSlots = () => {
    if (selectedDate && turfId) {
      window.location.reload(); // Simple refresh for now
    } else {
      alert("Please select a date first");
    }
  };

  // Statistics
  const availableSlots = mergedSlots.filter(
    (slot) => slot.status === "available"
  ).length;
  const bookedSlots = mergedSlots.filter((slot) =>
    slot.status.startsWith("booked")
  ).length;
  const blockedSlots = mergedSlots.filter(
    (slot) => slot.status === "blocked"
  ).length;
  const activeSlots = mergedSlots.filter(
    (slot) => slot.status !== "inactive"
  ).length;

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "#10b981";
      case "booked-cash":
        return "#3b82f6";
      case "booked-playo":
        return "#f59e0b";
      case "booked-khelomore":
        return "#ef4444";
      case "booked-grooviti":
        return "#8b5cf6";
      case "blocked":
        return "#6b7280";
      case "inactive":
        return "#d1d5db";
      default:
        return "#e5e7eb";
    }
  };

  const getStatusText = (status, source) => {
    if (status === "available") return "Available";
    if (status === "blocked") return "Blocked";
    if (status === "inactive") return "Click to Add";
    if (status.startsWith("booked")) {
      const sourceObj = bookingSources.find((s) => s.id === source);
      return `Booked - ${sourceObj?.name || "Unknown"}`;
    }
    return status;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Select Date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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
          <button
            onClick={saveSlots}
            className={styles.saveBtn}
            disabled={loading}
          >
            <FaSave className={styles.btnIcon} />
            {loading ? "Saving..." : "Save"}
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
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.dateInput}
              min={new Date().toISOString().split("T")[0]}
            />
            <FaCalendarAlt className={styles.dateIcon} />
          </div>
        </div>

        <div className={styles.turfControl}>
          <label className={styles.controlLabel}>Current Turf</label>
          <div className={styles.turfInfo}>
            <span className={styles.turfName}>{selectedTurf}</span>
            <span className={styles.turfId}>ID: {turfId}</span>
          </div>
        </div>

        <button onClick={loadSlots} className={styles.loadBtn}>
          <FaSync className={styles.btnIcon} />
          Refresh
        </button>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <FaCircle
            className={styles.legendIcon}
            style={{ color: "#d1d5db" }}
          />
          <span>Inactive (Click to Add)</span>
        </div>
        <div className={styles.legendItem}>
          <FaCircle
            className={styles.legendIcon}
            style={{ color: "#10b981" }}
          />
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <FaCircle
            className={styles.legendIcon}
            style={{ color: "#3b82f6" }}
          />
          <span>Booked - Cash</span>
        </div>
        <div className={styles.legendItem}>
          <FaCircle
            className={styles.legendIcon}
            style={{ color: "#8b5cf6" }}
          />
          <span>Booked - Grooviti</span>
        </div>
        <div className={styles.legendItem}>
          <FaCircle
            className={styles.legendIcon}
            style={{ color: "#f59e0b" }}
          />
          <span>Booked - Playo</span>
        </div>
        <div className={styles.legendItem}>
          <FaCircle
            className={styles.legendIcon}
            style={{ color: "#ef4444" }}
          />
          <span>Booked - Khelomore</span>
        </div>
        <div className={styles.legendItem}>
          <FaCircle
            className={styles.legendIcon}
            style={{ color: "#6b7280" }}
          />
          <span>Blocked</span>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{activeSlots}</div>
          <div className={styles.statLabel}>Active Slots</div>
        </div>
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
            {activeSlots > 0
              ? Math.round((bookedSlots / activeSlots) * 100)
              : 0}
            %
          </div>
          <div className={styles.statLabel}>Occupancy</div>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className={styles.slotsSection}>
        <h2 className={styles.sectionTitle}>
          Time Slots - {formatDate(selectedDate)}
        </h2>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading slots...</p>
          </div>
        ) : (
          <div className={styles.slotsGrid}>
            {mergedSlots.map((slot) => (
              <div
                key={slot.id}
                className={styles.slotCard}
                data-status={slot.status}
                onClick={() => handleSlotClick(slot)}
              >
                <div className={styles.slotHeader}>
                  <div className={styles.slotTime}>
                    <FaClock className={styles.timeIcon} />
                    {slot.time}
                  </div>
                  <div className={styles.slotStatus}>
                    <FaCircle
                      className={styles.statusIndicator}
                      style={{ color: getStatusColor(slot.status) }}
                    />
                    <span
                      className={styles.statusText}
                      style={{ color: getStatusColor(slot.status) }}
                    >
                      {getStatusText(slot.status, slot.source)}
                    </span>
                  </div>
                </div>

                <div className={styles.slotContent}>
                  {slot.price > 0 && (
                    <div className={styles.priceInfo}>
                      <FaRupeeSign className={styles.priceIcon} />
                      <span className={styles.priceText}>{slot.price}/hr</span>
                    </div>
                  )}

                  {slot.status.startsWith("booked") && (
                    <div className={styles.bookingInfo}>
                      <div className={styles.customerInfo}>
                        Customer: {slot.customer}
                      </div>
                      <button
                        className={styles.cancelBookingBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Cancel this booking?")) {
                            cancelSlotBooking(slot);
                          }
                        }}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}

                  {slot.status === "available" && (
                    <div className={styles.availableAction}>
                      <div className={styles.selectSourceText}>
                        Click to book
                      </div>
                    </div>
                  )}

                  {slot.status === "inactive" && (
                    <div className={styles.inactiveAction}>
                      <div className={styles.addSlotText}>+ Add Slot</div>
                    </div>
                  )}

                  {slot.status === "blocked" && (
                    <div className={styles.blockedActions}>
                      <div className={styles.maintenanceText}>
                        Maintenance Block
                      </div>
                      <button
                        className={styles.removeBlockBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBlock(slot.startTime);
                        }}
                      >
                        Remove Block
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Modal */}
      {showPriceModal && (
        <div className={styles.modal} onClick={() => setShowPriceModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Set Slot Price</h3>
              <button
                onClick={() => setShowPriceModal(false)}
                className={styles.modalCloseBtn}
              >
                <FaTimes />
              </button>
            </div>
            <p className={styles.modalDesc}>
              Set price for slot:{" "}
              <strong>
                {editingSlot?.startTime} - {editingSlot?.endTime}
              </strong>
            </p>

            <div className={styles.priceForm}>
              <div className={styles.priceInputWrapper}>
                <FaRupeeSign className={styles.priceInputIcon} />
                <input
                  type="number"
                  placeholder="Enter price per hour"
                  className={styles.priceInput}
                  min="0"
                  step="50"
                  id="slotPrice"
                />
              </div>
              <button
                onClick={() => {
                  const price = document.getElementById("slotPrice").value;
                  if (price > 0) {
                    handlePriceSubmit(price);
                  } else {
                    alert("Please enter a valid price");
                  }
                }}
                className={styles.setPriceBtn}
              >
                Set Price & Add Slot
              </button>
            </div>

            <button
              onClick={() => setShowPriceModal(false)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Source Selection Modal */}
      {showSourceModal && (
        <div className={styles.modal} onClick={() => setShowSourceModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Select Booking Source</h3>
              <button
                onClick={() => setShowSourceModal(false)}
                className={styles.modalCloseBtn}
              >
                <FaTimes />
              </button>
            </div>
            <p className={styles.modalDesc}>
              Choose the booking source for slot:{" "}
              <strong>{selectedSlot?.time}</strong>
            </p>

            <div className={styles.sourceOptions}>
              {bookingSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleSourceSelect(source)}
                  className={styles.sourceBtn}
                >
                  <FaCircle
                    className={styles.sourceIcon}
                    style={{ color: source.color }}
                  />
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
          <button
            className={styles.bulkBtn}
            onClick={() => {
              const startTime = prompt("Enter start time (HH:00):");
              const endTime = prompt("Enter end time (HH:00):");
              if (startTime && endTime) {
                // Logic to block multiple slots
                alert("Feature coming soon!");
              }
            }}
          >
            <FaClock className={styles.bulkIcon} />
            Block Multiple Slots
          </button>
          <button
            className={styles.bulkBtn}
            onClick={() => {
              if (window.confirm("Clear all slots for this date?")) {
                setSlots([]);
              }
            }}
          >
            <FaTimes className={styles.bulkIcon} />
            Clear All Slots
          </button>
          <button className={styles.bulkBtn}>
            <FaDownload className={styles.bulkIcon} />
            Export Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotManagement;
