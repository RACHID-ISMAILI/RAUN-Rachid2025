// scripts.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Limite : empêcher plusieurs votes (stocke un flag localStorage par capsule)
function canVote(id) {
  return !localStorage.getItem('voted_' + id);
}
function markVoted(id) {
  localStorage.setItem('voted_' + id, "1");
}

// --- Correction principale ici ---
async function afficherCapsules() {
  const container = document.getElementById("capsulesContainer");
  const querySnapshot = await getDocs(collection(db, "capsules"));
  container.innerHTML = "";
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;

    // Affichage commentaires
    let commentairesHtml = "";
    if (Array.isArray(data.commentaires)) {
      commentairesHtml = data.commentaires.map(
        c => `<div class="comment">${typeof c === "string" ? c : (c.texte || JSON.stringify(c))}</div>`
      ).join("");
    }

    container.innerHTML += `
      <div class="capsule">
        <b>${data.titre || "(Sans titre)"}</b><br>
        <div>${data.contenu || ""}</div>
        <div>
          <button onclick="voter('${id}', 'up')" ${canVote(id) ? "" : "disabled"}>👍</button>
          <button onclick="voter('${id}', 'down')" ${canVote(id) ? "" : "disabled"}>👎</button>
        </div>
        <div>Votes : ${data.votes_up || 0} 👍 / ${data.votes_down || 0} 👎</div>
        <div>Lectures : <span id="lect-${id}">${data.lectures || 0}</span></div>
        <textarea id="comment-${id}" placeholder="Écrire un commentaire…"></textarea>
        <button onclick="commenter('${id}')">Envoyer</button>
        <div class="commentaires"><b>Commentaires :</b><br>${commentairesHtml}</div>
      </div>
    `;

    // --- Ici : Compter la lecture AU CHARGEMENT, une seule fois par session ---
    if (!sessionStorage.getItem('lu_' + id)) {
      updateDoc(doc(db, "capsules", id), { lectures: increment(1) });
      sessionStorage.setItem('lu_' + id, "1");
      // Optionnel : mettre à jour l’affichage instantanément
      const spanLect = document.getElementById("lect-" + id);
      if (spanLect) spanLect.textContent = (data.lectures || 0) + 1;
    }
  });
}

// Vote (ne doit pas toucher lectures !)
window.voter = async function(id, type) {
  if (!canVote(id)) return;
  const capsuleRef = doc(db, "capsules", id);
  const field = type === "up" ? "votes_up" : "votes_down";
  await updateDoc(capsuleRef, { [field]: increment(1) });
  markVoted(id);
  afficherCapsules(); // Recharge juste la liste
};

// Commenter sans reload
window.commenter = async function(id) {
  const textarea = document.getElementById("comment-" + id);
  const text = textarea.value.trim();
  if (!text) return;
  const capsuleRef = doc(db, "capsules", id);
  await updateDoc(capsuleRef, {
    commentaires: arrayUnion({ texte: text, date: new Date().toISOString() })
  });
  textarea.value = "";
  afficherCapsules();
};

window.subscribe = function () {
  const email = document.getElementById("subscribeEmail").value.trim();
  if (email) alert("Merci pour votre abonnement : " + email);
};

window.onload = afficherCapsules;
