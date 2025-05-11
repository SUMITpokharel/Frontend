import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import bookService from "../../services/bookService";
import { Star } from "lucide-react"; // Or use your own star icon
import "./BookDetail.css"; // Create this for custom styles
import { useBookmarks } from "../../context/BookmarkContext";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    setLoading(true);
    bookService
      .fetchBookDetailsById(id)
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch(() => {
        setBook(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>Book Not Found</div>;

  const isDiscounted =
    book.discountedPrice && book.discountedPrice < book.price;
  const isInStock = book.stock > 0;
  const bookId = book.BookId || book.bookId;

  return (
    <div className="book-detail-container">
      <div className="book-detail-grid">
        {/* Book Cover */}
        <div className="book-detail-cover">
          {book.onSale && <span className="book-sale-tag">On Sale</span>}
          {isDiscounted && book.discountPercent && (
            <span className="book-discount-tag">-{book.discountPercent}%</span>
          )}
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.BookName || "No Image"}
              style={{
                width: "200px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "12px",
                background: "#dde3ea",
              }}
            />
          ) : (
            <div className="book-img-placeholder"></div>
          )}
        </div>
        {/* Book Info */}
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <h2>Title: {book.BookName || book.bookName}</h2>
          <div className="book-detail-rating">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={
                  i <= Math.round(book.rating) ? "star-filled" : "star-empty"
                }
              />
            ))}
            <span>({book.reviewCount} reviews)</span>
          </div>
          <div className="book-detail-price">
            {isDiscounted ? (
              <>
                <span className="price-discount">
                  ${book.discountedPrice.toFixed(2)}
                </span>
                <span className="price-original">${book.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="price-normal">${book.price.toFixed(2)}</span>
            )}
          </div>
          <div className="book-detail-stock">
            {isInStock ? (
              <span>
                In Stock {book.stock < 10 && `(Only ${book.stock} left)`}
              </span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          <p className="book-detail-description">{book.description}</p>
          {/* Add to Cart */}
          <div className="book-detail-actions">
            <button disabled={!isInStock}>Add to Cart</button>
            <button
              onClick={() => {
                if (isBookmarked(bookId)) {
                  removeBookmark(bookId);
                } else {
                  addBookmark(bookId);
                }
              }}
            >
              {isBookmarked(bookId) ? "Bookmarked" : "Bookmark"}
            </button>
          </div>
          {/* Book Metadata */}
          <div className="book-detail-meta">
            <div>
              <b>Publisher:</b> {book.publisherName}
            </div>
            <div>
              <b>ISBN:</b> {book.isbn}
            </div>
            <div>
              <b>Language:</b> {book.language}
            </div>
            <div>
              <b>Genre:</b>{" "}
              {book.Genres && Array.isArray(book.Genres)
                ? book.Genres.join(", ")
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
