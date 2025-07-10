import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.subscribe = function () {
  const email = document.getElementById("subscribeEmail").value.trim();
  if (email) alert("Merci pour votre abonnement : " + email);
};

// Pour limiter à 1 vote par visiteur (simple, par LocalStorage)
function hasVoted(id) {
  const votes = JSON.parse(localStorage.getItem("votes") || "{}");
  return votes[id];
}
function setVoted(id) {
  const votes = JSON.parse(localStorage.getItem("votes") || "{}");
  votes[id] = true;
  localStorage.setItem("votes", JSON.stringify(votes));
}

async function afficherCapsules() {
  const container = document.getElementById("capsulesContainer");
  const querySnapshot = await getDocs(collection(db, "capsules"));
  container.innerHTML = "";
  querySnapshot.forEach(async (docSnap) => {
    const data = docSnap.data();
    const capsuleId = docSnap.id;
    // Incrémente lectures une seule fois par affichage (évite l'abus via LocalStorage)
    if (!localStorage.getItem("read-" + capsuleId)) {
      const capsuleRef = doc(db, "capsules", capsuleId);
      await updateDoc(capsuleRef, { lectures: increment(1) });
      localStorage.setItem("read-" + capsuleId, "1");
    }

    // Création du bloc capsule
    const capsuleDiv = document.createElement("div");
    capsuleDiv.className = "capsule";
    capsuleDiv.innerHTML = `
      <h2>${data.titre || ''}</h2>
      <p>${data.contenu || ''}</p>
      <div>
        <button onclick="voter('${capsuleId}', 'up')" ${hasVoted(capsuleId) ? "disabled" : ""}>👍</button>
        <button onclick="voter('${capsuleId}', 'down')" ${hasVoted(capsuleId) ? "disabled" : ""}>👎</button>
      </div>
      <div>Votes : ${data.votes_up || 0} 👍 / ${data.votes_down || 0} 👎</div>
      <div>Lectures : ${data.lectures || 0}</div>
      <div>
        <textarea id="comment-${capsuleId}" placeholder="Écrire un commentaire…"></textarea>
        <button onclick="commenter('${capsuleId}')">Envoyer</button>
      </div>
      <div id="commentaires-${capsuleId}" class="commentaires"></div>
    `;
    container.appendChild(capsuleDiv);

    // Afficher les commentaires (s'ils existent)
    if (Array.isArray(data.commentaires) && data.commentaires.length > 0) {
      const commBlock = capsuleDiv.querySelector("#commentaires-" + capsuleId);
      commBlock.innerHTML = "<b>Commentaires :</b><br>" + data.commentaires.map(c => `<div>— ${c}</div>`).join("");
    }
  });
}

window.voter = async function (id, type) {
  if (hasVoted(id)) {
    alert("Vous avez déjà voté pour cette capsule.");
    return;
  }
  const capsuleRef = doc(db, "capsules", id);
  const field = type === "up" ? "votes_up" : "votes_down";
  await updateDoc(capsuleRef, { [field]: increment(1) });
  setVoted(id);
  afficherCapsules();
};

window.commenter = async function (id) {
  const textarea = document.getElementById("comment-" + id);
  const text = textarea.value.tri
