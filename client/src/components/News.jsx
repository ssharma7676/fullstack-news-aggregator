import React, { useState, useEffect, useRef, useContext } from "react";
import Card from "./Card";
import Loader from "./Loader";
import "./News.css";
import { AuthContext } from "../context/AuthContext";

function News() {
  // State to manage fetched articles and pagination
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = useContext(AuthContext);
  const [bookmarkedUrls, setBookmarkedUrls] = useState([]);

  const loaderRef = useRef(null);

  const pageSize = 6;
  const MAX_PAGE = 50;
  const maxPage = Math.min(Math.ceil(totalResults / pageSize), MAX_PAGE);

  // Toggle bookmark state for article URL
  const handleToggleBookmark = (url, isNowBookmarked) => {
    setBookmarkedUrls((prev) =>
      isNowBookmarked ? [...prev, url] : prev.filter((u) => u !== url)
    );
  };

  // Fetch user bookmarks if logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setBookmarkedUrls([]);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/bookmarks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        const urls = data.map((bm) => bm.articleUrl);
        setBookmarkedUrls(urls);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };

    fetchBookmarks();
  }, [isLoggedIn]);

  // Fetch paginated news articles
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/all-news?page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) throw new Error("Failed to fetch news");

        const json = await response.json();
        const newArticles = json?.data?.articles || [];

        setData((prevData) => {
          const existingUrls = new Set(prevData.map((a) => a.url));
          const filtered = newArticles.filter((a) => !existingUrls.has(a.url));
          return [...prevData, ...filtered];
        });

        setTotalResults(json?.data?.totalResults || 0);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [page]);

  // Auto-load next page using IntersectionObserver (infinite scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isLoading &&
          page < maxPage
        ) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [isLoading, page, maxPage]);

  // Show "Jump to Top" button on scroll
  const [showJumpTop, setShowJumpTop] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 200) {
        setShowJumpTop(true);
      } else {
        setShowJumpTop(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const jumpToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="news-wrapper">
      <main className="news-container">
        <div className="news-grid grain-effect">
          {data.length > 0 ? (
            data.map((article) => (
              <Card
                key={article.url}
                title={article.title}
                description={article.description}
                imgUrl={article.urlToImage}
                publishedAt={article.publishedAt}
                url={article.url}
                author={article.author}
                source={article.source.name}
                initialBookmarked={bookmarkedUrls.includes(article.url)}
                onToggleBookmark={handleToggleBookmark}
              />
            ))
          ) : !isLoading ? (
            <p className="no-results">No articles found.</p>
          ) : null}
        </div>

        <div ref={loaderRef}>
          {isLoading && <Loader />}
        </div>

        {/* Scroll-to-top control */}
        {showJumpTop && (
          <button
            onClick={jumpToTop}
            className="jump-top-btn"
            aria-label="Jump to top"
          >
            ⬆ Jump to Top
          </button>
        )}
      </main>
    </div>
  );
}

export default News;