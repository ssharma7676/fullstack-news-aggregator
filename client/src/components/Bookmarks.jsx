import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Card from "./Card";
import Loader from "./Loader";
import "./News.css";

function Bookmarks() {
    const { isLoggedIn } = useContext(AuthContext); // Access authentication status from context
    const [bookmarks, setBookmarks] = useState([]); // Store fetched bookmark articles
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [errorMsg, setErrorMsg] = useState(null); // Store any error messages

    useEffect(() => {
        // Prevent unauthenticated access
        if (!isLoggedIn) {
            setErrorMsg("You must be logged in to view bookmarks.");
            setIsLoading(false);
            return;
        }

        // Fetch user's bookmarked articles from the backend
        const fetchBookmarks = async () => {
            setIsLoading(true);
            setErrorMsg(null);
            try {
                const res = await fetch("http://localhost:3000/api/bookmarks", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch bookmarks");
                const data = await res.json();
                setBookmarks(data);
            } catch (error) {
                setErrorMsg(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookmarks();
    }, [isLoggedIn]);

    // Render loading spinner or error message if applicable
    if (isLoading) return <Loader />;
    if (errorMsg) return <p className="error-msg">{errorMsg}</p>;

    return (
        <div className="page-wrapper">
            <div className="news-container">
                <h2 className="category-stamp">Bookmarks</h2>

                {bookmarks.length === 0 ? (
                    <p className="no-results">You have no bookmarks yet.</p>
                ) : (
                    <div className="news-grid">
                        {bookmarks.map((bookmark) => (
                            <Card
                                key={bookmark._id}
                                title={bookmark.title}
                                description={bookmark.description}
                                imgUrl={bookmark.urlToImage}
                                publishedAt={bookmark.publishedAt}
                                url={bookmark.articleUrl}
                                author={bookmark.author}
                                source={bookmark.source}
                                initialBookmarked={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Bookmarks;