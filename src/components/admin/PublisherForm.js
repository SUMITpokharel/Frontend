import React, { useState, useEffect } from "react";
import publisherService from "../../services/publisherService";

const PublisherForm = ({ onPublisherAdded }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [publishers, setPublishers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      const data = await publisherService.getAll();
      setPublishers(data);
    } catch (err) {
      setMessage("Failed to fetch publishers.");
    }
  };

  const resetForm = () => {
    setName("");
    setContact("");
    setEmail("");
    setEditMode(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await publisherService.update(editId, { name, contact, email });
        setMessage("Publisher updated successfully!");
      } else {
        await publisherService.add({ name, contact, email });
        setMessage("Publisher added successfully!");
      }
      resetForm();
      fetchPublishers();
      if (onPublisherAdded) onPublisherAdded();
    } catch (err) {
      setMessage(
        editMode ? "Failed to update publisher." : "Failed to add publisher."
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await publisherService.delete(id);
      setMessage("Publisher removed successfully!");
      fetchPublishers();
    } catch (err) {
      setMessage("Failed to remove publisher.");
    }
  };

  const handleEdit = (publisher) => {
    setEditMode(true);
    setEditId(publisher.publisherId);
    setName(publisher.name);
    setContact(publisher.contact || "");
    setEmail(publisher.email || "");
  };

  return (
    <div className="admin-publisher-form">
      <h3>{editMode ? "Edit Publisher" : "Add Publisher"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Publisher Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="form-buttons">
          <button type="submit">
            {editMode ? "Update Publisher" : "Add Publisher"}
          </button>
          {editMode && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
      {message && <div className="message">{message}</div>}

      <div className="publishers-list">
        <h3>Publishers List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map((publisher) => (
              <tr key={publisher.publisherId}>
                <td>{publisher.name}</td>
                <td>{publisher.contact}</td>
                <td>{publisher.email}</td>
                <td>
                  <button
                    onClick={() => handleEdit(publisher)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(publisher.publisherId)}
                    className="delete-btn"
                  >
                    Remove
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

export default PublisherForm;
