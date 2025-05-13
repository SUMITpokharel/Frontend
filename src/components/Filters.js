import React, { useState, useEffect } from "react";
import bookService from "../services/bookService";

export default function Filters({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    bookService.getAllBooks().then((books) => {
      setLanguages(Array.from(new Set(books.map((b) => b.language).filter(Boolean))));
      setPublishers(Array.from(new Set(books.map((b) => b.publisherName).filter(Boolean))));
    });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onFilterChange({ searchTerm: e.target.value });
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    onFilterChange({ language: e.target.value });
  };

  const handlePublisherChange = (e) => {
    setSelectedPublisher(e.target.value);
    onFilterChange({ publisher: e.target.value });
  };

  const handlePriceChange = (type, value) => {
    if (type === 'min') {
      setMinPrice(value);
      onFilterChange({ minPrice: value });
    } else {
      setMaxPrice(value);
      onFilterChange({ maxPrice: value });
    }
  };

  return (
    <aside className="filters">
      <h4>Filter</h4>

      <div className="filter-group">
        <label>Search</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by title, ISBN, description"
        />
      </div>

      <div className="filter-group">
        <label>Language</label>
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
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
          onChange={handlePublisherChange}
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
            value={minPrice}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            placeholder="Min"
          />
          <span>to</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Show Only On Sale</label>
        <input
          type="checkbox"
          checked={showOnlyOnSale}
          onChange={(e) => {
            setShowOnlyOnSale(e.target.checked);
            onFilterChange({ onSale: e.target.checked });
          }}
        />
      </div>

      <style jsx>{`
        .filters {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          font-family: Arial, sans-serif;
        }

        h4 {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 1.2rem;
          color: #333;
        }

        .filter-group {
          margin-bottom: 16px;
        }

        .filter-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.95rem;
          color: #555;
        }

        .filter-group input[type="text"],
        .filter-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.95rem;
        }

        .price-range {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .price-range input {
          width: 45%;
        }

        .price-range span {
          color: #555;
        }

        .filter-group input[type="checkbox"] {
          margin-right: 8px;
        }
      `}</style>
    </aside>
  );
}
