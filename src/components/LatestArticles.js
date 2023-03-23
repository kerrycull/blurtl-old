import React, { useState, useEffect, useCallback } from "react";
import Article from "./Article";
import "../Article.css";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useKeepAwake } from "@sayem314/react-native-keep-awake";

function LatestArticles() {
  useKeepAwake();
  const [posts, setPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const [postDisplay, setPostDisplay] = useState([]);

  const addPost = useCallback(async (thePost) => {
    if (
      posts.find((post) => post.id === thePost.id) ||
      newPosts.find((post) => post.news_id === thePost.id)
    ) {
      console.log("already exists");
      return;
    }
    if (thePost.id === undefined) {
      console.log("postId is undefined");
      return;
    }
    if (thePost.link.includes("youtube")) {
      console.log("youtube link");
      return;
    }
    try {
      console.log("id not found, adding to db");
      const docRef = await addDoc(collection(db, "posts"), {
        id: thePost.id,
        title: thePost.title,
        excerpt: thePost.excerpt,
        link: thePost.link,
        docId: null,
        upvotes: thePost.upvotes,
        downvotes: thePost.downvotes,
        date: thePost.date,
      });
      const docRef2 = doc(db, `posts/${docRef.id}`);
      await updateDoc(docRef2, { docId: docRef.id });
      //console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }, []);

  const articleGrabber = () => {
    console.log("fetching articles");
    fetch(
      "https://cryptonews-api.com/api/v1/category?section=general&items=50&extra-fields=id&page=1&token=5ouww0nypihcbvkubvklapfqvqwh4d3ibeniydyv"
    )
      .then((response) => response.json())
      .then((data) => {
        setNewPosts(data.data);
      })
      .catch((error) => console.log("Authorization failed: " + error.message));
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (querySnapshot) => {
      console.log("grabbbing snapshot");
      const postSnap = [];
      querySnapshot.forEach((doc) => {
        postSnap.push(doc.data());
      });
      setPosts(postSnap);
      postSnap.sort((a, b) => b.id - a.id); // sort by id in descending order
      setPostDisplay(postSnap.slice(0, 10)); // get the 10 most recent posts
      //console.log(posts);
    });

    return unsubscribe;
  }, [posts]);

  useEffect(() => {
    //console.log("articleGrabber");
    const intervalId = setInterval(() => {
      articleGrabber();
    }, 180000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    newPosts.forEach((post) => {
      if (!posts.find((p) => p.id === post.news_id)) {
        console.log("calling addPost" + post.news_id);
        addPost({
          id: post.news_id,
          title: post.title,
          excerpt: post.text,
          link: post.news_url,
          docId: null,
          upvotes: 0,
          downvotes: 0,
          date: post.date,
        });
      }
    });
  }, [newPosts, addPost, posts]);

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
