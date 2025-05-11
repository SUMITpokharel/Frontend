import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <a href="/">About Us</a> | <a href="/">Terms</a> |{" "}
        <a href="/">Privacy</a> | <a href="/">Contact</a> | <a href="/">FAQs</a>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Your Book Store. All rights reserved.
      </div>

      <style jsx>{`
        .site-footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-family: Arial, sans-serif;
          border-top: 1px solid #ddd;
          color: #555;
        }

        .footer-links a {
          margin: 0 8px;
          text-decoration: none;
          color: #0070f3;
          font-size: 14px;
        }

        .footer-links a:hover {
          text-decoration: underline;
        }

        .footer-bottom {
          margin-top: 10px;
          font-size: 12px;
          color: #999;
        }
      `}</style>
    </footer>
  );
}
