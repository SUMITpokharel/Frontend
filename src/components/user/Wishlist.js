import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookmarks } from "../../context/BookmarkContext";
import bookService from "../../services/bookService";

const dummyWishlist = [
  {
    id: 1,
    title: "Book Title 1",
    author: "Author Name 1",
    coverImage: "https://via.placeholder.com/120x170?text=Book+1",
    price: 19.99,
    discountedPrice: 14.99,
  },
  {
    id: 2,
    title: "Book Title 2",
    author: "Author Name 2",
    coverImage: "https://via.placeholder.com/120x170?text=Book+2",
    price: 24.99,
    discountedPrice: null,
  },
];

const Wishlist = () => {
  const navigate = useNavigate();
  const { bookmarkedBooks, addBookmark, removeBookmark, isBookmarked } =
    useBookmarks();
  const [detailedBooks, setDetailedBooks] = useState([]);

  useEffect(() => {
    // Fetch details for all bookmarked books
    async function fetchDetails() {
      const details = await Promise.all(
        bookmarkedBooks.map(async (bm) => {
          try {
            const book = await bookService.getBookDetail(bm.bookId);
            return { ...bm, book };
          } catch {
            return { ...bm, book: null };
          }
        })
      );
      setDetailedBooks(details);
    }
    if (bookmarkedBooks.length > 0) fetchDetails();
    else setDetailedBooks([]);
  }, [bookmarkedBooks]);

  const handleRemoveBookmark = (bookId) => {
    // Remove logic here
    alert("Removed from wishlist: " + bookId);
  };

  const handleAddToCart = (bookId) => {
    // Add to cart logic here
    alert("Added to cart: " + bookId);
  };

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
          <p style={{ color: "#666", marginBottom: 32 }}>
            Save your favorite books to your wishlist for later.
          </p>
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
                  src={bm.book.coverImage}
                  alt={bm.book.title}
                  style={{
                    width: 120,
                    height: 170,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/user/book/${bm.book.id}`)}
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
                      onClick={() => navigate(`/user/book/${bm.book.id}`)}
                    >
                      {bm.book.title}
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
                    {bm.book.author}
                  </p>
                  <div style={{ marginTop: "auto", marginBottom: 12 }}>
                    {bm.book.discountedPrice ? (
                      <div>
                        <span style={{ fontWeight: 500 }}>
                          ${bm.book.discountedPrice.toFixed(2)}
                        </span>
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "#888",
                            marginLeft: 8,
                          }}
                        >
                          ${bm.book.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontWeight: 500 }}>
                        ${bm.book.price.toFixed(2)}
                      </span>
                    )}
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
                    onClick={() => handleAddToCart(bm.book.id)}
                  >
                    Add to Cart
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
                  Book not found
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
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
