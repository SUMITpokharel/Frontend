import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./User.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./UserNavbar";
import { useBookmarks } from "../../context/BookmarkContext";
import bookService from "../../services/bookService";
import cartService from "../../services/cartService";
import discountService from "../../services/discountService";
import BannerAnnouncement from "../BannerAnnouncement";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

// Create Cloudinary instance
const cld = new Cloudinary({ cloud: { cloudName: 'dyfg9vlvg' } });

// Function to get optimized image
const getOptimizedImage = (publicId) => {
  return cld.image(publicId)
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(300).height(450));
};

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Title");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const {
    addBookmark,
    removeBookmark,
    isBookmarked,
    error: bookmarkError,
  } = useBookmarks();
  const [bookmarkActionError, setBookmarkActionError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      bookService.getAllBooks(),
      discountService.getActiveDiscounts(),
    ])
      .then(([allBooks, activeDiscounts]) => {
        setBooks(allBooks);
        setDiscounts(activeDiscounts);
        setTotalCount(allBooks.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (bookmarkError) {
      setBookmarkActionError(bookmarkError);
      // Clear error after 3 seconds
      const timer = setTimeout(() => setBookmarkActionError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [bookmarkError]);

  // Extract unique languages and publishers
  const languages = Array.from(
    new Set(books.map((b) => b.language).filter(Boolean))
  );
  const publishers = Array.from(
    new Set(books.map((b) => b.publisherName).filter(Boolean))
  );

  // Helper to get discount for a book
  const getBookDiscount = (bookId) =>
    discounts.find((d) => d.bookId === bookId);

  // Filtering and sorting on frontend
  let filteredBooks = books;
  if (searchTerm) {
    const searchTermLower = searchTerm.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => {
      return (
        (book.bookName || book.BookName || "")
          .toLowerCase()
          .includes(searchTermLower) ||
        (book.isbn || book.Isbn || "")
          .toLowerCase()
          .includes(searchTermLower) ||
        (book.description || book.Description || "")
          .toLowerCase()
          .includes(searchTermLower)
      );
    });
  }
  if (selectedLanguage) {
    filteredBooks = filteredBooks.filter(
      (book) => book.language === selectedLanguage
    );
  }
  if (selectedPublisher) {
    filteredBooks = filteredBooks.filter(
      (book) => book.publisherName === selectedPublisher
    );
  }
  if (minPrice) {
    filteredBooks = filteredBooks.filter(
      (book) => Number(book.price) >= Number(minPrice)
    );
  }
  if (maxPrice) {
    filteredBooks = filteredBooks.filter(
      (book) => Number(book.price) <= Number(maxPrice)
    );
  }
  // Show only books that are on sale if the filter is checked
  if (showOnlyOnSale) {
    filteredBooks = filteredBooks.filter((book) => {
      const discount = getBookDiscount(book.bookId);
      return discount && discount.onSale;
    });
  }
  if (sortBy === "Title") {
    filteredBooks = filteredBooks.slice().sort((a, b) => {
      const nameA = a.BookName || a.bookName || "";
      const nameB = b.BookName || b.bookName || "";
      return nameA.localeCompare(nameB);
    });
  } else if (sortBy === "Price") {
    filteredBooks = filteredBooks
      .slice()
      .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  }

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / pageSize);
  const paginatedBooks = filteredBooks.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  // Function to calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - price * (discount.percentage / 100);
  };

  return (
    <>
      <Navbar />
      <BannerAnnouncement />

      <div className="book-page-container">
        <div className="book-main-content">
          {/* Sidebar Filters */}
          <aside className="book-filter">
            <h3>FILTER BY</h3>
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="searchTerm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="filter-group">
              <label>Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="">All</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Publisher</label>
              <select
                value={selectedPublisher}
                onChange={(e) => setSelectedPublisher(e.target.value)}
              >
                <option value="">All</option>
                {publishers.map((pub) => (
                  <option key={pub} value={pub}>
                    {pub}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
            </div>
            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  checked={showOnlyOnSale}
                  onChange={(e) => setShowOnlyOnSale(e.target.checked)}
                />
                Show Only On Sale
              </label>
            </div>
          </aside>

          {/* Main Content */}
          <main className="book-list-section">
            <div className="book-list-header">
              <span className="sort-label">SORT BY</span>
              <div className="sort-dropdown">
                <select value={sortBy} onChange={handleSortChange}>
                  <option value="Title">Title</option>
                  <option value="Price">Price</option>
                </select>
              </div>
            </div>

            <div className="book-list">
              {loading ? (
                <p>Loading...</p>
              ) : paginatedBooks.length === 0 ? (
                <p>No books found.</p>
              ) : (
                paginatedBooks.map((book) => {
                  const discount = getBookDiscount(book.bookId);
                  const discountedPrice = calculateDiscountedPrice(
                    book.price,
                    discount
                  );
                  const isOnSale = discount && discount.onSale;

                  return (
                    <Link
                      to={`/user/book/${book.bookId}`}
                      className={`book-card-list ${isOnSale ? "on-sale" : ""}`}
                      key={book.BookId || book.bookId}
                    >
                      <div className="book-img-placeholder">
                        {book.imageUrl ? (
                          <AdvancedImage 
                          cldImg={getOptimizedImage(book.imageUrl)} 
                          alt={book.bookName}
                          className="book-cover-image"
                        />  
                        ) : (
                          <div className="book-img-placeholder"></div>
                        )}
                        {isOnSale && <div className="sale-badge">SALE</div>}
                      </div>
                      <div className="book-info-list">
                        <div className="book-title">
                          Title: {book.BookName || book.bookName}
                        </div>
                        <div className="book-author">
                          Publisher: {book.publisherName || "Unknown"}
                        </div>
                        <div className="book-description">
                          Description: {book.Description || book.description || "N/A"}
                        </div>
                        <div className="book-isbn">
                          ISBN: {book.Isbn || book.isbn || "N/A"}
                        </div>
                        <div className="book-price">
                          {discount ? (
                            <>
                              <span className="original-price">
                                ${book.price}
                              </span>
                              <span className="discounted-price">
                                ${discountedPrice.toFixed(2)}
                              </span>
                              <span className="discount-percentage">
                                ({discount.percentage}% OFF)
                              </span>
                              {isOnSale && (
                                <span className="sale-badge">SALE</span>
                              )}
                            </>
                          ) : (
                            <span>Price: ${book.price}</span>
                          )}
                        </div>
                      </div>
                      <div className="book-actions-list">
                        {bookmarkActionError && (
                          <div
                            className="error-message"
                            style={{ color: "red", marginBottom: "5px" }}
                          >
                            {bookmarkActionError}
                          </div>
                        )}
                        <button
                          className="bookmark-btn"
                          onClick={async (e) => {
                            e.preventDefault();
                            try {
                              const bookId = book.bookId || book.BookId;
                              if (isBookmarked(bookId)) {
                                await removeBookmark(bookId);
                              } else {
                                await addBookmark(bookId);
                              }
                            } catch (err) {
                              console.error("Error handling bookmark:", err);
                              setBookmarkActionError(
                                err.message || "Failed to update bookmark"
                              );
                            }
                          }}
                        >
                          {isBookmarked(book.bookId)
                            ? "Bookmarked"
                            : "Bookmark"}
                        </button>
                        <button
                          className="add-cart-btn"
                          onClick={async (e) => {
                            e.preventDefault();
                            await cartService.addToCart(
                              book.BookId || book.bookId,
                              1
                            );
                            // Optionally show a toast/alert or update cart state
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
