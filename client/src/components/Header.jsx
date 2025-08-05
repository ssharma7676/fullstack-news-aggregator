import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import countries from "./countries";
import "./Header.css";
import Sidebar from "./Sidebar";

function Header() {
  const location = useLocation();

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const userDropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const countryRef = useRef(null);

  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
    "politics",
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Responsive sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay behind the sidebar for closing */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Overlay to dismiss user dropdown */}
      {showUserDropdown && (
        <div
          className="user-dropdown-overlay"
          onClick={() => setShowUserDropdown(false)}
        />
      )}

      <header className="header">
        <nav className="nav-container">
          <div className="nav-left">
            {/* Hamburger for mobile nav */}
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              &#9776;
            </button>

            {/* Logo and home navigation */}
            <Link
              to="/"
              className={`logo-link ${location.pathname === "/" ? "logo-faded" : ""}`}
            >
              <h3 className="logo">The Daily Scroll</h3>
            </Link>
          </div>

          <div className="nav-center">
            <ul className="nav-menu">
              {/* Top-headlines dropdown */}
              <li className="dropdown" ref={categoryRef}>
                <div
                  className="dropdown-wrapper"
                  onMouseEnter={() => setShowCategoryDropdown(true)}
                  onMouseLeave={() => setShowCategoryDropdown(false)}
                >
                  <button
                    aria-haspopup="true"
                    aria-expanded={showCategoryDropdown}
                    aria-controls="category-dropdown"
                    className={`dropdown-toggle ${
                      location.pathname.startsWith("/top-headlines") ? "active-tab" : ""
                    }`}
                  >
                    Top-Headlines
                  </button>

                  <ul
                    id="category-dropdown"
                    className={`dropdown-menu ${showCategoryDropdown ? "show" : ""}`}
                  >
                    {categories.map((cat, i) => (
                      <li key={i}>
                        <Link
                          to={`/top-headlines/${cat}`}
                          className="dropdown-link"
                          onClick={() => setShowCategoryDropdown(false)}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* Country dropdown with flags */}
              <li
                className="dropdown"
                ref={countryRef}
                onMouseEnter={() => setShowCountryDropdown(true)}
                onMouseLeave={() => setShowCountryDropdown(false)}
              >
                <button
                  aria-haspopup="true"
                  aria-expanded={showCountryDropdown}
                  aria-controls="country-dropdown"
                  className={`dropdown-toggle ${
                    location.pathname.startsWith("/country") ? "active-tab" : ""
                  }`}
                >
                  Country
                </button>

                <ul
                  id="country-dropdown"
                  className={`dropdown-menu country-menu ${showCountryDropdown ? "show" : ""}`}
                >
                  {countries.map((c, i) => (
                    <li key={i}>
                      <Link
                        to={`/country/${c.iso_2_alpha.toLowerCase()}`}
                        className="dropdown-link country-link"
                        onClick={() => setShowCountryDropdown(false)}
                      >
                        <img
                          src={`https://flagcdn.com/w40/${c.iso_2_alpha.toLowerCase()}.png`}
                          alt={c.countryName}
                          className="flag-icon"
                          loading="lazy"
                        />
                        {c.countryName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Static All News link */}
              <li>
                <Link
                  to="/news"
                  className={`nav-link ${location.pathname === "/news" ? "active-tab" : ""}`}
                >
                  All News
                </Link>
              </li>
            </ul>
          </div>

          {/* User avatar dropdown */}
          <div className="nav-right">
            <div className="user-dropdown" ref={userDropdownRef}>
              <button
                className="user-icon-button"
                aria-haspopup="true"
                aria-expanded={showUserDropdown}
                onClick={() => setShowUserDropdown(prev => !prev)}
                title={isLoggedIn && user?.username ? `Logged in as ${user.username}` : "User menu"}
              >
                {/* Show avatar badge if logged in */}
                {isLoggedIn && user?.username ? (
                  <div className="avatar-badge">
                    {user.username[0].toUpperCase()}
                  </div>
                ) : (
                  // Default user icon if not logged in
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    width="22"
                    height="22"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                )}
              </button>

              {showUserDropdown && (
                <ul className="user-dropdown-menu">
                  {!isLoggedIn ? (
                    <>
                      <li>
                        <Link to="/login" className="dropdown-link" onClick={() => setShowUserDropdown(false)}>
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" className="dropdown-link" onClick={() => setShowUserDropdown(false)}>
                          Sign Up
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="dropdown-username">
                        Hello, {user?.username}
                      </li>
                      <li>
                        <button
                          className="dropdown-link logout-btn"
                          onClick={() => {
                            handleLogout();
                            setShowUserDropdown(false);
                          }}
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;