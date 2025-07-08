
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
    const capsuleDiv = document.createElement("div");
    capsuleDiv.innerHTML = `
      <h2>${data.titre}</h2>
      <p>${data.contenu}</p>
      <div>
        <button onclick="voter('${docSnap.id}', 'up')">👍</button>
        <button onclick="voter('${docSnap.id}', 'down')">👎</button>
      </div>
      <div id="votes-${docSnap.id}">Votes : ${data.votes_up} 👍 / ${data.votes_down} 👎</div>
      <div>Lectures : ${data.lectures || 0}</div>
      <textarea id="comment-${docSnap.id}" placeholder="Écrire un commentaire…"></textarea>
      <button onclick="commenter('${docSnap.id}')">Envoyer</button>
    `;
    container.appendChild(capsuleDiv);

    // Compter la lecture
    const capsuleRef = doc(db, "capsules", docSnap.id);
    await updateDoc(capsuleRef, { lectures: increment(1) });
  });
}

window.voter = async function (id, type) {
  const capsuleRef = doc(db, "capsules", id);
  const field = type === "up" ? "votes_up" : "votes_down";
  await updateDoc(capsuleRef, { [field]: increment(1) });
  location.reload();
};

window.commenter = async function (id) {
  const textarea = document.getElementById("comment-" + id);
  const text = textarea.value.trim();
  if (!text) return;
  const capsuleRef = doc(db, "capsules", id);
  await updateDoc(capsuleRef, {
    commentaires: arrayUnion(text)
  });
  alert("Commentaire ajouté.");
  textarea.value = "";
};

afficherCapsules();

// Fonction de vote +
window.voteUp = async function(id) {
  const docRef = doc(db, "capsules", id);
  await updateDoc(docRef, {
    votes_up: increment(1)
  });
  document.getElementById(`vote-${id}`).innerText = "👍 vote en cours...";
  setTimeout(() => window.location.reload(), 600);
};

// Fonction de vote -
window.voteDown = async function(id) {
  const docRef = doc(db, "capsules", id);
  await updateDoc(docRef, {
    votes_down: increment(1)
  });
  document.getElementById(`vote-${id}`).innerText = "👎 vote en cours...";
  setTimeout(() => window.location.reload(), 600);
};

// Fonction lecture
window.incrementLectures = async function(id) {
  const docRef = doc(db, "capsules", id);
  await updateDoc(docRef, {
    lectures: increment(1)
  });
  document.getElementById(`lect-${id}`).innerText = "Lecture en cours...";
  setTimeout(() => window.location.reload(), 800);
};
