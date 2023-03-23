import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp3JuYr0b8SsxgedOdmUrGPyCjkdEkv8c",
  authDomain: "cumdog.firebaseapp.com",
  projectId: "cumdog",
  storageBucket: "cumdog.appspot.com",
  messagingSenderId: "962317535784",
  appId: "1:962317535784:web:cbc193b466576accf3431d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
