// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BookmarkProvider } from "./context/BookmarkContext";

import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import VerifyEmail from "./components/auth/VerifyEmail";
import AddBook from "./components/admin/BookManagement";
import HomePage from "./components/Pages/HomePage";
import LoginPage from "./components/auth/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./components/user/UserDashboard";
import StaffDashboard from "./staff/StaffDashboard";
import BookDetail from "./components/user/BookDetail";
import Cart from "./components/user/Cart";
import Wishlist from "./components/user/Wishlist";
import OrderConfirmation from "./components/user/OrderConfirmation";
import AdminDashboards from "./components/admin/Announcement";
import PublisherForm from "./components/admin/PublisherForm";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || user.role?.toLowerCase() !== "admin") return <Navigate to="/" />;
  return children;
};

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || user.role?.toLowerCase() !== "user") return <Navigate to="/" />;
  return children;
};

const StaffRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || user.role?.toLowerCase() !== "staff") return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookmarkProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/books"
              element={
                <AdminRoute>
                  <AddBook />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/announcement"
              element={
                <AdminRoute>
                  <AdminDashboards />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/Publisher"
              element={
                <AdminRoute>
                  <PublisherForm />
                </AdminRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              }
            />
            <Route path="/user/book/:id" element={<BookDetail />} />

            <Route
              path="/user/cart"
              element={
                <UserRoute>
                  <Cart />
                </UserRoute>
              }
            />
            <Route
              path="/user/wishlist"
              element={
                <UserRoute>
                  <Wishlist />
                </UserRoute>
              }
            />
            <Route
              path="/order-confirmation/:orderId"
              element={
                <UserRoute>
                  <OrderConfirmation />
                </UserRoute>
              }
            />

            {/* Staff Route */}
            <Route
              path="/staff/dashboard"
              element={
                <StaffRoute>
                  <StaffDashboard />
                </StaffRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BookmarkProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
