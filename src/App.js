import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LatestArticles from "./components/LatestArticles.js";
import TopArticles from "./components/TopArticles.js";
import RisingArticles from "./components/RisingArticles.js";
import Navbar from "./components/Navbar.js";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<LatestArticles />} />
          <Route path="/top" element={<TopArticles />} />
          <Route path="/rising" element={<RisingArticles />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
