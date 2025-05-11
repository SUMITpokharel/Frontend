import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaClipboardList,
  FaDollarSign,
  FaBullhorn,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import "./Admin.css";
import bookService from "../../services/bookService";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [bookCount, setBookCount] = useState(0);

  useEffect(() => {
    bookService.getAllBooks().then((books) => {
      setBookCount(books.length);
    });
  }, []);

  return (
    <div className="admin-bg">
      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-header-left">
            <FaUserShield className="admin-avatar" />
            <h1>Admin Dashboard</h1>
          </div>
          <button onClick={logout} className="logout-button">
            <FaSignOutAlt style={{ marginRight: 8 }} /> Logout
          </button>
        </div>

        <div className="admin-welcome">
          <h2>Welcome, {user.firstName}!</h2>
          <p>
            You are logged in as an <b>administrator</b>. Use the panel below to
            manage the system.
          </p>
        </div>

        <div className="admin-links">
          <h3>Admin Panel</h3>
          <nav>
            <ul>
              <li>
                <Link to="/admin/books">
                  <FaBook className="admin-link-icon" /> Manage Books
                </Link>
              </li>
              <li>
                <Link to="/admin/users">
                  <FaUsers className="admin-link-icon" /> Manage Users
                </Link>
              </li>
              <li>
                <Link to="/admin/orders">
                  <FaClipboardList className="admin-link-icon" /> Manage Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/reports">
                  <FaDollarSign className="admin-link-icon" /> View Reports
                </Link>
              </li>
              <li>
                <Link to="/admin/announcement">
                  <FaBullhorn className="admin-link-icon" /> Announcement
                </Link>
              </li>
              <li>
                <Link to="/admin/Publisher">
                  <FaBullhorn className="admin-link-icon" /> Add Publisher
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="admin-stats">
          <h3>Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-card stat-books">
              <FaBook className="stat-icon" />
              <div>
                <h4>Total Books</h4>
                <p>{bookCount}</p>
              </div>
            </div>
            <div className="stat-card stat-users">
              <FaUsers className="stat-icon" />
              <div>
                <h4>Total Users</h4>
                <p>0</p>
              </div>
            </div>
            <div className="stat-card stat-orders">
              <FaClipboardList className="stat-icon" />
              <div>
                <h4>Total Orders</h4>
                <p>0</p>
              </div>
            </div>
            <div className="stat-card stat-revenue">
              <FaDollarSign className="stat-icon" />
              <div>
                <h4>Revenue</h4>
                <p>$0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
