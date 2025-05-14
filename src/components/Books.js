import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Books.css";

const Books = ({ type: propType }) => {
  const params = useParams();
  const type = propType || params.type;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      let url = "https://localhost:7256/api/Book";
      if (type === "new-releases") {
        url += "/filtered-books?SortByPriceDescending=false";
      }
      const response = await axios.get(url);

      if (type === "coming-soon") {
        const filteredBooks = response.data.data.filter(
          (book) => book.isComingSoon
        );
        setBooks(filteredBooks);
      } else if (type === "deals") {
        const discountsResponse = await axios.get(
          "https://localhost:7256/api/admin/discounts/active"
        );
        const discountBooks = discountsResponse.data.data;
        const allBooks = response.data.data;
        const discountedBooks = allBooks.filter((book) =>
          discountBooks.some((discount) => discount.bookId === book.bookId)
        );
        setBooks(discountedBooks);
      } else {
        setBooks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to fetch books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [type]);

  if (loading) {
    return (
      <div className="books-container">
        <h1>Loading books...</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="books-container">
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={fetchBooks} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="books-container">
        <h1>No books found</h1>
        <p>There are currently no books available in this category.</p>
      </div>
    );
  }

  return (
    <div className="books-container">
      <h1>
        {type
          ? type === "new-releases"
            ? "New Arrivals"
            : type === "coming-soon"
            ? "Coming Soon"
            : type === "deals"
            ? "Deals"
            : type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")
          : "All Books"}
      </h1>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.bookId} className="book-card">
            <div className="book-image">
              <img src="/default-book.jpg" alt={book.bookName} />
            </div>
            <div className="book-info">
              <h3>{book.bookName}</h3>
              <p className="book-language">Language: {book.language}</p>
              <p className="book-price">Price: ${book.price}</p>
              <p className="book-stock">Stock: {book.stock}</p>
              <p className="book-publisher">Publisher: {book.publisherName}</p>
              <p className="book-description">
                {book.description.substring(0, 100)}...
              </p>
            </div>
            <div className="book-actions">
              <button
                onClick={() => navigate(`/book/${book.bookId}`)}
                className="view-details-btn"
              >
                View Details
              </button>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
