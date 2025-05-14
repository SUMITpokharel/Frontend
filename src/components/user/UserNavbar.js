import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaSignOutAlt,
  FaBookOpen,
  FaStar,
} from "react-icons/fa";
import "./User.css";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-row navbar-top-row">
        <div className="navbar-logo">
          <FaBookOpen className="navbar-logo-icon" />
          <span>BookShelf</span>
        </div>
        <div className="navbar-search">
          <FaSearch className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search by title, ISBN, description"
            className="navbar-search-input"
          />
        </div>
        <div className="navbar-actions">
          <Link to="/user/cart" className="navbar-action-btn">
            <FaShoppingCart />
            <span>Cart</span>
          </Link>
          <Link to="/user/wishlist" className="navbar-action-btn">
            <FaHeart />
            <span>Wishlist</span>
          </Link>
          <Link to="/user/reviews" className="navbar-action-btn">
            <FaStar />
            <span>Reviews</span>
          </Link>
          <button
            className="navbar-logout-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            title="Logout"
          >
            <FaSignOutAlt />
            <span className="navbar-logout-text">Logout</span>
          </button>
        </div>
      </div>
      <div className="navbar-row navbar-links-row">
        <Link to="/">All Books</Link>
        <Link to="/">Bestsellers</Link>
        <Link to="/">Award Winners</Link>
        <Link to="/">New Releases</Link>
        <Link to="/">New Arrivals</Link>
        <Link to="/">Deals</Link>
      </div>
    </nav>
  );
}
