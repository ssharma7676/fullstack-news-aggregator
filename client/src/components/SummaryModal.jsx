import React from "react";
import "./SummaryModal.css";

function SummaryModal({ title, summary, onClose }) {
  return (
    <div className="summary-modal-overlay" onClick={onClose}>
      <div className="summary-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="summary-modal-close"
          onClick={onClose}
          aria-label="Close summary modal"
        >
          &times;
        </button>
        <h3>{title}</h3> {/* Article title */}
        <h4>Article Summary</h4> {/* Section subtitle */}
        <p>{summary}</p>
      </div>
    </div>
  );
}

export default SummaryModal;