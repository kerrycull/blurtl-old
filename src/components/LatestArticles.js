import React, { useState, useEffect, useCallback } from "react";
import Article from "./Article.js";
import "../Article.css";
import axios from "axios";

function LatestArticles() {
  const [postDisplay, setPostDisplay] = useState([]);
  const [latestPostId, setLatestPostId] = useState("");
  const [page, setPage] = useState(1);

  // Define a function to fetch the latest posts from the backend
  const fetchLatestPosts = useCallback(async () => {
    console.log("fetching latest posts... for page " + page + "");
    try {
      const response = await axios.get(
        "https://blurtl-server-production.up.railway.app/api/data"
      );
      const latestTenPosts = response.data.slice(0, page * 10);
      const latestPost = latestTenPosts[0];
      if (latestPost.id !== latestPostId || page !== 1) {
        console.log("updating postDisplay");
        setLatestPostId(latestPost.id);
        setPostDisplay(latestTenPosts);
      }
    } catch (error) {
      console.log("Error fetching latest posts:", error);
    }
  }, [postDisplay.length, page]);

  useEffect(() => {
    // Call the 'fetchLatestPosts' function once when the component mounts
    fetchLatestPosts();
  }, [fetchLatestPosts]);

  // Call the 'fetchLatestPosts' function every 3 minutes
  useEffect(() => {
    const interval = setInterval(fetchLatestPosts, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchLatestPosts]);

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

export default LatestArticles;
