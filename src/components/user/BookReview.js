import React, { useState, useEffect } from "react";
import reviewService from "../../services/reviewService";

const BookReview = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    reviewService.getAll().then((data) => {
      // If data is wrapped in a .data property, adjust accordingly
      const reviewList = Array.isArray(data) ? data : data.data || [];
      setReviews(reviewList.filter((r) => r.bookId === bookId));
    });
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await reviewService.create({ bookId, rating, comment });
      setSuccess("Review submitted!");
      setComment("");
      // Refresh reviews
      reviewService.getAll().then((data) => {
        const reviewList = Array.isArray(data) ? data : data.data || [];
        setReviews(reviewList.filter((r) => r.bookId === bookId));
      });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Could not submit review."
      );
    }
  };

  return (
    <div>
      <h3>Reviews</h3>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      <ul>
        {reviews.map((r) => (
          <li key={r.reviewId}>
            <strong>Rating:</strong> {r.rating} <br />
            <strong>Comment:</strong> {r.comment}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
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
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
      </form>
    </div>
  );
};

export default BookReview;
