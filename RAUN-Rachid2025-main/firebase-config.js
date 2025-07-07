import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRpjiF3EcSA_7TuGkNLp1bxu3iWoY_XnE",
  authDomain: "raun2025-1558d.firebaseapp.com",
  projectId: "raun2025-1558d",
  storageBucket: "raun2025-1558d.appspot.com",
  messagingSenderId: "133273741918",
  appId: "1:133273741918:web:a32b098aac154e42a062cf"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
