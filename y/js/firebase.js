// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQkjAGNWuRfwvbRznSzzzT5v5luD0r148",
  authDomain: "projeto-abel.firebaseapp.com",
  projectId: "projeto-abel",
  storageBucket: "projeto-abel.firebasestorage.app",
  messagingSenderId: "970584059270",
  appId: "1:970584059270:web:0bbf901877041372d45007",
  measurementId: "G-8KKNLGT321"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 