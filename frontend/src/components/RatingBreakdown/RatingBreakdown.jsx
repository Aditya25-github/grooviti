import React from "react";
import "./RatingBreakdown.css";

const RatingBreakdown = ({ reviews }) => {
  const total = reviews.length;

  const getCounts = () => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating - 1]++;
      }
    });
    return counts.reverse(); // 5-star first
  };

  const counts = getCounts();

  return (
    <div className="rating-breakdown">
      <h3>Rating Breakdown</h3>
      {counts.map((count, i) => {
        const star = 5 - i;
        const percent = total ? Math.round((count / total) * 100) : 0;
        return (
          <div className="rating-row" key={star}>
            <span className="rating-label">⭐ {star}</span>
            <div className="rating-bar">
              <div
                className="rating-fill"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <span className="rating-percent">{percent}%</span>
          </div>
        );
      })}
    </div>
  );
};

export default RatingBreakdown;
