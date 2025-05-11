import React from "react";
import { Link } from "react-router-dom";

export default function BookGrid({ books = [], loading, className = "" }) {
  if (loading) return <div>Loading...</div>;
  if (!books.length) return <div>No books found.</div>;

  return (
    <div className={`book-grid ${className}`}>
      {books.map((book) => (
        <Link
          to={`/user/book/${book.BookId || book.bookId}`}
          key={book.BookId || book.bookId}
          className="book-card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.BookName || "No Image"}
              style={{
                width: "120px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
                background: "#dde3ea",
                marginBottom: "0.5rem",
              }}
            />
          ) : (
            <div className="book-img-placeholder"></div>
          )}
          <div>
            <strong>Title:</strong> {book.BookName || book.bookName}
          </div>
          <div>
            <strong>Publisher:</strong> {book.publisherName || "Unknown Author"}
          </div>
          <div>
            <strong>Price:</strong> ${book.price}
          </div>
          <button>Add to Cart</button>
        </Link>
      ))}
    </div>
  );
}
