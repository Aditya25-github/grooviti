import React, { useState } from "react";
import axios from "axios";
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
      alert("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", name);
      data.append("gender", gender);
      data.append("department", department);
      data.append("category", category); // "Mr" | "Mrs"
      data.append("photo", photo);

      await axios.post(`${url}/api/pccoer/fresher-party/candidates`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Fresher candidate added successfully!");
      setFormData({
        name: "",
        gender: "",
        department: "",
        category: "",
        photo: null,
      });
      e.target.reset();
    } catch (err) {
      console.error("Error adding fresher candidate:", err);
      alert(err.response?.data?.message || "Failed to add fresher candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-candidate-form">
      <input
        type="text"
        name="name"
        placeholder="Candidate Name"
        onChange={handleChange}
        required
      />

      <select name="gender" onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="male">Mr Fresher</option>
        <option value="female">Ms Fresher</option>
      </select>

      <input
        type="text"
        name="department"
        placeholder="Department (e.g., Computer, ENTC)"
        onChange={handleChange}
        required
      />

      <select name="category" onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="Mr">Mr</option>
        <option value="Mrs">Mrs</option>
      </select>

      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Add Fresher Candidate"}
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
    const formEl = e.currentTarget;
    const { name, gender, department, category, photo } = formData;
    if (!name || !gender || !department || !category || !photo) {
      alert("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", name);
      data.append("gender", gender);
      data.append("department", department);
      data.append("category", category); // "bestDressed" | "famousCharacter" | "bestDuo"
      data.append("photo", photo);

      await axios.post(`${url}/api/pccoer/halloween/candidates`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      formEl.reset();

      alert("Halloween candidate added successfully!");
      setFormData({
        name: "",
        gender: "",
        department: "",
        category: "",
        photo: null,
      });
    } catch (err) {
      console.error("Error adding halloween candidate:", err);
      alert(err.response?.data?.message || "Failed to add halloween candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-candidate-form">
      <input
        type="text"
        name="name"
        placeholder="Candidate Name"
        onChange={handleChange}
        required
      />

      <select name="gender" onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other / Team</option>
      </select>

      <input
        type="text"
        name="department"
        placeholder="Department (e.g., Computer, ENTC)"
        onChange={handleChange}
        required
      />

      <select name="category" onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="bestDressed">🏆 Best Dressed</option>
        <option value="famousCharacter">🌟 Most Famous Character</option>
        <option value="bestDuo">🤝 Best Duo</option>
      </select>

      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Add Halloween Candidate"}
      </button>
    </form>
  );
};

const AddCandidates = ({ url }) => {
  const [openCard, setOpenCard] = useState("fresher"); // "fresher" | "halloween"

  return (
    <div className="add-candidate-container">
      <div className="cards-toggle">
        <button
          className={`toggle-btn ${openCard === "fresher" ? "active" : ""}`}
          onClick={() => setOpenCard("fresher")}
        >
          Fresher Candidates
        </button>
        <button
          className={`toggle-btn ${openCard === "halloween" ? "active" : ""}`}
          onClick={() => setOpenCard("halloween")}
        >
          Halloween Candidates
        </button>
      </div>

      {openCard === "fresher" ? (
        <>
          <h2>Add Fresher Candidate</h2>
          <FresherForm url={url} />
        </>
      ) : (
        <>
          <h2>Add Halloween Candidate</h2>
          <HalloweenForm url={url} />
        </>
      )}
    </div>
  );
};

export default AddCandidates;
