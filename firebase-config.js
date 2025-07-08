
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRpjiF3EcSA_7TuGkNLp1bxu3iWoY_XnE",
  authDomain: "raun2025-1558d.firebaseapp.com",
  projectId: "raun2025-1558d",
  storageBucket: "raun2025-1558d.firebasestorage.app",
  messagingSenderId: "133273741918",
  appId: "1:133273741918:web:a32b098aac154e42a062cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export to be used in other modules
export { firebaseConfig };
