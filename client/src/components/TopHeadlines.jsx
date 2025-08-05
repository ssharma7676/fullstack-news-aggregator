import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import Card from "./Card";
import Loader from "./Loader";
import "./News.css";
import { AuthContext } from "../context/AuthContext";

function TopHeadlines() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showJumpTop, setShowJumpTop] = useState(false);

  const { isLoggedIn } = useContext(AuthContext);
  const [bookmarkedUrls, setBookmarkedUrls] = useState([]);

  const loaderRef = useRef(null);
  const pageSize = 6;
  const MAX_PAGE = 50;
  const maxPage = Math.min(Math.ceil(totalResults / pageSize), MAX_PAGE);

  const displayCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Business";

  // Reset articles & page on category change
  useEffect(() => {
    setArticles([]);
    setPage(1);
  }, [category]);

  // Fetch bookmarks on login status change
  useEffect(() => {
    if (!isLoggedIn) {
      setBookmarkedUrls([]);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/bookmarks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  // Fetch headlines
  useEffect(() => {
    const fetchHeadlines = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      const selectedCategory = category || "business";

      try {
        const url = new URL("http://localhost:3000/top-headlines");
        url.searchParams.append("category", selectedCategory);
        url.searchParams.append("page", page);
        url.searchParams.append("pageSize", pageSize);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Network response was not OK");

        const json = await response.json();
        if (!json.success) throw new Error(json.message || "Failed to fetch data");

        const newArticles = json.data.articles || [];
        setArticles((prev) => {
          const existingUrls = new Set(prev.map((a) => a.url));
          return [...prev, ...newArticles.filter((a) => !existingUrls.has(a.url))];
        });
        setTotalResults(json.data.totalResults || 0);
      } catch (error) {
        console.error("Error fetching headlines:", error);
        setErrorMsg(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeadlines();
  }, [page, category]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && page < maxPage) {
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => current && observer.unobserve(current);
  }, [isLoading, page, maxPage]);

  // Show jump-to-top button on scroll
  useEffect(() => {
    const handleScroll = () => setShowJumpTop(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jumpToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleToggleBookmark = (url, isNowBookmarked) => {
    setBookmarkedUrls((prev) =>
      isNowBookmarked ? [...prev, url] : prev.filter((u) => u !== url)
    );
  };

  return (
    <div className="news-wrapper" aria-busy={isLoading}>
      <main className="news-container">
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {!errorMsg && !isLoading && articles.length === 0 && (
          <p className="no-results">No articles found for {displayCategory}.</p>
        )}

        <div className="news-grid grain-effect">
          {articles.map((article) => (
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
          ))}
        </div>

        <div ref={loaderRef}>{isLoading && <Loader />}</div>

        {showJumpTop && (
          <button onClick={jumpToTop} className="jump-top-btn" aria-label="Jump to top">
            ⬆ Jump to Top
          </button>
        )}
      </main>
    </div>
  );
}

export default TopHeadlines;