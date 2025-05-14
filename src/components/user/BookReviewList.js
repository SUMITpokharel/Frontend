import React, { useState, useEffect } from "react";
import reviewService from "../../services/reviewService";

const BookReviewList = ({ reviews }) => (
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
  </div>
);

export default BookReviewList;
