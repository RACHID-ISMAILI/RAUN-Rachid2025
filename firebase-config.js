import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDRpjiF3EcSA_7TuGkNLp1bxu3iWoY_XnE',
  authDomain: 'raun2025-1558d.firebaseapp.com',
  projectId: 'raun2025-1558d',
  storageBucket: 'raun2025-1558d.firebasestorage.app',
  messagingSenderId: '133273741918',
  appId: '1:133273741918:web:a32b098aac154e42a062cf'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };