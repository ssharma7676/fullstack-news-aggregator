require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const verifyToken = require("./middleware/authMiddleware");

// Load models
require("./models/User");
require("./models/Bookmark");

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", require("./routes/bookmarks"));
app.use("/api/summarize", require('./routes/summarize'));

const API_KEY = process.env.API_KEY;
const MONGO_URI = process.env.MONGO_URI;

// Helper to fetch news from external API and respond
function fetchNews(url, res) {
  axios.get(url)
    .then(response => {
      if (response.data.totalResults > 0) {
        res.json({
          status: 200,
          success: true,
          message: "Successfully fetched the data",
          data: response.data,
        });
      } else {
        res.json({
          status: 200,
          success: true,
          message: "No more results to show",
        });
      }
    })
    .catch(error => {
      res.json({
        status: 500,
        success: false,
        message: "Failed to fetch data from the API",
        error: error.message,
      });
    });
}

// Public news endpoints
app.get("/all-news", (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 40;
  const page = parseInt(req.query.page) || 1;
  const query = req.query.q || "latest";

  const url = `https://newsapi.org/v2/everything?q=${query}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
  fetchNews(url, res);
});

app.get("/top-headlines", (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 80;
  const page = parseInt(req.query.page) || 1;
  const category = req.query.category || "business";

  const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
  fetchNews(url, res);
});

app.get("/country/:iso", (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 80;
  const page = parseInt(req.query.page) || 1;
  const country = req.params.iso;

  const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY}&page=${page}&pageSize=${pageSize}`;
  fetchNews(url, res);
});

// Protected route example to test auth middleware
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: `Hello, ${req.user.username}! You have accessed a protected route.`,
  });
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});