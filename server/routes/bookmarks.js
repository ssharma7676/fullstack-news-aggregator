const express = require("express");
const router = express.Router();
const Bookmark = require("../models/Bookmark");
const auth = require("../middleware/authMiddleware");

// Get all bookmarks for a user
router.get("/", auth, async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ user: req.user.id });
        res.json(bookmarks);
    } catch (err) {
        console.error("Bookmark fetch error:", err);
        res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
    
});

// Add a new bookmark
router.post("/", auth, async (req, res) => {
    const { articleUrl, title, description, urlToImage, publishedAt, source } = req.body;

    const existing = await Bookmark.findOne({ user: req.user.id, articleUrl });
    if (existing) {
        return res.status(400).json({ message: "Already bookmarked" });
    }

    const bookmark = new Bookmark({
        user: req.user.id,
        articleUrl,
        title,
        description, 
        urlToImage,
        publishedAt,
        source,
    });

    await bookmark.save();
    res.json(bookmark);
});

// Remove bookmark
router.delete("/", auth, async (req, res) => {
    const {articleUrl } = req.body;
    await Bookmark.findOneAndDelete({ user: req.user.id, articleUrl });
    res.json({ message: "Bookmark removed" });
});

module.exports = router;