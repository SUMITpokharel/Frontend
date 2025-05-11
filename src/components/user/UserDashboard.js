import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./User.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./UserNavbar";
import { useBookmarks } from "../../context/BookmarkContext";
import bookService from "../../services/bookService";
import cartService from "../../services/cartService";
import BannerAnnouncement from "../BannerAnnouncement";

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Title");
  const [searchTerm, setSearchTerm] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    setLoading(true);
    bookService
      .getAllBooks()
      .then((allBooks) => {
        console.log("Fetched books:", allBooks);
        setBooks(allBooks);
        setTotalCount(allBooks.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtering and sorting on frontend
  let filteredBooks = books;
  if (searchTerm) {
    console.log("Search term:", searchTerm);
    const searchTermLower = searchTerm.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => {
      console.log("Book being filtered:", book);
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
  if (sortBy === "Title") {
    filteredBooks = filteredBooks.slice().sort((a, b) => {
      const nameA = a.BookName || "";
      const nameB = b.BookName || "";
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
                paginatedBooks.map((book) => (
                  <Link
                    to={`/user/book/${book.bookId}`}
                    className="book-card-list"
                    key={book.BookId}
                  >
                    <div className="book-img-placeholder"></div>
                    <div className="book-info-list">
                      <div className="book-title">
                        Title: {book.BookName || book.bookName}
                      </div>
                      <div className="book-author">
                        Author: {book.publisherName || "Unknown"}
                      </div>
                      <div className="book-description">
                        Description:{" "}
                        {book.Description || book.description || "N/A"}
                      </div>
                      <div className="book-isbn">
                        ISBN: {book.Isbn || book.isbn || "N/A"}
                      </div>
                      <div className="book-price">
                        Price: ${book.price ?? ""}
                      </div>
                    </div>
                    <div className="book-actions-list">
                      <button
                        className="bookmark-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(
                            "Bookmarking bookId:",
                            book.bookId || book.BookId
                          );
                          isBookmarked(book.bookId)
                            ? removeBookmark(book.bookId)
                            : addBookmark(book.bookId);
                        }}
                      >
                        {isBookmarked(book.bookId) ? "Bookmarked" : "Bookmark"}
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
                ))
              )}
            </div>

            {/* Pagination Controls */}
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
