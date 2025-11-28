import React, { useEffect, useState, useMemo } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaEye,
  FaEdit,
  FaEllipsisH,
  FaPlus,
  FaDownload,
  FaTrash,
  FaCheck,
  FaExclamationCircle,
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

const formatVenue = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    return [value.address, value.city, value.state, value.country]
      .filter(Boolean)
      .join(", ");
  }
  return String(value);
};

const statusBadge = (status) => {
  if (status === "Active")
    return (
      <span className="badge status-active">
        <FaCheck /> Active
      </span>
    );
  if (status === "Completed")
    return (
      <span className="badge status-completed">
        <FaCheck /> Completed
      </span>
    );
  if (status === "Upcoming")
    return (
      <span className="badge status-upcoming">
        <FaExclamationCircle /> Upcoming
      </span>
    );
  if (status === "Draft")
    return <span className="badge status-draft">Draft</span>;
  return <span className="badge status-other">{status}</span>;
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
      const response = await axios.get(
        `${url}/api/event/my-events?email=${email}`
      );
      if (response.data.success) setList(response.data.events);
      else toast.error("Error fetching your events");
    } catch {
      toast.error("Network error: Unable to fetch events");
    }
  };

  const RemoveEvent = async (eventId) => {
    try {
      const response = await axios.post(`${url}/api/event/remove`, {
        id: eventId,
      });
      if (response.data.success) {
        await listMyEvents();
        toast.success(response.data.message);
      } else toast.error("Error deleting event");
    } catch {
      toast.error("Network error: Unable to delete event");
    }
  };

  // Stats for selected event
  const stats = useMemo(() => {
    if (!selected) return null;
    const event = selected;
    return {
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
    };
  }, [selected]);

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
    <div className="event-list-page">
      <div className="list-topbar">
        <div>
          <h1>Event Management</h1>
          <div className="list-desc">
            Manage all your events, bookings and participants
          </div>
        </div>
        <button className="create-btn">
          <FaPlus /> Create Event
        </button>
      </div>
      <div className="list-filters">
        <input className="filter-input" placeholder="Search events..." />
        <select className="filter-select">
          <option>All Status</option>
        </select>
        <select className="filter-select">
          <option>All Categories</option>
        </select>
        <button className="filter-actions">
          <FaDownload /> Export
        </button>
      </div>
      <div className="event-card-list">
        <div className="event-card-list-title">All Events ({list.length})</div>
        {list.map((ev) => (
          <div
            className="event-card"
            key={ev._id}
            onClick={() => setSelected(ev)}
          >
            <div
              className="event-icon-bg"
              style={{
                background:
                  ev.category === "Music Festival"
                    ? "linear-gradient(135deg,#7f61e9 0%,#ea70ea 100%)"
                    : ev.category === "Tech Conference"
                    ? "linear-gradient(135deg,#e3598c 0%,#9fd6ff 100%)"
                    : ev.category === "Art Exhibition"
                    ? "linear-gradient(135deg,#ee4a39 0%,#fdc980 100%)"
                    : "linear-gradient(135deg,#47b873 0%,#a7e6d3 100%)",
              }}
            >
              {ev.category === "Music Festival" && <FaCalendarAlt />}
              {ev.category === "Tech Conference" && <FaUsers />}
              {ev.category === "Art Exhibition" && <FaMoneyBillWave />}
              {![
                "Music Festival",
                "Tech Conference",
                "Art Exhibition",
              ].includes(ev.category) && <FaCalendarAlt />}
            </div>
            <div className="event-card-body">
              <div className="event-card-main">
                <b className="event-card-title">{ev.name}</b>
                <span className="event-card-location">
                  {formatVenue(ev.venue)}
                </span>
                <span className="event-card-date">{ev.date}</span>
              </div>
              <div className="event-card-meta">
                <span className="event-meta-item">
                  <FaUsers /> {ev.attendees || ev.ticketsSold || 0} attendees
                </span>
                <span className="event-meta-item">
                  <FaMoneyBillWave /> Rs.{ev.revenue || 0} revenue
                </span>
                {statusBadge(ev.status)}
              </div>
            </div>
            <div className="event-card-actions">
              <button className="icon-btn view">
                <FaEye />
              </button>
              <button className="icon-btn edit">
                <FaEdit />
              </button>
              <button className="icon-btn menu">
                <FaEllipsisH />
              </button>
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div
          className="event-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="event-modal-card">
            <div className="modal-header">
              <h2>{selected.name}</h2>
              <button
                className="icon-btn close"
                onClick={() => setSelected(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <b>Category:</b> {selected.category}
              </div>
              <div className="modal-row">
                <b>Venue:</b> {formatVenue(selected.venue)}
              </div>
              <div className="modal-row">
                <b>Date:</b> {selected.date}
              </div>
              <div className="modal-row">
                <b>Status:</b> {statusBadge(selected.status)}
              </div>
              <div className="modal-row">
                <b>Total Tickets:</b> {selected.totalTickets}
              </div>
              <div className="modal-row">
                <b>Tickets Sold:</b> {selected.ticketsSold}
              </div>
              <div className="modal-row">
                <b>Revenue:</b> Rs. {selected.revenue}
              </div>
            </div>
            <div className="modal-actions">
              <button className="icon-btn" onClick={downloadAsCSV}>
                <FaDownload /> CSV
              </button>
              <button className="icon-btn" onClick={downloadAsJSON}>
                <FaDownload /> JSON
              </button>
              <button
                className="icon-btn delete"
                onClick={() => RemoveEvent(selected._id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
