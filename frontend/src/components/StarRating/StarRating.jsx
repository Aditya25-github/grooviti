// StarRating.jsx
import React from "react";
import "./StarRating.css"; // Optional: for custom styles

const StarRating = ({ rating, setRating, editable = false }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: editable ? "pointer" : "default",
            color: star <= rating ? "#ffc107" : "#e4e5e9",
            fontSize: "24px",
          }}
          onClick={() => editable && setRating(star)}
          role={editable ? "button" : undefined}
          aria-label={`${star} Star`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
