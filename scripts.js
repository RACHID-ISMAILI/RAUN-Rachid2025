import { firebaseConfig, db } from './firebase-config.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const capsulesCollection = collection(db, "capsules");

async function afficherCapsules() {
  const querySnapshot = await getDocs(capsulesCollection);
  const container = document.getElementById("capsules-container");
  container.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "capsule";
    div.innerHTML = `
      <h3>${data.titre}</h3>
      <p>${data.contenu}</p>
    `;
    container.appendChild(div);
  });
}

window.addEventListener("DOMContentLoaded", afficherCapsules);