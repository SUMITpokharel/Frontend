import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const API_URL = "https://localhost:7256/api/Book";

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
};

const AddBook = () => {
  const [formData, setFormData] = useState({ ...initialFormState });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    async function fetchPublishers() {
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
    }
    fetchPublishers();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
    };

    console.log("Submitting payload:", payload);

    try {
      const response = await axios.post(API_URL, payload);

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setFormData({ ...initialFormState });
      }
    } catch (err) {
      console.error("Error adding book:", err);
      const errorMessage =
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) || // show backend model validation error
        err.message ||
        "An error occurred while adding the book.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
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
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Add New Book
        </Typography>

        <TextField
          label="Book Name"
          name="bookName"
          value={formData.bookName}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="ISBN"
          name="ISBN"
          value={formData.ISBN}
          onChange={handleChange}
          required
          fullWidth
        />

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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? "Adding..." : "Add Book"}
        </Button>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Book added successfully!
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

export default AddBook;
