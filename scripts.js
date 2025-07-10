import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let capsulesData = [];
let currentIndex = 0;

async function chargerCapsules() {
  const querySnapshot = await getDocs(collection(db, "capsules"));
  capsulesData = [];
  querySnapshot.forEach(docSnap => {
    capsulesData.push({ id: docSnap.id, ...docSnap.data() });
  });
  afficherCapsule();
}

function afficherCapsule() {
  const container = document.getElementById("capsulesContainer");
  container.innerHTML = "";
  if (capsulesData.length === 0) return container.innerHTML = "<i>Aucune capsule.</i>";

  const data = capsulesData[currentIndex];
  let commentairesHtml = "";
  if (Array.isArray(data.commentaires)) {
    commentairesHtml = data.commentaires.map(
      c => `<div class="comment">${typeof c === "string" ? c : (c.texte || JSON.stringify(c))}</div>`
    ).join("");
  }
  container.innerHTML = `
    <div class="capsule">
      <b>${data.titre || "(Sans titre)"}</b><br>
      <div>${data.contenu || ""}</div>
      <div>
        <button onclick="voter('${data.id}', 'up')" ${canVote(data.id) ? "" : "disabled"}>👍</button>
        <button onclick="voter('${data.id}', 'down')" ${canVote(data.id) ? "" : "disabled"}>👎</button>
      </div>
      <div>Votes : ${data.votes_up || 0} 👍 / ${data.votes_down || 0} 👎</div>
      <div>Lectures : <span id="lect-${data.id}">${data.lectures || 0}</span></div>
      <textarea id="comment-${data.id}" placeholder="Écrire un commentaire…"></textarea>
      <button onclick="commenter('${data.id}')">Envoyer</button>
      <div class="commentaires"><b>Commentaires :</b><br>${commentairesHtml}</div>
    </div>
  `;
  // Compter la lecture une seule fois par session par capsule (lorsqu'affichée)
  if (!sessionStorage.getItem('lu_' + data.id)) {
    updateDoc(doc(db, "capsules", data.id), { lectures: increment(1) });
    sessionStorage.setItem('lu_' + data.id, "1");
  }
}

window.voter = async function(id, type) {
  if (!canVote(id)) return;
  const capsuleRef = doc(db, "capsules", id);
  const field = type === "up" ? "votes_up" : "votes_down";
  await updateDoc(capsuleRef, { [field]: increment(1) });
  markVoted(id);
  await chargerCapsules();
  afficherCapsule();
};

window.commenter = async function(id) {
  const textarea = document.getElementById("comment-" + id);
  const text = textarea.value.trim();
  if (!text) return;
  const capsuleRef = doc(db, "capsules", id);
  await updateDoc(capsuleRef, {
    commentaires: arrayUnion({ texte: text, date: new Date().toISOString() })
  });
  textarea.value = "";
  await chargerCapsules();
  afficherCapsule();
};

function canVote(id) {
  return !localStorage.getItem('voted_' + id);
}
function markVoted(id) {
  localStorage.setItem('voted_' + id, "1");
}

// Carousel navigation
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("prevCapsule").onclick = () => {
    if (currentIndex > 0) currentIndex--;
    else currentIndex = capsulesData.length - 1;
    afficherCapsule();
  };
  document.getElementById("nextCapsule").onclick = () => {
    if (currentIndex < capsulesData.length - 1) currentIndex++;
    else currentIndex = 0;
    afficherCapsule();
  };
  chargerCapsules();
});

window.subscribe = function () {
  const email = document.getElementById("subscribeEmail").value.trim();
  if (email) alert("Merci pour votre abonnement : " + email);
};
