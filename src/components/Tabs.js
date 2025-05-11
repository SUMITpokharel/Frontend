import React, { useState } from "react";

export default function Tabs({ children }) {
  const [active, setActive] = useState(0);

  return (
    <div className="tabs">
      <div className="tab-header">
        {React.Children.map(children, (child, idx) => (
          <button
            className={`tab-button ${active === idx ? "active" : ""}`}
            onClick={() => setActive(idx)}
            key={idx}
            type="button"
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{children[active]}</div>

      <style jsx>{`
        .tabs {
          font-family: Arial, sans-serif;
        }

        .tab-header {
          display: flex;
          border-bottom: 2px solid #ddd;
          margin-bottom: 16px;
        }

        .tab-button {
          padding: 12px 16px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-size: 1rem;
          color: #333;
          transition: all 0.2s ease;
        }

        .tab-button:hover {
          color: #0070f3;
        }

        .tab-button.active {
          border-bottom-color: #0070f3;
          color: #0070f3;
          font-weight: bold;
        }

        .tab-content {
          padding: 16px;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
