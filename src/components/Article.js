import React, { useEffect, useState } from "react";
import "../Article.css";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Article({ post }) {
  function shortenString(str, length) {
    if (str.length > 200) {
      return str.substring(0, length - 3) + "...";
    } else {
      return str;
    }
  }

  const length = 200;
  const excerpt = shortenString(post.excerpt, length);

  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [downvotes, setDownvotes] = useState(post.downvotes || 0);

  // HANDLE UPVOTE
  const handleUpvote = async () => {
    const newUpvotes = upvotes + 1;
    setUpvotes(newUpvotes);
    const docRef = doc(db, `posts/${post.docId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, { upvotes: newUpvotes });
    } else {
      console.log("Document does not exist");
    }
  };

  // HANDLE DOWNVOTE
  const handleDownvote = async () => {
    const newDownvotes = downvotes + 1;
    setDownvotes(newDownvotes);
    const docRef = doc(db, `posts/${post.docId}`);
    await updateDoc(docRef, { downvotes: newDownvotes });
  };

  const score = upvotes - downvotes;

  const [timeAgoStr, setTimeAgoStr] = useState(timeAgo(post.date));

  // FUNCTION TO CALCULATE TIME ARTICLE WAS POSTED
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

  useEffect(() => {
    // Update the time every minute
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
        <a href={post.link} className="link">
          Full article
        </a>
      </div>
      <div className="score-container">
        <button onClick={handleUpvote}>↑</button>
        <span className="score">{score}</span>
        <button onClick={handleDownvote}>↓</button>
      </div>
    </div>
  );
}

export default Article;
