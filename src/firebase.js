import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwxJHyOLNfikS4AxK70fg-Astt1vi5_0Q",
  authDomain: "blurtl.firebaseapp.com",
  databaseURL: "https://blurtl-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "blurtl",
  storageBucket: "blurtl.appspot.com",
  messagingSenderId: "9162363109",
  appId: "1:9162363109:web:1c1b5d4a8cfadd19ae040c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
