import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="top-row">
        <div className="logo">LOGO</div>
        <input type="text" placeholder="Search by title, ISBN, description" />
        <div className="auth-links">
          <Link to="/login">Sign in</Link> /{" "}
          <Link to="/register">Register</Link>
        </div>
      </div>

      <div className="nav-links">
        <Link to="/books">All Books</Link>
        <Link to="/books/new-releases">New Releases</Link>
        <Link to="/books/coming-soon">New Arrivals</Link>
        <Link to="/books/deals">Deals</Link>
      </div>

      <style jsx>{`
        .navbar {
          background-color: white;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          font-family: Arial, sans-serif;
        }

        .top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        input[type="text"] {
          flex: 1;
          margin: 0 20px;
          padding: 8px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .auth-links {
          display: flex;
          gap: 8px;
          color: #0070f3;
        }

        .nav-links {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .nav-links a {
          text-decoration: none;
          color: #333;
          font-size: 1rem;
          font-weight: 500;
        }

        .nav-links a:hover {
          color: #0070f3;
        }
      `}</style>
    </nav>
  );
}
