import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookmarks } from "../../context/BookmarkContext";
import bookService from "../../services/bookService";

const Wishlist = () => {
  const navigate = useNavigate();
  const { bookmarkedBooks, removeBookmark, isLoading } = useBookmarks();
  const [detailedBooks, setDetailedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      const details = await Promise.all(
        bookmarkedBooks.map(async (bm) => {
          const bookId = bm.bookId;

          // Skip if bookId is invalid
          if (!bookId) {
            console.warn("Invalid bookId in bookmark", bm);
            return { ...bm, book: null };
          }

          try {
            const book = await bookService.getBookDetail(bookId);
            if (!book) {
              console.warn(`Book not found for ID: ${bookId}`);
              return { ...bm, book: null };
            }
            return { ...bm, book };
          } catch (err) {
            console.error(`Error fetching book detail for ID: ${bookId}`, err);
            return { ...bm, book: null };
          }
        })
      );
      setDetailedBooks(details);
      setLoading(false);
    }

    if (!isLoading && bookmarkedBooks.length > 0) {
      fetchDetails();
    } else {
      setDetailedBooks([]);
      setLoading(false);
    }
  }, [bookmarkedBooks, isLoading]);

  if (isLoading || loading) {
    return <div>Loading your wishlist...</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
        Your Wishlist
      </h1>
      {detailedBooks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <span style={{ fontSize: 48, color: "#bbb" }}>🤍</span>
          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "16px 0" }}>
            Your wishlist is empty
          </h2>
          <button
            style={{
              background: "#4a90e2",
              color: "#fff",
              padding: "10px 32px",
              border: "none",
              borderRadius: 4,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => navigate("/user/dashboard")}
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
          }}
        >
          {detailedBooks.map((bm) =>
            bm.book ? (
              <div
                key={bm.bookMarkId}
                style={{
                  display: "flex",
                  border: "1px solid #eee",
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <img
                  src={
                    bm.book.coverImage ||
                    "https://via.placeholder.com/120x170?text=No+Image "
                  }
                  alt={bm.book.title || "No Title"}
                  style={{
                    width: 120,
                    height: 170,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(`/user/book/${bm.book.bookId || bm.book.id}`)
                  }
                />
                <div
                  style={{
                    padding: 16,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h3
                      style={{ fontWeight: 600, cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/user/book/${bm.book.bookId || bm.book.id}`)
                      }
                    >
                      {bm.book.bookName || bm.book.title || "No Title"}
                    </h3>
                    <button
                      onClick={() => removeBookmark(bm.bookId)}
                      style={{
                        color: "#e53935",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      aria-label="Remove from wishlist"
                    >
                      🗑️
                    </button>
                  </div>
                  <p style={{ color: "#666", marginBottom: 8 }}>
                    {bm.book.publisherName || "Unknown Publisher"}
                  </p>
                  <div style={{ marginTop: "auto", marginBottom: 12 }}>
                    <span style={{ fontWeight: 500 }}>
                      ${bm.book.price?.toFixed(2) || "N/A"}
                    </span>
                  </div>
                  <button
                    style={{
                      width: "100%",
                      background: "#4a90e2",
                      color: "#fff",
                      padding: "8px 0",
                      border: "none",
                      borderRadius: 4,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate(`/user/book/${bm.book.bookId || bm.book.id}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={bm.bookMarkId}
                style={{ textAlign: "center", padding: "64px 0" }}
              >
                <span style={{ fontSize: 48, color: "#bbb" }}>🤍</span>
                <h2 style={{ fontSize: 24, fontWeight: 600, margin: "16px 0" }}>
                  Book not found (it may have been removed)
                </h2>
                <button
                  style={{
                    background: "#e53935",
                    color: "#fff",
                    padding: "8px 24px",
                    border: "none",
                    borderRadius: 4,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => removeBookmark(bm.bookId)}
                >
                  Remove from Wishlist
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
