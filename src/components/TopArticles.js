import React, { useState, useEffect, useCallback } from "react";
import Article from "./Article.js";
import "../Article.css";
import axios from "axios";

function TopArticles() {
  const [postDisplay, setPostDisplay] = useState([]);
  const [topPostId, setTopPostId] = useState("");
  const [page, setPage] = useState(1);

  // Define a function to fetch the latest posts from the backend
  const fetchTopPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://blurtl-server-production.up.railway.app/api/data/top"
      );
      const topPosts = response.data.slice(0, page * 10);
      const topPost = topPosts[0];
      if (topPost.id !== topPostId || page !== 1) {
        setTopPostId(topPost.id);
        setPostDisplay(topPosts);
      }
    } catch (error) {
      console.log("Error fetching top posts:", error);
    }
  }, [topPostId, postDisplay.length, page]);

  useEffect(() => {
    // Call the 'fetchLatestPosts' function once when the component mounts
    fetchTopPosts();
  }, [fetchTopPosts]);

  // Call the 'fetchLatestPosts' function every 3 minutes
  useEffect(() => {
    const interval = setInterval(fetchTopPosts, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTopPosts]);

  // Add a scroll event listener to the window object
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setPage(page + 1);
        console.log("reached bottom " + (page + 1));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);

  return (
    <div className="article-container">
      {postDisplay.map((post, index) => (
        <ul key={index}>
          <Article post={post} />
        </ul>
      ))}
    </div>
  );
}

export default TopArticles;
