import React, { useEffect, useState, useMemo } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
  FaTimes,
  FaUserAlt,
} from "react-icons/fa";
import { useContext } from "react";
import { StoreContext } from "../../../context/StoreContext"; // adjust path


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

const arrayToCsv = (rows) => {
  if (!rows || rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const header = keys.join(",");
  const body = rows
    .map((row) =>
      keys
        .map((k) => {
          const v = row[k] ?? "";
          const s = String(v).replace(/"/g, '""');
          return /[",\n]/.test(s) ? `"${s}"` : s;
        })
        .join(",")
    )
    .join("\n");
  return "\uFEFF" + header + "\n" + body;
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
  const [buyers, setBuyers] = useState([]);
  const [buyersLoading, setBuyersLoading] = useState(false);
  const [showBuyers, setShowBuyers] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [eventRevenue, setEventRevenue] = useState({});
  const navigate = useNavigate();
  const { token } = useContext(StoreContext);
  // const token = localStorage.getItem("eventHostToken");
  const listMyEvents = async () => {
    const email = localStorage.getItem("organizerEmail");
    if (!email) {
      toast.error("Organizer email not found.");
      return;
    }
    try {
      const response = await axios.get(
        `${url}/api/event/my-events?email=${email}`,
      );
      if (response.data.success) {
        setList(response.data.events);
        // Fetch actual revenue data from bookings
        fetchEventRevenue(email);
      }
      else toast.error("Error fetching your events");
    } catch {
      toast.error("Network error: Unable to fetch events");
    }
  };

  const fetchEventRevenue = async (email) => {
    try {
      const response = await axios.get(
        `${url}/api/booking/event-revenue?email=${email}`
      );
      if (response.data.success) {
        setEventRevenue(response.data.data || {});
      }
    } catch (err) {
      console.error("Error fetching event revenue:", err);
    }
  };

  const generateCertificate = async (eventId) => {
  try {
    const res = await axios.post(`${url}/api/organizer/generate`, {
      eventId,
    });

    if (res.data.success) {
      toast.success("Certificates sent successfully!");
    } else {
      toast.error("Failed to send certificates");
    }
  } catch (err) {
    toast.error(err.message);
  }
};


const RemoveEvent = async (eventId) => {
  try {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    const password = prompt("🔐 Enter your password to confirm deletion");
    if (!password) return;

    const response = await axios.post(
      `${url}/api/event/remove`,
      {
        id: eventId,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 NOW WORKS
        },
      }
    );

    if (response.data.success) {
      setSelected(null);
      await listMyEvents();
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }

  } catch {
    toast.error("Network error");
  }
};
  // Fetch buyers/attendance for selected event
  const loadPeopleData = async (eventId, isAttendance = false) => {
    setBuyersLoading(true);
    setBuyers([]);
    if (isAttendance) {
      setShowAttendance(true);
      setShowBuyers(false);
    } else {
      setShowBuyers(true);
      setShowAttendance(false);
    }
    try {
      const response = await axios.get(
        `${url}/api/booking/buyers?eventId=${eventId}`
      );
      if (response.data.success) {
        setBuyers(response.data.buyers);
        if (response.data.buyers.length === 0) {
          toast.info("No confirmed buyers for this event yet.");
        }
      } else {
        toast.error("Failed to fetch buyer details");
      }
    } catch {
      toast.error("Network error: Unable to fetch buyers");
    } finally {
      setBuyersLoading(false);
    }
  };

  // Download all buyers as CSV
  const downloadBuyersCSV = () => {
    if (!buyers.length) return toast.info("No buyers to download.");
    const csv = arrayToCsv(buyers);
    downloadFile({
      data: csv,
      fileName: `${selected?.name || "event"}-buyers.csv`,
      mimeType: "text/csv;charset=utf-8",
    });
  };

  // Download all buyers as JSON
  const downloadBuyersJSON = () => {
    if (!buyers.length) return toast.info("No buyers to download.");
    downloadFile({
      data: JSON.stringify(buyers, null, 2),
      fileName: `${selected?.name || "event"}-buyers.json`,
      mimeType: "application/json;charset=utf-8",
    });
  };

  const getAttendanceList = () => buyers.filter((b) => b.attendance);

  const downloadAttendanceCSV = () => {
    const list = getAttendanceList();
    if (!list.length) return toast.info("No attendees found.");
    const csv = arrayToCsv(list);
    downloadFile({
      data: csv,
      fileName: `${selected?.name || "event"}-attendance.csv`,
      mimeType: "text/csv;charset=utf-8",
    });
  };

  const downloadAttendanceJSON = () => {
    const list = getAttendanceList();
    if (!list.length) return toast.info("No attendees found.");
    downloadFile({
      data: JSON.stringify(list, null, 2),
      fileName: `${selected?.name || "event"}-attendance.json`,
      mimeType: "application/json;charset=utf-8",
    });
  };

  // Stats for selected event
  const stats = useMemo(() => {
    if (!selected) return null;
    const event = selected;
    
    // Get actual revenue from the booking data
    const actualRevenue = eventRevenue[event.name]?.totalRevenue || 0;
    
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
      revenue: parseFloat(actualRevenue.toFixed(2)), // Use actual paid amount
      organizerEmail: event?.organizerEmail ?? event?.hostEmail ?? "",
    };
  }, [selected, eventRevenue]);

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

  // Reset buyers when selected event changes
  useEffect(() => {
    setBuyers([]);
    setShowBuyers(false);
    setShowAttendance(false);
  }, [selected]);

  return (
    <div className="event-list-page">
      <div className="list-topbar">
        <div>
          <h1>Event Management</h1>
          <div className="list-desc">
            Manage all your events, bookings and participants
          </div>
        </div>
        <button className="create-btn" onClick={() => navigate("/event/add")}>
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
                  {formatVenue(ev.venue ?? ev.location)}
                </span>
                <span className="event-card-date">{ev.date} {ev.startTime || ev.eventTime || ev.time ? `at ${ev.startTime || ev.eventTime || ev.time}` : ""}</span>
              </div>
              <div className="event-card-meta">
                <span className="event-meta-item">
                  <FaUsers /> {ev.attendees || ev.ticketsSold || 0} attendees
                </span>
                <span className="event-meta-item">
                  <FaMoneyBillWave /> Rs.{parseFloat((eventRevenue[ev.name]?.totalRevenue || 0).toFixed(2))} revenue
                </span>
                {statusBadge(ev.status)}
              </div>
            </div>
            <div className="event-card-actions">
              <button
                className="icon-btn view"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(ev);
                }}
              >
                <FaEye />
              </button>
              <button
                className="icon-btn edit"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/event/edit/${ev._id}`);
                }}
              >
                <FaEdit />
              </button>
              <button
                className="icon-btn menu"
                onClick={(e) => e.stopPropagation()}
              >
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
                <b>Venue:</b> {formatVenue(selected.venue ?? selected.location)}
              </div>
              <div className="modal-row">
                <b>Date:</b> {selected.date}
              </div>
              <div className="modal-row">
                <b>Time:</b> {selected.startTime || selected.eventTime || selected.time || "Not specified"}
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
                <b>Revenue:</b> Rs.{" "}
                {parseFloat((eventRevenue[selected?.name]?.totalRevenue || 0).toFixed(2))}
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button" 
                className="icon-btn"
                onClick={() => generateCertificate(selected._id)}
              >
                 Generate Certificate
              </button>
              <button className="icon-btn" onClick={downloadAsCSV}>
                <FaDownload /> Stats CSV
              </button>
              <button className="icon-btn" onClick={downloadAsJSON}>
                <FaDownload /> Stats JSON
              </button>
              <button
                className="icon-btn delete"
                onClick={() => RemoveEvent(selected._id)}
              >
                <FaTrash /> Delete
              </button>
            </div>

            {/* Buyers & Attendance Section */}
            <div className="modal-section-title">Participants & Buyers</div>
            <div className="modal-actions">
               {/* Buyers Button Group */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  className="icon-btn"
                  onClick={() => loadPeopleData(selected._id, false)}
                  disabled={buyersLoading}
                >
                  <FaUserAlt />{" "}
                  {buyersLoading && showBuyers ? "Loading..." : "View Buyers"}
                </button>
              </div>

               {/* Attendance Button Group */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginTop: "10px" }}>
                <button
                  className="icon-btn"
                  onClick={() => loadPeopleData(selected._id, true)}
                  disabled={buyersLoading}
                >
                  <FaCheck />{" "}
                  {buyersLoading && showAttendance ? "Loading..." : "View Attendance"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buyers / Attendance Pop-up Modal */}
      {(showBuyers || showAttendance) && (
        <div
          className="event-modal-backdrop"
          style={{ zIndex: 1300 }}
          onClick={() => {
            setShowBuyers(false);
            setShowAttendance(false);
          }}
        >
          <div
            className="event-modal-card"
            style={{ maxWidth: "800px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                {showAttendance ? "Attendance List" : "Ticket Buyers"} -{" "}
                {selected?.name}
              </h2>
              <button
                className="icon-btn close"
                onClick={() => {
                  setShowBuyers(false);
                  setShowAttendance(false);
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-actions" style={{ marginBottom: "15px" }}>
              {showBuyers && buyers.length > 0 && (
                <>
                  <button className="icon-btn" onClick={downloadBuyersCSV}>
                    <FaDownload /> Export Buyers CSV
                  </button>
                  <button className="icon-btn" onClick={downloadBuyersJSON}>
                    <FaDownload /> Export Buyers JSON
                  </button>
                </>
              )}
              {showAttendance && getAttendanceList().length > 0 && (
                <>
                  <button className="icon-btn" onClick={downloadAttendanceCSV}>
                    <FaDownload /> Export Attendance CSV
                  </button>
                  <button className="icon-btn" onClick={downloadAttendanceJSON}>
                    <FaDownload /> Export Attendance JSON
                  </button>
                </>
              )}
            </div>

            <div className="buyers-table-wrapper">
              {buyersLoading ? (
                <div className="buyers-loading">Fetching data...</div>
              ) : (showAttendance ? getAttendanceList() : buyers).length ===
                0 ? (
                <div className="buyers-empty">
                  {showAttendance
                    ? "No attendance marked yet."
                    : "No confirmed buyers yet."}
                </div>
              ) : (
                <table className="buyers-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>College</th>
                      <th>Branch</th>
                      <th>Team Name</th>
                      <th>Team Leader</th>
                      <th>Team Size</th>
                      <th>Amount</th>
                      <th>Order ID</th>
                      <th>Date</th>
                      {showAttendance && <th>Attendance</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(showAttendance ? getAttendanceList() : buyers).map(
                      (buyer, index) => (
                        <tr key={buyer.orderId || index}>
                          <td>{index + 1}</td>
                          <td>
                            {buyer.firstName} {buyer.lastName}
                          </td>
                          <td>{buyer.email}</td>
                          <td>{buyer.phone}</td>
                          <td>{buyer.college_name}</td>
                          <td>{buyer.Branch}</td>
                          <td>{buyer.Team_name}</td>
                          <td>{buyer.Team_leader_name}</td>
                          <td>{buyer.Team_size}</td>
                          <td>Rs.{buyer.amount}</td>
                          <td>{buyer.orderId}</td>
                          <td>
                            {buyer.date
                              ? new Date(buyer.date).toLocaleDateString()
                              : ""}
                          </td>
                          {showAttendance && (
                            <td style={{ color: "green", fontWeight: "bold" }}>
                              Present
                            </td>
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
