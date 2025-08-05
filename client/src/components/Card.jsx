import React, { useState, useContext } from "react";
import "./Card.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import SummaryModal from "./SummaryModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Card(props) {
  const { isLoggedIn } = useContext(AuthContext); // Access authentication state from context
  const [bookmarked, setBookmarked] = useState(props.initialBookmarked || false); // Track bookmark state

  // Format the article's published date
  const publishedDate = new Date(props.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Handle bookmarking logic (toggle save/remove)
  const handleBookmarkClick = async () => {
    if (!isLoggedIn) {
      alert("Log in to bookmark articles.");
      return;
    }

    try {
      if (bookmarked) {
        await axios.delete("http://localhost:3000/api/bookmarks", {
          data: { articleUrl: props.url },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await axios.post("http://localhost:3000/api/bookmarks", {
          articleUrl: props.url,
          title: props.title,
          description: props.description,
          urlToImage: props.imgUrl,
          publishedAt: props.publishedAt,
          source: props.source,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      setBookmarked(!bookmarked);
      props.onToggleBookmark(props.url, !bookmarked);
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

  const [summary, setSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [errorSummary, setErrorSummary] = useState(null);

  // Fetch article summary from backend
  const handleSummarizeClick = async () => {
    try {
      setLoadingSummary(true);
      setShowSummaryModal(true);

      const response = await axios.post("http://localhost:3000/api/summarize", {
        url: props.url,
      });

      if (response.data.summary) {
        setSummary(response.data.summary);
      } else {
        setSummary("Sorry, no summary returned.");
      } 
    } catch (error) {
      console.error("Summary error:", error);
      setSummary("Sorry, failed to fetch summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="card">
      {/* Image Section */}
      <div className="card-image">
        {props.imgUrl ? (
          <img
            className="card-img"
            src={props.imgUrl}
            alt="News visual"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="no-visual-placeholder">
            No Visual
          </div>
        )}
      </div>

      {/* Text Section */}
      <div className="card-content">
        <div>
          <h2
            className="card-title"
            onClick={() => window.open(props.url, "_blank")}
            title="Read full article"
          >
            {props.title}
          </h2>
          <p className="card-description">
            {props.description?.substring(0, 200)}…
          </p>
        </div>

        {/* Meta Information */}
        <div className="card-meta">
          <p>
            <span className="label">Source:</span>{" "}
            <a
              href={props.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link"
              title={props.source}
            >
              {props.source.length > 20
                ? props.source.substring(0, 20) + "…"
                : props.source}
            </a>
          </p>

          <p>
            <span className="label">Author:</span>{" "}
            {props.author
              ? props.author.length > 20
                ? props.author.substring(0, 20) + "…"
                : props.author
              : "Unknown"}
          </p>

          <p>
            <span className="label">Published:</span>{formattedDate}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {isLoggedIn && (
        <>
          <button
            className="summarize-btn"
            onClick={handleSummarizeClick}
            title="Summarize article"
            disabled={loadingSummary}
          >
            <FontAwesomeIcon icon={loadingSummary ? faSpinner : faList} spin={loadingSummary} size="lg" />
          </button>
        
          <button className="bookmark-icon" onClick={handleBookmarkClick} title="Bookmark this article">
            <FontAwesomeIcon icon={bookmarked ? solidBookmark : regularBookmark} size="lg" />
          </button>
        </>
      )}

      {/* Summary Modal */}
      {showSummaryModal && summary && (
        <SummaryModal title={props.title} summary={summary} onClose={() => setShowSummaryModal(false)} />
      )}
    </div>
  );
}

export default Card;