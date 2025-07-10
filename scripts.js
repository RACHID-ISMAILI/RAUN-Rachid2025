import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.subscribe = function () {
  const email = document.getElementById("subscribeEmail").value.trim();
  if (email) alert("Merci pour votre abonnement : " + email);
};

async function afficherCapsules() {
  const container = document.getElementById("capsulesContainer");
  const querySnapshot = await getDocs(collection(db, "capsules"));
  container.innerHTML = "";

  querySnapshot.forEach(async (docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;
    // Gérer le vote unique par capsule avec localStorage
    const votedKey = `voted-${id}`;
    const hasVoted = localStorage.getItem(votedKey);

    // Création du bloc capsule
    const capsuleDiv = document.createElement("div");
    capsuleDiv.className = "capsule";

    // Créer les boutons votes
    const upBtn = document.createElement("button");
    upBtn.innerText = "👍";
    upBtn.type = "button";
    upBtn.disabled = !!hasVoted;
    upBtn.onclick = async function(e) {
      e.preventDefault();
      if (localStorage.getItem(votedKey)) {
        alert("Tu as déjà voté pour cette capsule !");
        return;
      }
      const capsuleRef = doc(db, "capsules", id);
      await updateDoc(capsuleRef, { votes_up: increment(1) });
      localStorage.setItem(votedKey, "true");
      afficherCapsules();
    };

    const downBtn = document.createElement("button");
    downBtn.innerText = "👎";
    downBtn.type = "button";
    downBtn.disabled = !!hasVoted;
    downBtn.onclick = async function(e) {
      e.preventDefault();
      if (localStorage.getItem(votedKey)) {
        alert("Tu as déjà voté pour cette capsule !");
        return;
      }
      const capsuleRef = doc(db, "capsules", id);
      await updateDoc(capsuleRef, { votes_down: increment(1) });
      localStorage.setItem(votedKey, "true");
      afficherCapsules();
    };

    // Zone commentaires
