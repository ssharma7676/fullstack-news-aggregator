# The Daily Scroll

The Daily Scroll is a modern, full-stack news aggregator built with React, Node.js, Express, and MongoDB. It delivers curated news content from multiple sources with features such as user authentication, bookmarking articles, and AI-generated article summaries.

---

## Motivation

In today's information-heavy world, staying informed while avoiding news fatigue is challenging. I created The Daily Scroll to streamline news consumption by aggregating quality sources, providing AI summaries for quick scanning, and allowing users to save important or interesting articles for later reading.

## Potential Impact

The Daily Scroll can help users stay better informed while saving time, reduce information overload through intelligent summarization, and create a more personalized news experience that adapts to individual reading preferences and habits.


---

## Key Features

- User Authentication with JWT-based token security.
- Dynamic news fetching via NewsAPI including:
  - General news search
  - Category-specific top headlines
  - Country-specific news
- Bookmarking functionality for logged-in users.
- AI-generated article summaries integrated via an API.
- Infinite scrolling using Intersection Observer API.
- Responsive and accessible React frontend with smooth navigation and UI components.

---

## Tech Stack

Frontend: React, React Router, Context API, CSS  
Backend: Node.js, Express, MongoDB (Mongoose), JWT Authentication  
External APIs: NewsAPI, Summarization API (custom or third-party)  

---

## Project Structure

/client  
  - components (Header, Sidebar, Card, Loader, etc.)  
  - context (AuthContext and global state)  
  - pages (Home, Login, Register, News, TopHeadlines)  

/server  
  - models (User, Bookmark, Summary)  
  - routes (auth, bookmarks, summarize, news)  
  - middleware (auth token verification)  
  - server.js (main Express app)  

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)  
- MongoDB Atlas or local MongoDB instance  
- NewsAPI API key (https://newsapi.org)  

### Installation

1. Clone the repository:  
   `git clone https://github.com/yourusername/thedailyscroll.git`  
   `cd thedailyscroll`

2. Create a `.env` file in `/server` with:  
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
API_KEY=your_newsapi_key

3. Install dependencies:  

- Backend:  
  `cd server`  
  `npm install`

- Frontend:  
  `cd ../client`  
  `npm install`

4. Run the development servers:  

- Backend:  
  `npm run dev`  

- Frontend:  
  `npm start`

---

## Usage

- Register or log in to your account.  
- Browse news by category or country.  
- Bookmark favorite articles to your profile.  
- View AI-generated summaries of articles.  
- Enjoy infinite scrolling for seamless news browsing.  
- Access protected routes for personalized content.

---

## Security

- Passwords are securely hashed (backend logic assumed).  
- JWT tokens secure API endpoints and protect user data.  
- Middleware verifies tokens to restrict access to protected routes.

---

## License

MIT License © 2025
