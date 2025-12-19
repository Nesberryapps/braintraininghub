
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRYYcd8jNO1PLscSSMlnkp-QiO-A9OGO0",
  authDomain: "mind-bloom-v3y6p.firebaseapp.com",
  projectId: "mind-bloom-v3y6p",
  storageBucket: "mind-bloom-v3y6p.firebasestorage.app",
  messagingSenderId: "1080250387073",
  appId: "1:1080250387073:web:5c8f448091545408fedb80",
  measurementId: "G-5V93ET4Z5H"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
