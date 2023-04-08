import React, { useState, useEffect, useCallback } from "react";
import Article from "./Article.js";
import "../Article.css";
import axios from "axios";

function LatestArticles() {
  const [postDisplay, setPostDisplay] = useState([]);
  const [latestPostId, setLatestPostId] = useState("");

  // Define a function to fetch the latest posts from the backend
  const fetchLatestPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://blurtl-server-production.up.railway.app/api/data"
      );
      const latestPost = response.data[0];
      if (latestPost.id !== latestPostId) {
        setLatestPostId(latestPost.id);
        setPostDisplay(response.data);
      }
    } catch (error) {
      console.log("Error fetching latest posts:", error);
    }
  }, [latestPostId]);

  useEffect(() => {
    // Call the 'fetchLatestPosts' function once when the component mounts
    fetchLatestPosts();
  }, [fetchLatestPosts]);

  // Call the 'fetchLatestPosts' function every 3 minutes
  useEffect(() => {
    const interval = setInterval(fetchLatestPosts, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchLatestPosts]);

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

export default LatestArticles;
