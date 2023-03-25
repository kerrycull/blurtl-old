import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgWjwCdtRA5Tn1Tqow-4oJziY0dGX1Kjg",
  authDomain: "newnewblurtl.firebaseapp.com",
  projectId: "newnewblurtl",
  storageBucket: "newnewblurtl.appspot.com",
  messagingSenderId: "383019245437",
  appId: "1:383019245437:web:4bfdfef75b8f5064747614",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
