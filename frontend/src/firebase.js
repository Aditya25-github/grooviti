// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpegtWUAmhd8gbH59xmjegFqCINTd6dco",
  authDomain: "grooviti-a7d20.firebaseapp.com",
  projectId: "grooviti-a7d20",
  storageBucket: "grooviti-a7d20.firebasestorage.app",
  messagingSenderId: "960838553033",
  appId: "1:960838553033:web:c8bde7455773ab23032c18",
  measurementId: "G-F2FCM4YPN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
