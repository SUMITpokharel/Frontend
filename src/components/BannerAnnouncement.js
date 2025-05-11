import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BannerAnnouncement.css"; // Create this file if it doesn't exist

const BannerAnnouncement = () => {
  const [banner, setBanner] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    axios
      .get("https://localhost:7256/api/BannerAnnouncement/active")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        if (data && data.length > 0) {
          setBanner(data[0]);
        }
      })
      .catch(() => setBanner(null));
  }, []);

  if (!banner || !visible) return null;

  return (
    <div className="banner-announcement-modern">
      <div className="banner-content">
        <span className="banner-title">{banner.title}</span>
        <span className="banner-separator">|</span>
        <span className="banner-message">{banner.content}</span>
      </div>
      <button
        className="banner-close"
        onClick={() => setVisible(false)}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default BannerAnnouncement;
