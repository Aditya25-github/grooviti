// components/SearchBar/SearchBar.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./SearchBar.css";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { myevents_list } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 0) {
      const filtered = myevents_list.filter((event) =>
        event.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // limit to 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (name) => {
    setInput(name);
    setSuggestions([]);
    navigate(`/search?query=${encodeURIComponent(name)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/search?query=${encodeURIComponent(input)}`);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Search events..."
          autoComplete="off"
        />
      </form>
      {suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((event) => (
            <li key={event._id} onClick={() => handleSelect(event.name)}>
              {event.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
