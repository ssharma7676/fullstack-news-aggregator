import React from "react";
import './App.css';
import Header from "./components/Header";
import { BrowserRouter, Route, Routes, useLocation, matchPath } from "react-router-dom";
import News from './components/News';
import TopHeadlines from './components/TopHeadlines';
import CountryNews from './components/CountryNews';
import countries from './components/countries';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home";
import Bookmarks from "./components/Bookmarks";

// Component to show category or country stamp based on URL
function CategoryStamp() {
  const location = useLocation();

  const categoryMatch = matchPath("/top-headlines/:category", location.pathname);
  const countryMatch = matchPath("/country/:iso", location.pathname);

  let label = "";

  if (categoryMatch?.params?.category) {
    const cat = categoryMatch.params.category;
    label = `${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
  } else if (countryMatch?.params?.iso) {
    const iso = countryMatch.params.iso.toLowerCase();
    const matchCountry = countries.find(c => c.iso_2_alpha.toLowerCase() === iso);
    if (matchCountry) {
      label = `${matchCountry.countryName}`;
    }
  }

  if (!label) return null;

  return (
    <div className="category-stamp">
      <span className="category-text" title={label}>{label}</span>
    </div>
  );
}

// Wrapper component inside App to access location
function AppWrapper() {
  const location = useLocation();

  // Hide header on login and register pages
  const hideHeader = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      <CategoryStamp />
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/top-headlines/:category" element={<TopHeadlines />} />
        <Route path="/country/:iso" element={<CountryNews />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
