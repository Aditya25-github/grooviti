// src/components/ReviewForm/ReviewForm.jsx
import React from "react";
import StarRating from "../StarRating/StarRating";
import "./ReviewForm.css";

const ReviewForm = ({
  reviewText,
  setReviewText,
  rating,
  setRating,
  isEditing,
  onSubmit,
  onCancel,
}) => {
  return (
    <form className="review-form" onSubmit={onSubmit}>
      <textarea
        required
        placeholder="Write your review here..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      ></textarea>
      <StarRating rating={rating} setRating={setRating} editable />
      <button type="submit">
        {isEditing ? "Update Review" : "Submit Review"}
      </button>
      {isEditing && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default ReviewForm;
