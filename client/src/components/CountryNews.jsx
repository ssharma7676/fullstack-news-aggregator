import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import Card from "./Card";
import Loader from "./Loader";
import countries from "./countries";
import "./News.css"; 
import { AuthContext } from "../context/AuthContext";

function CountryNews() {
  const params = useParams();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  const { isLoggedIn } = useContext(AuthContext);
  const [bookmarkedUrls, setBookmarkedUrls] = useState([]);

  const pageSize = 6;
  const MAX_PAGE = 50;
  const maxPage = Math.min(Math.ceil(totalResults / pageSize), MAX_PAGE);
  const language = "en";

  const countryObj = countries.find(c => c.iso_2_alpha === params.iso.toLowerCase());
  const countryName = countryObj ? countryObj.countryName : params.iso;

  // Fetch user's saved bookmarks if authenticated
  useEffect(() => {
    if (isLoggedIn) {
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
    } else {
      setBookmarkedUrls([]);
    }
  }, [isLoggedIn]);

  // Fetch paginated news articles by country name
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/all-news?q=${encodeURIComponent(
            countryName
          )}&language=${language}&page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();
        const newArticles = json?.data?.articles || [];

        setTotalResults(json?.data?.totalResults || 0);

        // Deduplicate articles based on URL
        setData((prev) => {
          const existingUrls = new Set(prev.map((a) => a.url));
          const filtered = newArticles.filter((a) => !existingUrls.has(a.url));
          return [...prev, ...filtered];
        });
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [page, params.iso]);

  // Setup infinite scroll observer for pagination
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

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [isLoading, page, maxPage]);

  const [showJumpTop, setShowJumpTop] = useState(false);

  // Show "Jump to Top" button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowJumpTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jumpToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Update local bookmark state after user interaction
  const handleToggleBookmark = (url, isNowBookmarked) => {
    setBookmarkedUrls((prev) =>
      isNowBookmarked ? [...prev, url] : prev.filter((u) => u !== url)
    );
  };

  return (
    <div className="news-wrapper">
      <main className="news-container">
        <div className="news-grid grain-effect">
          {data.length > 0 ? (
            data.map((element) => (
              <Card
                key={element.url}
                title={element.title}
                description={element.description}
                imgUrl={element.urlToImage}
                publishedAt={element.publishedAt}
                url={element.url}
                author={element.author}
                source={element.source.name}
                initialBookmarked={bookmarkedUrls.includes(element.url)}
                onToggleBookmark={handleToggleBookmark}
              />
            ))
          ) : !isLoading ? (
            <p className="no-results">No articles found for this country.</p>
          ) : null}
        </div>

        <div ref={loaderRef}>
          {isLoading && <Loader />}
        </div>

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

export default CountryNews;