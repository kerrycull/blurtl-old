import React, { useState, useEffect, useCallback } from "react";
import Article from "./Article";
import "../Article.css";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { useKeepAwake } from "@sayem314/react-native-keep-awake";

function LatestArticles() {
  useKeepAwake();
  const [posts, setPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const [postDisplay, setPostDisplay] = useState([]);

  // SNAPSHOT AND DISPLAY POSTS FROM DB
  useEffect(() => {
    setPosts([]);
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("id", "desc"), limit(50)),
      (querySnapshot) => {
        console.log("grabbbing snapshot");
        const postSnap = [];
        querySnapshot.forEach((doc) => {
          postSnap.push(doc.data());
        });
        //console.log(postSnap);
        setPosts(postSnap);
        setPostDisplay(postSnap.slice(0, 10));
      }
    );

    return unsubscribe;
  }, []);

  // GRAB NEW POSTS FROM API
  useEffect(() => {
    console.log("articleGrabber");
    const intervalId = setInterval(() => {
      fetch(
        "https://cryptonews-api.com/api/v1/category?section=general&items=50&extra-fields=id&page=1&token=5ouww0nypihcbvkubvklapfqvqwh4d3ibeniydyv"
      )
        .then((response) => response.json())
        .then((data) => {
          setNewPosts(data.data);
        })
        .catch((error) =>
          console.log("Authorization failed: " + error.message)
        );
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    processNewPosts();
  }, [newPosts]);

  useEffect(() => {
    console.log(posts);
    setPostDisplay(posts.slice(0, 10));
  }, [posts]);

  // ADD POST TO DB
  const addPost = useCallback(async (thePost) => {
    console.log("adding post" + thePost.id);
    if (posts.find((post) => post.id === thePost.id)) {
      console.log("already exists");
      return;
    }
    try {
      //console.log("id not found, adding to db");
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
      //setPosts((posts) => [thePost, ...posts]);
      return;
    } catch (e) {
      console.error("Error adding document: ", e);
      return;
    }
  }, []);

  const processNewPosts = () => {
    console.log("processNewPosts");
    if (newPosts.length === 0) {
      console.log("no new posts");
      return;
    }

    // Add the new posts to the database
    for (const post of newPosts) {
      if (posts.find((p) => p.id === post.news_id)) {
        console.log("postId found" + post.news_id);
        continue;
      } else {
        console.log("postId not found" + post.news_id);
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
        continue;
      }
    }
    // Clear the new posts array
    setPostDisplay(posts.slice(0, 10));
    setNewPosts([]);
  };

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
