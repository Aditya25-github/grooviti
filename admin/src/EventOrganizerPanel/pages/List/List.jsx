import React, { useEffect, useState, useMemo } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FaTags, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle, 
  FaTicketAlt, FaCheckCircle, FaMoneyBillWave, 
  FaDownload, FaTimes, FaTrash, FaChartBar, FaList
} from "react-icons/fa";

// Helper for downloads
const downloadFile = ({ data, fileName, mimeType }) => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const objectToCsv = (obj, orderKeys) => {
  const keys = orderKeys || Object.keys(obj || {});
  const header = keys.join(",");
  const row = keys
    .map((k) => {
      const v = obj?.[k];
      if (v === null || v === undefined) return "";
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    })
    .join(",");
  return "\uFEFF" + header + "\n" + row;
};

// Venue/location display
const formatVenue = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    return [
      value.address,
      value.city,
      value.state,
      value.country
    ].filter(Boolean).join(", ");
  }
  return String(value);
};

// Stats builder
const buildEventStats = (event) => ({
  id: event?._id ?? "",
  name: event?.name ?? "",
  category: event?.category ?? "",
  price: event?.price ?? 0,
  status: event?.status ?? "Active",
  date: event?.date ?? event?.startDate ?? "",
  venue: event?.venue ?? event?.location ?? "",
  totalTickets: event?.totalTickets ?? 0,
  ticketsSold: event?.ticketsSold ?? 0,
  revenue:
    "revenue" in event
      ? event.revenue
      : event?.ticketsSold && event?.price
      ? event.ticketsSold * event.price
      : 0,
  organizerEmail: event?.organizerEmail ?? event?.hostEmail ?? "",
});

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">
            <FaChartBar className="modal-title-icon" />
            <h3>{title}</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close">
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);

  const listMyEvents = async () => {
    const email = localStorage.getItem("eventHost");
    if (!email) {
      toast.error("Organizer email not found.");
      return;
    }
    try {
      const response = await axios.get(`${url}/api/event/my-events?email=${email}`);
      if (response.data.success) setList(response.data.events);
      else toast.error("Error fetching your events");
    } catch {
      toast.error("Network error: Unable to fetch events");
    }
  };

  const RemoveEvent = async (eventId) => {
    try {
      const response = await axios.post(`${url}/api/event/remove`, { id: eventId });
      if (response.data.success) {
        await listMyEvents();
        toast.success(response.data.message);
      } else toast.error("Error deleting event");
    } catch {
      toast.error("Network error: Unable to delete event");
    }
  };

  // Stats for selected event
  const stats = useMemo(() => (selected ? buildEventStats(selected) : null), [selected]);
  
  const downloadAsCSV = () => {
    if (!stats) return;
    const out = { ...stats, venue: formatVenue(stats.venue) };
    const csv = objectToCsv(out);
    downloadFile({
      data: csv,
      fileName: `${stats.name || "event"}-stats.csv`,
      mimeType: "text/csv;charset=utf-8",
    });
  };

  const downloadAsJSON = () => {
    if (!stats) return;
    const out = { ...stats, venue: formatVenue(stats.venue) };
    downloadFile({
      data: JSON.stringify(out, null, 2),
      fileName: `${stats.name || "event"}-stats.json`,
      mimeType: "application/json;charset=utf-8",
    });
  };

  useEffect(() => {
    listMyEvents();
  }, [url]);

  return (
    <div className="list add flex-col">
      <div className="list-header">
        <FaList className="list-header-icon" />
        <h2>My Events</h2>
      </div>
      
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item) => (
          <div
            key={item._id}
            className="list-table-format"
            onClick={(e) => {
              if (e.target.dataset && e.target.dataset.action === "delete") return;
              setSelected(item);
            }}
          >
            <img src={item.coverImage?.url || ""} alt={item.name} />
            <p className="event-name">{item.name}</p>
            <p className="event-category">
              <FaTags className="category-icon" />
              {item.category}
            </p>
            <p className="event-price">Rs.{item.price}</p>
            <button
              data-action="delete"
              onClick={(e) => {
                e.stopPropagation();
                RemoveEvent(item._id);
              }}
              className="delete-btn"
              title="Delete event"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Event Stats: ${selected.name}` : "Event Stats"}
      >
        {stats && (
          <>
            <div className="event-details-grid">
              <div className="event-image-container">
                <img
                  src={selected.coverImage?.url || ""}
                  alt={selected.name}
                  className="event-modal-image"
                />
              </div>
              <div className="event-details">
                <div className="detail-row">
                  <FaTags className="detail-icon category" />
                  <strong>Category:</strong> 
                  <span>{selected.category}</span>
                </div>
                <div className="detail-row">
                  <FaMapMarkerAlt className="detail-icon venue" />
                  <strong>Venue:</strong> 
                  <span>{formatVenue(stats.venue)}</span>
                </div>
                <div className="detail-row">
                  <FaCalendarAlt className="detail-icon date" />
                  <strong>Date:</strong> 
                  <span>{stats.date}</span>
                </div>
                <div className="detail-row">
                  <FaInfoCircle className="detail-icon status" />
                  <strong>Status:</strong> 
                  <span className={`status-badge status-${stats.status.toLowerCase()}`}>
                    {stats.status}
                  </span>
                </div>
              </div>
            </div>
            
            <hr className="modal-divider" />
            
            <h4 className="stats-title">
              <FaChartBar className="stats-title-icon" />
              Performance Stats
            </h4>
            
            <div className="stat-grid">
              <div className="stat-box">
                <FaTicketAlt className="stat-icon tickets" />
                <div className="stat-label">Total Tickets</div>
                <div className="stat-value">{stats.totalTickets}</div>
              </div>
              <div className="stat-box">
                <FaCheckCircle className="stat-icon sold" />
                <div className="stat-label">Sold</div>
                <div className="stat-value">{stats.ticketsSold}</div>
              </div>
              <div className="stat-box">
                <FaMoneyBillWave className="stat-icon revenue" />
                <div className="stat-label">Revenue</div>
                <div className="stat-value">Rs. {stats.revenue}</div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button onClick={downloadAsCSV} className="btn btn-primary">
                <FaDownload className="btn-icon" /> Download CSV
              </button>
              <button onClick={downloadAsJSON} className="btn btn-secondary">
                <FaDownload className="btn-icon" /> Download JSON
              </button>
              <button onClick={() => setSelected(null)} className="btn btn-close">
                <FaTimes className="btn-icon" /> Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default List;