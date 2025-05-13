import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <FaBookOpen className="navbar-logo-icon" />
          <span>BookShelf</span>
        </div>
        <div className="nav-links">
          <Link to="/books" className="active">All Books</Link>
          <Link to="/books/new-releases">New Releases</Link>
          <Link to="/books/coming-soon">New Arrivals</Link>
          <Link to="/books/deals">Deals</Link>
        </div>
        <div className="auth-links">
          <Link to="/login">Sign in</Link>
          <Link to="/register" className="btn-primary">Register</Link>
        </div>
      </div>
    </nav>
  );
}
