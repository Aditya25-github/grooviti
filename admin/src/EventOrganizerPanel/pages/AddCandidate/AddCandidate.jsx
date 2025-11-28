import React, { useState } from "react";
import axios from "axios";
import {
  FaUserPlus,
  FaGhost,
  FaUpload,
  FaCheckCircle,
  FaSpinner,
  FaUserAlt,
} from "react-icons/fa";
import "./AddCandidate.css";

const FresherForm = ({ url }) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    department: "",
    category: "",
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData((prev) => ({ ...prev, photo: files?.[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, gender, department, category, photo } = formData;
    if (!name || !gender || !department || !category || !photo) {
      return alert("All fields are required.");
    }
    try {
      setLoading(true);
      setSuccess(false);
      const data = new FormData();
      data.append("name", name);
      data.append("gender", gender);
      data.append("department", department);
      data.append("category", category);
      data.append("photo", photo);

      await axios.post(`${url}/api/pccoer/fresher-party/candidates`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setFormData({
        name: "",
        gender: "",
        department: "",
        category: "",
        photo: null,
      });
      e.target.reset();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add candidate.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 2200);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <div className="form-section">
        <label>
          <FaUserAlt /> Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Candidate Name"
          onChange={handleChange}
          required
          autoComplete="off"
        />
      </div>
      <div className="form-section">
        <label>Gender</label>
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Mr Fresher</option>
          <option value="female">Ms Fresher</option>
        </select>
      </div>
      <div className="form-section">
        <label>Department</label>
        <input
          type="text"
          name="department"
          placeholder="Dept (e.g., Computer, ENTC)"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-section">
        <label>Category</label>
        <select name="category" onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
        </select>
      </div>
      <div className="form-section">
        <label>
          <FaUpload /> Photo
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" disabled={loading} className="form-submit-btn">
        {loading ? (
          <>
            <FaSpinner className="spin" /> Submitting...
          </>
        ) : success ? (
          <>
            <FaCheckCircle /> Added!
          </>
        ) : (
          "Add Fresher Candidate"
        )}
      </button>
    </form>
  );
};

const HalloweenForm = ({ url }) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    department: "",
    category: "",
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData((prev) => ({ ...prev, photo: files?.[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, gender, department, category, photo } = formData;
    if (!name || !gender || !department || !category || !photo) {
      return alert("All fields are required.");
    }
    try {
      setLoading(true);
      setSuccess(false);
      const data = new FormData();
      data.append("name", name);
      data.append("gender", gender);
      data.append("department", department);
      data.append("category", category);
      data.append("photo", photo);

      await axios.post(`${url}/api/pccoer/halloween/candidates`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setFormData({
        name: "",
        gender: "",
        department: "",
        category: "",
        photo: null,
      });
      e.target.reset();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add candidate.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 2200);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <div className="form-section">
        <label>
          <FaUserAlt /> Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Candidate Name"
          onChange={handleChange}
          required
          autoComplete="off"
        />
      </div>
      <div className="form-section">
        <label>Gender</label>
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other / Team</option>
        </select>
      </div>
      <div className="form-section">
        <label>Department</label>
        <input
          type="text"
          name="department"
          placeholder="Dept (e.g., Computer, ENTC)"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-section">
        <label>Category</label>
        <select name="category" onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="bestDressed">🏆 Best Dressed</option>
          <option value="famousCharacter">🌟 Most Famous Character</option>
          <option value="bestDuo">🤝 Best Duo</option>
        </select>
      </div>
      <div className="form-section">
        <label>
          <FaUpload /> Photo
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" disabled={loading} className="form-submit-btn">
        {loading ? (
          <>
            <FaSpinner className="spin" /> Submitting...
          </>
        ) : success ? (
          <>
            <FaCheckCircle /> Added!
          </>
        ) : (
          "Add Halloween Candidate"
        )}
      </button>
    </form>
  );
};

const AddCandidates = ({ url }) => {
  const [openCard, setOpenCard] = useState("fresher");
  return (
    <div className="candidate-page">
      <div className="toggle-nav">
        <button
          className={`toggle-btn ${openCard === "fresher" ? "active" : ""}`}
          onClick={() => setOpenCard("fresher")}
        >
          <FaUserPlus className="nav-icon" /> Fresher Candidates
        </button>
        <button
          className={`toggle-btn ${openCard === "halloween" ? "active" : ""}`}
          onClick={() => setOpenCard("halloween")}
        >
          <FaGhost className="nav-icon" /> Halloween Candidates
        </button>
      </div>
      <div className="card-container">
        {openCard === "fresher" ? (
          <>
            <h2 className="card-title">Add Fresher Candidate</h2>
            <FresherForm url={url} />
          </>
        ) : (
          <>
            <h2 className="card-title">Add Halloween Candidate</h2>
            <HalloweenForm url={url} />
          </>
        )}
      </div>
    </div>
  );
};

export default AddCandidates;
