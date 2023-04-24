import React, { useEffect, useState } from "react";
import "../Article.css";
import axios from "axios";
import { auth } from "./Modal/firebase.js";

import PopupModalUp from "./Modal/PopupModaUp.js";
import PopupModalDown from "./Modal/PopupModaDown.js";

// SHORTENS THE EXCERPT TO A CERTAIN LENGTH
function shortenString(str, length) {
  if (str.length > 200) {
    return str.substring(0, length - 3) + "...";
  } else {
    return str;
  }
}

// CONVERTS DATE STRING TO MINUTES SINCE POSTED
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000); // 3600000 milliseconds in an hour
  const diffDays = Math.floor(diffMs / 86400000); // 86400000 milliseconds in a day

  if (diffMins < 1) {
    return "just now";
  } else if (diffMins < 60) {
    return diffMins + " minutes ago";
  } else if (diffHours === 1) {
    return "1 hour ago";
  } else if (diffHours > 1 && diffHours < 24) {
    return diffHours + " hours ago";
  } else {
    return diffDays + " days ago";
  }
}

function Article({ post }) {
  const length = 200;
  const excerpt = shortenString(post.text, length);

  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [downvotes, setDownvotes] = useState(post.downvotes || 0);
  const score = upvotes - downvotes;

  const [timeAgoStr, setTimeAgoStr] = useState("");

  //console.log(post.news_id + " --- " + timeAgoStr);

  useEffect(() => {
    setUpvotes(post.upvotes || 0);
    setDownvotes(post.downvotes || 0);
  }, [post.upvotes, post.downvotes]);

  const handleUpvote = async () => {
    if (auth.currentUser !== null) {
      try {
        await axios
          .get(
            `https://blurtl-server-production.up.railway.app/api/data/${post.news_id}/upvote`
          )
          .then((response) => console.log(response));
        setUpvotes(upvotes + 1); // Update the upvotes state locally
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("user not signed in");
    }
  };

  const handleDownvote = async () => {
    if (auth.currentUser !== null) {
      try {
        await axios
          .get(
            `https://blurtl-server-production.up.railway.app/api/data/${post.news_id}/downvote`
          )
          .then((response) => console.log(response));
        setUpvotes(upvotes - 1); // Update the upvotes state locally
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("user not signed in");
    }
  };

  // Update the time every minute
  useEffect(() => {
    setTimeAgoStr(timeAgo(post.date));
    const intervalId = setInterval(() => {
      const newTimeAgoStr = timeAgo(post.date);
      setTimeAgoStr(newTimeAgoStr);
    }, 60000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [post.date]);

  return (
    <div className="articleBox">
      <div className="article">
        <h3 className="title">{post.title}</h3>
        <p className="dateStamp"> {timeAgoStr}</p>
        <p className="excerpt">{excerpt}</p>
        <a target="_blank" rel="noreferrer" href={post.url} className="link">
          Full article
        </a>
      </div>
      <div className="score-container">
        <div className="voteDiv" onClick={handleUpvote}>
          <PopupModalUp/>
        </div>
        <span className="score">{score}</span>
        <div className="voteDiv" onClick={handleDownvote}>
          <PopupModalDown/>
        </div>
      </div>
    </div>
  );
}

export default Article;
