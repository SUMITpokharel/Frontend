import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import bookService from "../../services/bookService";
import discountService from "../../services/discountService";
import { Star } from "lucide-react"; // Or use your own star icon
import "./BookDetail.css"; // Create this for custom styles
import { useBookmarks } from "../../context/BookmarkContext";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      bookService.fetchBookDetailsById(id),
      discountService.getActiveDiscounts(),
    ])
      .then(([bookData, discountsData]) => {
        setBook(bookData);
        // Find discount for this book
        const foundDiscount = discountsData.find(
          (d) => d.bookId === bookData.bookId
        );
        setDiscount(foundDiscount || null);
        setLoading(false);
      })
      .catch(() => {
        setBook(null);
        setDiscount(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>Book Not Found</div>;

  const isDiscounted = discount && discount.percentage > 0;
  const discountedPrice = isDiscounted
    ? (book.price - book.price * (discount.percentage / 100)).toFixed(2)
    : book.price;
  const isOnSale = discount && discount.onSale;
  const isInStock = book.stock > 0;
  const bookId = book.BookId || book.bookId;

  return (
    <div className="book-detail-container">
      <div className="book-detail-grid">
        {/* Book Cover */}
        <div className="book-detail-cover">
          {isOnSale && <span className="book-sale-tag">On Sale</span>}
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
                <span className="price-discount">${discountedPrice}</span>
                <span className="price-original">${book.price.toFixed(2)}</span>
                <span className="discount-percentage">
                  ({discount.percentage}% OFF)
                </span>
                {isOnSale && <span className="book-sale-tag">SALE</span>}
              </>
            ) : (
              <span className="price-normal">${book.price.toFixed(2)}</span>
            )}
          </div>
          {isDiscounted && discount.startDate && discount.endDate && (
            <div className="discount-period">
              Discount valid:{" "}
              {new Date(discount.startDate).toLocaleDateString()} -{" "}
              {new Date(discount.endDate).toLocaleDateString()}
            </div>
          )}
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
