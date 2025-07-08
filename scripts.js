import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function chargerCapsules() {
  const container = document.getElementById("capsulesContainer");
  const querySnapshot = await getDocs(collection(db, "capsules"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `<h3>${data.titre}</h3><p>${data.contenu}</p><hr>`;
    container.appendChild(div);
  });
}

chargerCapsules();