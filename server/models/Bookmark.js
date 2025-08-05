// Bookmark model schema to store user-saved articles
const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User who saved the bookmark
    ref: "User",
    required: true,
  },
  articleUrl: { type: String, required: true }, // Unique article URL
  title: String,
  description: String,
  urlToImage: String,
  publishedAt: String,
  source: String,
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);
