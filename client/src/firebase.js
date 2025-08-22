// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-b420f.firebaseapp.com",
  projectId: "mern-estate-b420f",
  storageBucket: "mern-estate-b420f.firebasestorage.app",
  messagingSenderId: "936368339803",
  appId: "1:936368339803:web:78c73f32ccc84afe2c387e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);