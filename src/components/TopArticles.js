import React, { useState, useEffect, useCallback } from "react";
import Article from "./Article.js";
import "../Article.css";
import axios from "axios";

function TopArticles() {
  const [postDisplay, setPostDisplay] = useState([]);
  const [topPostId, setTopPostId] = useState("");

  // Define a function to fetch the latest posts from the backend
  const fetchTopPosts = useCallback(async () => {
    try {
      const response = await axios.get("/api/data/top");
      const topPost = response.data[0];
      if (topPost.id !== topPostId) {
        setTopPostId(topPost.id);
        setPostDisplay(response.data);
      }
    } catch (error) {
      console.log("Error fetching top posts:", error);
    }
  }, [topPostId]);

  useEffect(() => {
    // Call the 'fetchLatestPosts' function once when the component mounts
    fetchTopPosts();
  }, [fetchTopPosts]);

  // Call the 'fetchLatestPosts' function every 3 minutes
  useEffect(() => {
    const interval = setInterval(fetchTopPosts, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTopPosts]);

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
