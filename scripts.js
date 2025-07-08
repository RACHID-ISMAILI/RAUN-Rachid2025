import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById("capsules-container");

async function chargerCapsules() {
  const capsulesRef = collection(db, "capsules");
  const snapshot = await getDocs(capsulesRef);
  snapshot.forEach((doc) => {
    const capsule = doc.data();
    const capsuleDiv = document.createElement("div");
    capsuleDiv.innerHTML = `
      <h3>${capsule.titre}</h3>
      <p>${capsule.contenu}</p>
      <p><small>Votes 👍 ${capsule.votes_up || 0} / 👎 ${capsule.votes_down || 0} – Lue ${capsule.lectures || 0} fois</small></p>
      <hr>`;
    container.appendChild(capsuleDiv);
  });
}

chargerCapsules();
