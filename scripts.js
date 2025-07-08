import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRpjiF3EcSA_7TuGkNLp1bxu3iWoY_XnE",
  authDomain: "raun2025-1558d.firebaseapp.com",
  projectId: "raun2025-1558d",
  storageBucket: "raun2025-1558d.appspot.com",
  messagingSenderId: "133273741918",
  appId: "1:133273741918:web:a32b098aac154e42a062cf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function afficherCapsules() {
  const capsulesContainer = document.getElementById("capsules-container");
  const querySnapshot = await getDocs(collection(db, "capsules"));
  capsulesContainer.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const capsuleHTML = `
      <div class="capsule">
        <h3>${data.titre}</h3>
        <p>${data.texte}</p>
      </div>`;
    capsulesContainer.innerHTML += capsuleHTML;
  });
}

afficherCapsules();
