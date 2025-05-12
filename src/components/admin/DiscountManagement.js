import React, { useState, useEffect } from "react";
import discountService from "../../services/discountService";
import bookService from "../../services/bookService";
import "./DiscountManagement.css";

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState("");
  const [percentage, setPercentage] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingDiscount, setEditingDiscount] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [discountsData, booksData] = await Promise.all([
        discountService.getAllDiscounts(),
        bookService.getAllBooks(),
      ]);
      setDiscounts(discountsData);
      setBooks(booksData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const discountData = {
        bookId: selectedBook,
        percentage: parseFloat(percentage),
        onSale,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };

      if (editingDiscount) {
        await discountService.updateDiscount(
          editingDiscount.discountId,
          discountData
        );
      } else {
        await discountService.createDiscount(discountData);
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error("Error saving discount:", error);
    }
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setSelectedBook(discount.bookId);
    setPercentage(discount.percentage.toString());
    setOnSale(discount.onSale);
    setStartDate(new Date(discount.startDate).toISOString().split("T")[0]);
    setEndDate(new Date(discount.endDate).toISOString().split("T")[0]);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      try {
        await discountService.deleteDiscount(id);
        loadData();
      } catch (error) {
        console.error("Error deleting discount:", error);
      }
    }
  };

  const resetForm = () => {
    setEditingDiscount(null);
    setSelectedBook("");
    setPercentage("");
    setOnSale(false);
    setStartDate("");
    setEndDate("");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="discount-management">
      <h2>Manage Discounts</h2>

      <form onSubmit={handleSubmit} className="discount-form">
        <div className="form-group">
          <label>Book:</label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            required
          >
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book.bookId} value={book.bookId}>
                {book.bookName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Discount Percentage:</label>
          <input
            type="number"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => setOnSale(e.target.checked)}
            />
            Mark as On Sale
          </label>
        </div>

        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">
            {editingDiscount ? "Update Discount" : "Create Discount"}
          </button>
          {editingDiscount && (
            <button type="button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="discounts-list">
        <h3>Current Discounts</h3>
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Percentage</th>
              <th>On Sale</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.discountId}>
                <td>{discount.bookName}</td>
                <td>{discount.percentage}%</td>
                <td>{discount.onSale ? "Yes" : "No"}</td>
                <td>{new Date(discount.startDate).toLocaleDateString()}</td>
                <td>{new Date(discount.endDate).toLocaleDateString()}</td>
                <td>{discount.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button onClick={() => handleEdit(discount)}>Edit</button>
                  <button onClick={() => handleDelete(discount.discountId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountManagement;
