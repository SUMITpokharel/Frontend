import React, { useEffect, useState } from "react";
import Navbar from "../Navbar.js";
import Footer from "../Footer.js";
import Tabs from "../Tabs.js";
import Filters from "../Filters.js";
import BookGrid from "../BookGrid.js";
import bookService from "../../services/bookService";
import "./HomePage.css";
import BannerAnnouncement from "../BannerAnnouncement";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookService.getAllBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

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
                books={books}
                loading={loading}
              />
            </div>
          </div>
          <div label="Currently Trending">
            <BookGrid type="trending" books={books} loading={loading} />
          </div>
          <div label="Editor's Choice">
            <BookGrid type="editors-choice" books={books} loading={loading} />
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
