import React, { useEffect, useState } from "react";
import Navbar from "../Navbar.js";
import Footer from "../Footer.js";
import Tabs from "../Tabs.js";
import BookGrid from "../BookGrid.js";
import Filters from "../Filters.js";
import bookService from "../../services/bookService";
import discountService from "../../services/discountService";
import "./HomePage.css";
import BannerAnnouncement from "../BannerAnnouncement";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);

  useEffect(() => {
    Promise.all([
      bookService.getAllBooks(),
      discountService.getActiveDiscounts(),
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

      // Apply initial filters if any
      if (searchTerm || selectedLanguage || selectedPublisher || minPrice || maxPrice || showOnlyOnSale) {
        const filteredBooks = booksWithDiscounts.filter(book => {
          const matchesSearch = !searchTerm || 
            book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (book.description || '').toLowerCase().includes(searchTerm.toLowerCase());
          const matchesLanguage = !selectedLanguage || book.language === selectedLanguage;
          const matchesPublisher = !selectedPublisher || book.publisherName === selectedPublisher;
          const matchesPrice = (!minPrice || book.price >= Number(minPrice)) &&
                              (!maxPrice || book.price <= Number(maxPrice));
          const matchesSale = !showOnlyOnSale || (book.discount && book.discount.onSale);
          
          return matchesSearch && matchesLanguage && matchesPublisher && matchesPrice && matchesSale;
        });
        setBooks(filteredBooks);
      }
    });
  }, []);



  return (
    <>
      <Navbar />
      <BannerAnnouncement />

      {/* Announcement Bar */}

      {/* Main Content */}
      <main className="page-content">
        <div className="top-picks-section">
          <h2>Top Picks</h2>
          <div className="filters-and-grid">
            <Filters
              onFilterChange={(filters) => {
                if (filters.searchTerm) setSearchTerm(filters.searchTerm);
                if (filters.language) setSelectedLanguage(filters.language);
                if (filters.publisher) setSelectedPublisher(filters.publisher);
                if (filters.minPrice) setMinPrice(filters.minPrice);
                if (filters.maxPrice) setMaxPrice(filters.maxPrice);
                if (filters.onSale !== undefined) setShowOnlyOnSale(filters.onSale);

                // Apply filters
                const filteredBooks = books.filter(book => {
                  const matchesSearch = !filters.searchTerm || 
                    book.bookName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    book.isbn.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    (book.description || '').toLowerCase().includes(filters.searchTerm.toLowerCase());
                  const matchesLanguage = !filters.language || book.language === filters.language;
                  const matchesPublisher = !filters.publisher || book.publisherName === filters.publisher;
                  const matchesPrice = (!filters.minPrice || book.price >= Number(filters.minPrice)) &&
                                      (!filters.maxPrice || book.price <= Number(filters.maxPrice));
                  const matchesSale = !filters.onSale || (book.discount && book.discount.onSale);
                  
                  return matchesSearch && matchesLanguage && matchesPublisher && matchesPrice && matchesSale;
                });
                setBooks(filteredBooks);
              }}
            />
            <BookGrid
              className="top-picks-grid"
              books={books}
              loading={loading}
            />
          </div>
        </div>
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
