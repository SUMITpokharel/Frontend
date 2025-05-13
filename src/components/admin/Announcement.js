import React, { useState } from "react";
import axios from "axios";
import "./Announcement.css";
// ...other imports

const AdminDashboards = () => {
  // ...existing code

  // State for the announcement form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const toISOString = (dateStr) => new Date(dateStr).toISOString();

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://localhost:7256/api/BannerAnnouncement",
        {
          title,
          content,
          startDate: toISOString(startDate),
          endDate: toISOString(endDate),
        }
      );
      setMessage("Announcement created!");
      setTitle("");
      setContent("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      setMessage("Failed to create announcement.");
    }
  };

  return (
    <div className="admin-bg">
      {/* ...existing dashboard code... */}
      <div className="admin-announcement-form">
        <h3>Create Banner Announcement</h3>
        <form onSubmit={handleAnnouncementSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <button type="submit">Add Announcement</button>
        </form>
        {message && <div>{message}</div>}
      </div>
      {/* ...rest of dashboard... */}
    </div>
  );
};

export default AdminDashboards;
