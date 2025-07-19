import React, { useState } from "react";
import {
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiHome,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import "./ManageEvent.css";

const ManageEvent = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [eventSettings, setEventSettings] = useState({
    eventName: "Fresher Party 2025",
    eventDate: "2025-08-15",
    eventTime: "18:00",
    venue: "College Auditorium",
    isVotingEnabled: false,
    votingStartTime: "19:00",
    votingEndTime: "21:00",
  });

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "John Doe",
      category: "Mr. Fresher",
      votes: 45,
      photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      category: "Ms. Fresher",
      votes: 38,
      photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Alex Johnson",
      category: "Mr. Fresher",
      votes: 28,
      photoUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      id: 4,
      name: "Sarah Williams",
      category: "Ms. Fresher",
      votes: 42,
      photoUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    },
  ]);

  const [liveStats, setLiveStats] = useState({
    totalVotes: 153,
    activeVoters: 24,
    registeredStudents: 250,
  });

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleVoting = () => {
    setEventSettings((prev) => ({
      ...prev,
      isVotingEnabled: !prev.isVotingEnabled,
    }));
  };

  const resetVotes = () => {
    if (window.confirm("Are you sure you want to reset all votes?")) {
      setCandidates((prev) => prev.map((c) => ({ ...c, votes: 0 })));
      setLiveStats((prev) => ({ ...prev, totalVotes: 0 }));
    }
  };

  const addCandidate = () => {
    const newId =
      candidates.length > 0 ? Math.max(...candidates.map((c) => c.id)) + 1 : 1;
    setCandidates([
      ...candidates,
      {
        id: newId,
        name: `New Candidate ${newId}`,
        category: "Mr. Fresher",
        votes: 0,
        photoUrl: "/placeholder.jpg",
      },
    ]);
  };

  const deleteCandidate = (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      setCandidates(candidates.filter((c) => c.id !== id));
    }
  };

  const renderOverview = () => (
    <div className="tab-content">
      <div className="overview-cards">
        <div className="stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <h3>Total Votes</h3>
            <div className="stat-number">{liveStats.totalVotes}</div>
            <div className="stat-change">+12 today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Active Voters</h3>
            <div className="stat-number">{liveStats.activeVoters}</div>
            <div className="stat-change">+5 today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Registered Students</h3>
            <div className="stat-number">{liveStats.registeredStudents}</div>
            <div className="stat-change">+8 today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎭</div>
          <div className="stat-content">
            <h3>Candidates</h3>
            <div className="stat-number">{candidates.length}</div>
            <div className="stat-change">2 categories</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button
            className={`action-btn ${
              eventSettings.isVotingEnabled ? "danger" : "success"
            }`}
            onClick={toggleVoting}
          >
            {eventSettings.isVotingEnabled ? "Stop Voting" : "Start Voting"}
          </button>
          <button className="action-btn warning" onClick={resetVotes}>
            Reset All Votes
          </button>
          <button
            className="action-btn primary"
            onClick={() => setActiveTab("candidates")}
          >
            Manage Candidates
          </button>
        </div>
      </div>
    </div>
  );

  const renderEventSettings = () => (
    <div className="tab-content">
      <div className="settings-form">
        <div className="form-section">
          <h3 className="section-title">
            <FiSettings className="icon" />
            Event Details
          </h3>
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="eventName"
              value={eventSettings.eventName}
              onChange={handleSettingsChange}
              placeholder="Enter event name"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Event Date</label>
              <input
                type="date"
                name="eventDate"
                value={eventSettings.eventDate}
                onChange={handleSettingsChange}
              />
            </div>
            <div className="form-group">
              <label>Event Time</label>
              <input
                type="time"
                name="eventTime"
                value={eventSettings.eventTime}
                onChange={handleSettingsChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input
              type="text"
              name="venue"
              value={eventSettings.venue}
              onChange={handleSettingsChange}
              placeholder="Enter venue"
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">
            <FiBarChart2 className="icon" />
            Voting Settings
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label>Voting Start Time</label>
              <input
                type="time"
                name="votingStartTime"
                value={eventSettings.votingStartTime}
                onChange={handleSettingsChange}
              />
            </div>
            <div className="form-group">
              <label>Voting End Time</label>
              <input
                type="time"
                name="votingEndTime"
                value={eventSettings.votingEndTime}
                onChange={handleSettingsChange}
              />
            </div>
          </div>
        </div>

        <button className="save-btn">Save Settings</button>
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="tab-content">
      <div className="candidates-header">
        <h3>
          <FiUsers className="icon" />
          Manage Candidates
        </h3>
        <button className="add-candidate-btn" onClick={addCandidate}>
          <FiPlus /> Add New Candidate
        </button>
      </div>

      <div className="candidates-grid">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="candidate-card">
            <div className="candidate-photo-container">
              <img
                src={candidate.photoUrl}
                alt={candidate.name}
                className="candidate-photo"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />
              <div
                className={`category-badge ${
                  candidate.category === "Mr. Fresher" ? "mr" : "ms"
                }`}
              >
                {candidate.category}
              </div>
            </div>
            <div className="candidate-info">
              <h4>{candidate.name}</h4>
              <div className="vote-count">
                <span className="vote-number">{candidate.votes}</span> votes
              </div>
            </div>
            <div className="candidate-actions">
              <button className="edit-btn">
                <FiEdit2 /> Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteCandidate(candidate.id)}
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLiveResults = () => (
    <div className="tab-content">
      <div className="results-header">
        <h3>
          <FiBarChart2 className="icon" />
          Live Voting Results
        </h3>
        <div className="refresh-indicator">
          <span className="live-dot"></span>
          Live Updates
        </div>
      </div>

      <div className="results-categories">
        <div className="category-section">
          <h4>Mr. Fresher</h4>
          <div className="results-list">
            {candidates
              .filter((c) => c.category === "Mr. Fresher")
              .sort((a, b) => b.votes - a.votes)
              .map((candidate) => (
                <div key={candidate.id} className="result-item">
                  <div className="result-photo-container">
                    <img
                      src={candidate.photoUrl}
                      alt={candidate.name}
                      className="result-photo"
                    />
                    <div className="result-rank">
                      #
                      {candidates
                        .filter((c) => c.category === "Mr. Fresher")
                        .indexOf(candidate) + 1}
                    </div>
                  </div>
                  <div className="result-info">
                    <span className="result-name">{candidate.name}</span>
                    <div className="vote-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              liveStats.totalVotes > 0
                                ? (candidate.votes / liveStats.totalVotes) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="vote-text">
                        {candidate.votes} votes (
                        {liveStats.totalVotes > 0
                          ? Math.round(
                              (candidate.votes / liveStats.totalVotes) * 100
                            )
                          : 0}
                        %)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="category-section">
          <h4>Ms. Fresher</h4>
          <div className="results-list">
            {candidates
              .filter((c) => c.category === "Ms. Fresher")
              .sort((a, b) => b.votes - a.votes)
              .map((candidate) => (
                <div key={candidate.id} className="result-item">
                  <div className="result-photo-container">
                    <img
                      src={candidate.photoUrl}
                      alt={candidate.name}
                      className="result-photo"
                    />
                    <div className="result-rank">
                      #
                      {candidates
                        .filter((c) => c.category === "Ms. Fresher")
                        .indexOf(candidate) + 1}
                    </div>
                  </div>
                  <div className="result-info">
                    <span className="result-name">{candidate.name}</span>
                    <div className="vote-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              liveStats.totalVotes > 0
                                ? (candidate.votes / liveStats.totalVotes) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="vote-text">
                        {candidate.votes} votes (
                        {liveStats.totalVotes > 0
                          ? Math.round(
                              (candidate.votes / liveStats.totalVotes) * 100
                            )
                          : 0}
                        %)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="event-management">
      <div className="page-header">
        <h1>Event Management - {eventSettings.eventName}</h1>
        <div className="event-status">
          <span
            className={`status-badge ${
              eventSettings.isVotingEnabled ? "active" : "inactive"
            }`}
          >
            {eventSettings.isVotingEnabled
              ? "Voting Active"
              : "Voting Inactive"}
          </span>
          <span className="event-date">
            {new Date(eventSettings.eventDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <FiHome className="icon" />
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <FiSettings className="icon" />
          Event Settings
        </button>
        <button
          className={`tab-btn ${activeTab === "candidates" ? "active" : ""}`}
          onClick={() => setActiveTab("candidates")}
        >
          <FiUsers className="icon" />
          Candidates
        </button>
        <button
          className={`tab-btn ${activeTab === "results" ? "active" : ""}`}
          onClick={() => setActiveTab("results")}
        >
          <FiBarChart2 className="icon" />
          Live Results
        </button>
      </div>

      <div className="tab-content-container">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "settings" && renderEventSettings()}
        {activeTab === "candidates" && renderCandidates()}
        {activeTab === "results" && renderLiveResults()}
      </div>
    </div>
  );
};

export default ManageEvent;
