import React, { useEffect, useState, useCallback} from "react";
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

  const [responseType, setResponseType] = useState("");

  const fetchPostVotes = useCallback(async () => {
    try {
      const response = await axios.post(`https://blurtl-server-production.up.railway.app/api/data/${post.news_id}/votes`, {
        user_id: auth.currentUser.uid,
      });
      console.log(response.data);
      setResponseType(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [post]);

  useEffect(() => {
    setUpvotes(post.upvotes || 0);
    setDownvotes(post.downvotes || 0);
  }, [post.upvotes, post.downvotes]);
  
  useEffect(() => {
    fetchPostVotes();
  }, [fetchPostVotes]);

  const handleUpvote = async () => {
    if (auth.currentUser !== null) {
      try {
        const response = await axios.post(`https://blurtl-server-production.up.railway.app/api/data/${post.news_id}/upvote`, {
          user_id: auth.currentUser.uid,
        });
        if (response.data === "upvote") {
          setUpvotes(upvotes + 1);
          setResponseType("upvote");
          console.log("upvoted");
        } else if (response.data === "upvote2") {
          setUpvotes(upvotes + 1);
          setResponseType("noresponse");
          console.log("no response");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('user not signed in');
    }
  };

  const handleDownvote = async () => {
    if (auth.currentUser !== null) {
      try {
        const response = await axios.post(`https://blurtl-server-production.up.railway.app/api/data/${post.news_id}/downvote`, {
          user_id: auth.currentUser.uid,
        });
        if (response.data === "downvote") {
          setDownvotes(downvotes + 1);
          setResponseType("downvote");
          console.log("downvoted");
        } else if (response.data === "downvote2") {
          setDownvotes(downvotes + 1);
          setResponseType("noresponse");
          console.log("no response");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('user not signed in');
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
      <div
          className={responseType === "upvote" ? "voteDivUp" : "voteDiv"}
          onClick={handleUpvote}
        >
          <PopupModalUp />
        </div>
        <span className="score">{score}</span>
        <div
          className={responseType === "downvote" ? "voteDivDown" : "voteDiv"}
          onClick={handleDownvote}
        >
          <PopupModalDown />
        </div>
      </div>
    </div>
  );
}

export default Article;
