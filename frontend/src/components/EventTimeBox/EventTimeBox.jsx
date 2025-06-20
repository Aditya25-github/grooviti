import React, { useEffect, useState } from "react";
import "./EventTimeBox.css";

const EventTimeBox = ({ event }) => {
  if (!event || !event.date) return null;

  const {
    name,
    date: startTime,
    endTime,
    venue,
    location,
    description,
  } = event;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) {
      console.warn("Invalid date:", dateStr);
      return "";
    }
    return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
  };

  const calculateTimeLeft = () => {
    const start = new Date(startTime);
    if (isNaN(start)) {
      console.warn("Invalid start time:", startTime);
      return null;
    }

    const difference = start - new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      if (!updated) {
        clearInterval(timer);
        setIsLive(true);
      }
      setTimeLeft(updated);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const googleCalendarUrl = () => {
    const params = new URLSearchParams({
      text: name,
      dates: `${formatDate(startTime)}/${formatDate(endTime || startTime)}`,
      details: description,
      location: venue || `${location?.address || ""}, ${location?.city || ""}`,
    });
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
  };
  const formatReadableDate = (dateStr) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const formatReadableTime = (dateStr) => {
    const options = { hour: "numeric", minute: "2-digit" };
    return new Date(dateStr).toLocaleTimeString(undefined, options);
  };

  const formattedDate = formatReadableDate(startTime);
  const formattedStartTime = formatReadableTime(startTime);
  const formattedEndTime = endTime ? formatReadableTime(endTime) : "";

  const now = new Date();
  let statusLabel = "Upcoming";
  let statusClass = "upcoming";
  if (new Date(startTime) <= now && new Date(endTime) > now) {
    statusLabel = "Live Now";
    statusClass = "live";
  } else if (new Date(endTime) <= now) {
    statusLabel = "Event Over";
    statusClass = "over";
  }

  return (
    <>
      <div className="event-status-row">
        <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
        <span className="event-time-text">
          📆 {formattedDate} · {formattedStartTime} – {formattedEndTime}
        </span>
      </div>
      <div className="event-time-box">
        <div className="countdown-wrapper">
          {isLive ? (
            <p className="countdown-live">✅ Event is Live!</p>
          ) : timeLeft ? (
            <div className="countdown-timer">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="time-unit">
                  <span className="time-value">
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="time-label">{unit}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="calendar-buttons">
          <button
            className="calendar-btn google"
            onClick={() => window.open(googleCalendarUrl(), "_blank")}
            data-tooltip="Google Calendar"
          >
            📅
          </button>
        </div>
      </div>
    </>
  );
};

export default EventTimeBox;
