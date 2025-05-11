import React, { useState } from "react";
import publisherService from "../../services/publisherService";

const PublisherForm = ({ onPublisherAdded }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await publisherService.add({ name, contact, email });
      setMessage("Publisher added successfully!");
      setName("");
      setContact("");
      setEmail("");
      if (onPublisherAdded) onPublisherAdded();
    } catch (err) {
      setMessage("Failed to add publisher.");
    }
  };

  return (
    <div className="admin-publisher-form">
      <h3>Add Publisher</h3>
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
        <button type="submit">Add Publisher</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
};

export default PublisherForm;
