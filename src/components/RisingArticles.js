import React, { useState, useEffect, useCallback } from "react";
import Article from "./Article.js";
import "../Article.css";
import axios from "axios";

function TopArticles() {
  const [postDisplay, setPostDisplay] = useState([]);
  const [topPostId, setTopPostId] = useState("");

  // Define a function to fetch the latest posts from the backend
  const fetchRisingPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://blurtl-server-production.up.railway.app/api/data/rising"
      );
      const topPosts = response.data.slice(0, 10);
      const topPost = topPosts[0];
      if (topPost.id !== topPostId) {
        setTopPostId(topPost.id);
        setPostDisplay(topPosts);
      }
    } catch (error) {
      console.log("Error fetching top posts:", error);
    }
  }, [topPostId]);

  useEffect(() => {
    // Call the 'fetchLatestPosts' function once when the component mounts
    fetchRisingPosts();
  }, [fetchRisingPosts]);

  // Call the 'fetchLatestPosts' function every 3 minutes
  useEffect(() => {
    const interval = setInterval(fetchRisingPosts, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRisingPosts]);

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
