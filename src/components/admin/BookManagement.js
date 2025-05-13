import React, { useState, useEffect } from "react";
import axios from "axios";
import bookService from "../../services/bookService";
import cloudinaryService from "../../services/cloudinaryService";
import {
  Container,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Snackbar,
  Alert,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { styled } from '@mui/material/styles';
import "./BookManagement.css";

const initialFormState = {
  bookName: "",
  ISBN: "",
  price: 0,
  description: "",
  language: "",
  stock: 0,
  publisherId: "",
  publicationDate: dayjs().toISOString(),
  isComingSoon: false,
  imageUrl: "",
};

const BookManagement = () => {
  const [formData, setFormData] = useState({ ...initialFormState });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [publishers, setPublishers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      setError('Please select an image file first');
      return;
    }

    try {
      setError(null); // Clear any previous errors
      const imageUrl = await cloudinaryService.uploadImage(selectedImage);
      setFormData(prev => ({ ...prev, imageUrl }));
      setSuccess('Image uploaded successfully!');
    } catch (error) {
      setError(error.message);
    }
  };
  const [editMode, setEditMode] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    fetchPublishers();
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      setError("Failed to fetch books");
    }
  };

  const fetchPublishers = async () => {
    try {
      const res = await axios.get("https://localhost:7256/api/Publisher");
      let pubs = [];
      if (Array.isArray(res.data)) {
        pubs = res.data;
      } else if (Array.isArray(res.data.data)) {
        pubs = res.data.data;
      }
      setPublishers(pubs);
    } catch (err) {
      setPublishers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (date) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        publicationDate: date.toISOString(),
      }));
    }
  };

  const resetForm = () => {
    setFormData({ ...initialFormState });
    setEditMode(false);
    setSelectedBookId(null);
  };

  const handleEdit = (book) => {
    setFormData({
      bookName: book.bookName,
      ISBN: book.isbn,
      price: book.price,
      description: book.description,
      language: book.language,
      stock: book.stock,
      publisherId: book.publisherId,
      publicationDate: book.publicationDate,
      isComingSoon: book.isComingSoon,
    });
    setEditMode(true);
    setSelectedBookId(book.bookId);
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await bookService.deleteBook(bookToDelete.bookId);
      setSuccess(true);
      fetchBooks();
      setDeleteDialogOpen(false);
    } catch (err) {
      setError("Failed to delete book");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (selectedImage) {
        await handleImageUpload();
      }
      const payload = {
        BookName: formData.bookName,
        Isbn: formData.ISBN,
        Price: parseFloat(formData.price),
        Description: formData.description,
        Language: formData.language,
        Stock: parseInt(formData.stock),
        PublisherId: formData.publisherId,
        PublicationDate: formData.publicationDate || dayjs().toISOString(),
        IsComingSoon: formData.isComingSoon,
        ImageUrl: formData.imageUrl,
      };

      if (editMode) {
        await bookService.updateBook(selectedBookId, payload);
        setSuccess(true);
        resetForm();
      } else {
        await bookService.add(payload);
        setSuccess(true);
        resetForm();
      }
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book Management
        </Typography>
      </Box>

      {/* Book Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: 3,
          p: 4,
          borderRadius: 2,
          bgcolor: "background.paper",
          mb: 4,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          {editMode ? "Edit Book" : "Add New Book"}
        </Typography>

        <TextField
          fullWidth
          label="Book Name"
          value={formData.bookName}
          onChange={(e) => setFormData({ ...formData, bookName: e.target.value })}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="ISBN"
          value={formData.ISBN}
          onChange={(e) => setFormData({ ...formData, ISBN: e.target.value })}
          margin="normal"
          required
        />

        <Box sx={{ mt: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="contained"
              component="span"
              startIcon={previewImage ? <img src={previewImage} alt="Preview" style={{ width: 20, height: 20 }} /> : null}
            >
              {previewImage ? 'Change Image' : 'Upload Book Image'}
            </Button>
          </label>
        </Box>
        {previewImage && (
          <Box sx={{ mt: 2 }}>
            <img
              src={previewImage}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: 200 }}
            />
          </Box>
        )}

        <TextField
          label="Price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Description"
          name="description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          select
          label="Publisher"
          name="publisherId"
          value={formData.publisherId}
          onChange={handleChange}
          required
          fullWidth
        >
          <MenuItem value="">Select Publisher</MenuItem>
          {publishers.map((pub) => (
            <MenuItem key={pub.publisherId} value={pub.publisherId}>
              {pub.name}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Publication Date"
            value={dayjs(formData.publicationDate)}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>

        <FormControlLabel
          control={
            <Checkbox
              name="isComingSoon"
              checked={formData.isComingSoon}
              onChange={handleChange}
            />
          }
          label="Is Coming Soon?"
        />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          {editMode && (
            <Button type="button" variant="outlined" onClick={resetForm}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Processing..." : editMode ? "Update Book" : "Add Book"}
          </Button>
        </Box>
      </Box>

      {/* Books Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.bookId}>
                <TableCell>{book.bookName}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>${book.price}</TableCell>
                <TableCell>{book.stock}</TableCell>
                <TableCell>{book.language}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(book)}
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(book)}
                    variant="outlined"
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{bookToDelete?.bookName}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Operation completed successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookManagement;
