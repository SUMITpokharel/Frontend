import React, { useState } from "react";
import reviewService from "../../services/reviewService";

const BookReviewForm = ({ bookId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await reviewService.create({ bookId, rating, comment });
      setSuccess("Review submitted!");
      setComment("");
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Could not submit review."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-review-form">
      <h4>Leave a Review</h4>
      <label>
        Rating:
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit Review</button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  );
};

export default BookReviewForm;
