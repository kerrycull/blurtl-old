import React, { useEffect, useState } from "react";
import "../Article.css";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Article({ post }) {
  const length = 200;

  const title = post.title.replaceAll("&#8217;", "'");

  const excerpt = post.excerpt.replaceAll("<p>", "");
  const excerpt2 = excerpt.replaceAll("</p>", "");
  const excerpt3 = excerpt2.replaceAll("&#8216;", "'");
  const excerpt4 = excerpt3.replaceAll("&#8217;", "'");
  const excerpt5 = excerpt4.replaceAll("[&hellip;]", "...");
  const excerpt6 = excerpt5.replaceAll("&#8211;", "...");

  function shortenString(str, length) {
    if (str.length > 200) {
      return str.substring(0, length - 3) + "...";
    } else {
      return str;
    }
  }

  const excerpt7 = shortenString(excerpt6, length);

  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [downvotes, setDownvotes] = useState(post.downvotes || 0);

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

  const handleDownvote = async () => {
    const newDownvotes = downvotes + 1;
    setDownvotes(newDownvotes);
    const docRef = doc(db, `posts/${post.docId}`);
    await updateDoc(docRef, { downvotes: newDownvotes });
  };

  const score = upvotes - downvotes;

  const [timeAgoStr, setTimeAgoStr] = useState(timeAgo(post.date));

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins + " minutes ago";
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
        <h3 className="title">{title}</h3>
        <p className="dateStamp"> {newTime}</p>
        <p className="excerpt">{excerpt7}</p>
        <a href={post.link} className="link">
          Full article
        </a>
      </div>
      <div className="score-container">
        <button onClick={handleUpvote}>Upvote</button>
        <span className="score">{score}</span>
        <button onClick={handleDownvote}>Downvote</button>
      </div>
    </div>
  );
}

export default Article;
