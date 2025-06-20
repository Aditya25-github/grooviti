import React from "react";
import StarRating from "../StarRating/StarRating";
import "./ReviewCard.css";

const ReviewCard = ({ review, isOwner, onEdit, onDelete }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <strong>{review.userName}</strong>
        <StarRating rating={review.rating} />
      </div>
      <p className="review-comment">{review.comment}</p>
      <small className="review-date">
        {new Date(review.createdAt).toLocaleString()}
      </small>
      {isOwner && (
        <div className="review-actions">
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
