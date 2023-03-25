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
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("id", "desc"), limit(50)),
      (querySnapshot) => {
        console.log("grabbbing snapshot");
        const postSnap = [];
        querySnapshot.forEach((doc) => {
          postSnap.push(doc.data());
        });
        setPosts((prevPosts) => [...prevPosts, ...postSnap]);
        setPostDisplay([...postSnap.slice(0, 10)]);
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
          console.log("setNewPosts");
        })
        .catch((error) =>
          console.log("Authorization failed: " + error.message)
        );
    }, 180000);

    return () => clearInterval(intervalId);
  }, []);

  // ADD POST TO DB
  const addPost = useCallback(
    async (thePost) => {
      console.log("adding post");
      console.log(thePost);
      if (posts.find((post) => post.id === thePost.id)) {
        console.log("already exists");
        return false;
      }
      if (thePost.id === undefined) {
        console.log("postId is undefined");
        return false;
      }
      if (thePost.link.includes("youtube.com")) {
        console.log("youtube link");
        return false;
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
        setPosts([...posts, thePost]);
        setPostDisplay([...posts.slice(0, 10)]);
        return true;
      } catch (e) {
        console.error("Error adding document: ", e);
        return false;
      }
    },
    [posts]
  );

  useEffect(() => {
    console.log("processing new posts" + newPosts.length);

    const processNewPosts = async () => {
      if (newPosts.length === 0) {
        console.log("no new posts");
        return;
      }

      // Add the new posts to the database
      for (const post of newPosts) {
        if (!posts.find((p) => p.id === post.news_id)) {
          console.log("postId not found" + post.news_id);
          await addPost({
            id: post.news_id,
            title: post.title,
            excerpt: post.text,
            link: post.news_url,
            docId: null,
            upvotes: 0,
            downvotes: 0,
            date: post.date,
          });
        } else {
          console.log("postId found" + post.news_id);
          continue;
        }
      }

      // Update the displayed posts
      setPosts([...posts, newPosts]);
      setPostDisplay([...posts.slice(0, 10)]);

      // Clear the new posts array
      setNewPosts([]);
    };

    processNewPosts();
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
