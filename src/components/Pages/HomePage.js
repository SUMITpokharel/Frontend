import React, { useEffect, useState } from "react";
import Navbar from "../Navbar.js";
import Footer from "../Footer.js";
import Tabs from "../Tabs.js";
import Filters from "../Filters.js";
import BookGrid from "../BookGrid.js";
import bookService from "../../services/bookService";
import discountService from "../../services/discountService";
import "./HomePage.css";
import BannerAnnouncement from "../BannerAnnouncement";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    Promise.all([
      bookService.getAllBooks(),
      discountService.getActiveDiscounts(),
    ]).then(([booksData, discountsData]) => {
      const booksWithDiscounts = booksData.map((book) => {
        const discount = discountsData.find((d) => d.bookId === book.bookId);
        if (discount) {
          const discountedPrice =
            book.price - (book.price * discount.percentage) / 100;
          return {
            ...book,
            discount,
            isDiscounted: true,
            discountedPrice,
          };
        }
        return { ...book, isDiscounted: false };
      });
      setBooks(booksWithDiscounts);
      setDiscounts(discountsData);
      setLoading(false);
    });
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(books.length / pageSize);
  const paginatedBooks = books.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Navbar />
      <BannerAnnouncement />

      {/* Announcement Bar */}

      {/* Main Content */}
      <main className="page-content">
        {/* Top Picks Section */}
        <Tabs>
          <div label="Top Picks">
            <div className="filters-and-grid">
              <Filters />
              <BookGrid
                className="top-picks-grid"
                books={paginatedBooks}
                loading={loading}
              />
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
          </div>
          <div label="Currently Trending">
            <BookGrid
              type="trending"
              books={paginatedBooks}
              loading={loading}
            />
          </div>
          <div label="Editor's Choice">
            <BookGrid
              type="editors-choice"
              books={paginatedBooks}
              loading={loading}
            />
          </div>
        </Tabs>
      </main>

      {/* Newsletter Signup */}
      <section className="newsletter">
        <h3>Join Our Newsletter</h3>
        <p>
          Subscribe to get updates on new releases, exclusive deals, and reading
          recommendations.
        </p>
        <form>
          <input type="email" placeholder="Your email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <Footer />
    </>
  );
}
