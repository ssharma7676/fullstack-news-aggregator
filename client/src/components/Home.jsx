import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <main className="home-container">
      <header className="home-header">
        <div className="home-intro">
          {/* Title animation */}
          <h1 className="home-title">
            {"Welcome to The Daily Scroll".split("").map((char, i) => (
              <span
                key={i}
                className="title-letter"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          {/* Subheading tagline */}
          <p className="home-tagline">
            A modern take on the trusted daily paper.
          </p>

          {/* Navigation button to view all news articles */}
          <Link to="/news" className="home-button">
            View All News
          </Link>
        </div>
      </header>
    </main>
  );
}