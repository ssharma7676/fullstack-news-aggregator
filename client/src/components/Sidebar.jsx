import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      {/* Overlay to dim background when sidebar is open */}
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
        aria-hidden={isOpen ? "false" : "true"}
      ></div>

      {/* Sidebar drawer, toggles open/closed */}
      <aside
        className={`sidebar ${isOpen ? "open" : ""}`}
        aria-hidden={isOpen ? "false" : "true"}
      >
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          &times;
        </button>

        {/* Show personalized nav if logged in */}
        {isLoggedIn ? (
          <nav className="sidebar-nav">
            <ul>
              <li>
                <Link to="/" onClick={onClose}>
                  Home
                </Link>
              </li>
            </ul>

            <div className="sidebar-divider" />

            <ul>
              <li>
                <Link to="/bookmarks" onClick={onClose}>
                  Bookmarks
                </Link>
              </li>
            </ul>
          </nav>
        ) : (
          /* Message prompting sign in when not authenticated */
          <div className="sidebar-message">
            <p>Sign in to access personalized features.</p>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;