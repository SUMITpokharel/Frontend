import React from "react";

export default function Filters() {
  return (
    <aside className="filters">
      <h4>Filter</h4>

      <div className="filter-section">
        <strong>Author</strong>
        {/* Example filter options */}
        <label>
          <input type="checkbox" /> Author 1
        </label>
        <label>
          <input type="checkbox" /> Author 2
        </label>
      </div>

      <div className="filter-section">
        <strong>Genre</strong>
        <label>
          <input type="checkbox" /> Fiction
        </label>
        <label>
          <input type="checkbox" /> Non-fiction
        </label>
      </div>

      <div className="filter-section">
        <strong>Availability</strong>
        <label>
          <input type="checkbox" /> In stock
        </label>
        <label>
          <input type="checkbox" /> In library only
        </label>
      </div>

      <div className="filter-section">
        <strong>Price</strong>
        <label>
          <input type="checkbox" /> $0 - $10
        </label>
        <label>
          <input type="checkbox" /> $10 - $25
        </label>
        <label>
          <input type="checkbox" /> $25+
        </label>
      </div>

      <div className="filter-section">
        <strong>Language</strong>
        <label>
          <input type="checkbox" /> English
        </label>
        <label>
          <input type="checkbox" /> Spanish
        </label>
      </div>

      <div className="filter-section">
        <strong>Format</strong>
        <label>
          <input type="checkbox" /> Paperback
        </label>
        <label>
          <input type="checkbox" /> Hardcover
        </label>
        <label>
          <input type="checkbox" /> E-book
        </label>
      </div>

      <div className="filter-section">
        <strong>Publisher</strong>
        <label>
          <input type="checkbox" /> Publisher A
        </label>
        <label>
          <input type="checkbox" /> Publisher B
        </label>
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

        .filter-section {
          margin-bottom: 20px;
        }

        .filter-section strong {
          display: block;
          margin-bottom: 8px;
          font-size: 1rem;
          color: #555;
        }

        label {
          display: block;
          margin-bottom: 6px;
          font-size: 0.95rem;
          color: #333;
          cursor: pointer;
        }

        input[type="checkbox"] {
          margin-right: 8px;
        }
      `}</style>
    </aside>
  );
}
