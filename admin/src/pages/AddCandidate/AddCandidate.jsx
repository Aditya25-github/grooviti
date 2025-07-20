import React, { useState } from "react";
import axios from "axios";
import "./AddCandidate.css";

const AddCandidate = ({ url }) => {
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
      setFormData((prev) => ({ ...prev, photo: files[0] }));
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
      data.append("category", category);
      data.append("photo", photo);

      const res = await axios.post(`${url}/api/pccoer/candidates`, data);
      alert("Candidate added successfully!");
      setFormData({
        name: "",
        gender: "",
        department: "",
        category: "",
        photo: null,
      });
    } catch (err) {
      console.error("Error adding candidate:", err);
      alert("Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-candidate-container">
      <h2>Add Fresher Candidate</h2>
      <form onSubmit={handleSubmit} className="add-candidate-form">
        <input
          type="text"
          name="name"
          placeholder="Candidate Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Mr Fresher</option>
          <option value="female">Miss Fresher</option>
        </select>

        <input
          type="text"
          name="department"
          placeholder="Department (e.g., Computer, ENTC)"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
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
          {loading ? "Submitting..." : "Add Candidate"}
        </button>
      </form>
    </div>
  );
};

export default AddCandidate;
