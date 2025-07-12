import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let capsules = [];
let currentIndex = 0;

async function fetchCapsules() {
  const querySnapshot = await getDocs(collection(db, "capsules"));
  capsules = [];
  querySnapshot.forEach(docSnap => {
    capsules.push({ id: docSnap.id, ...docSnap.data() });
  });
  capsules.sort((a, b) => {
    const dateA = a.date ? (a.date.toMillis ? a.date.toMillis() : a.date) : 0;
    const dateB = b.date ? (b.date.toMillis ? b.date.toMillis() : b.date) : 0;
    return dateB - dateA;
  });
}

function canVote(id) {
  return !localStorage.getItem('voted_' + id);
}
function markVoted(id) {
  localStorage.setItem('voted_' + id, "1");
}

async function incrementLecture(id) {
  if (!sessionStorage.getItem('lu_' + id)) {
    await updateDoc(doc(db, "capsules", id), { lectures: increment(1) });
    sessionStorage.setItem('lu_' + id, "1");
  }
}

// Nouvelle fonction : construction capsule avec scroll interne
async function afficherCapsule(index) {
  if (capsules.length === 0) {
    document.getElementById("capsulesContainer").innerHTML = "<div>Aucune capsule pour le moment…</div>";
    return;
  }
  if (index < 0) index = capsules.length - 1;
  if (index >= capsules.length) index = 0;
  currentIndex = index;
  const data = capsules[currentIndex];
  const id = data.id;

  // Affichage des commentaires
  let commentairesHtml = "";
  if (Array.isArray(data.commentaires)) {
    commentairesHtml = data.commentaires.map(
      c => `<div class="comment">${typeof c === "string" ? c : (c.texte || JSON.stringify(c))}</div>`
    ).join("");
  }

  document.getElementById("capsulesContainer").innerHTML = `
    <div class="capsule" style="display:flex; flex-direction:column; height:55vh; max-height:55vh;">
      <div class="capsule-content" style="flex:1 1 0; overflow-y:auto; min-height:0;">
        <b>${data.titre || "(Sans titre)"}</b><br>
        <div style="margin: 10px 0 16px 0;">${data.contenu || ""}</div>
      </div>
      <div style="margin-top:9px;">
        <button onclick="window.voter('${id}', 'up')" ${canVote(id) ? "" : "disabled"}>👍</button>
        <button onclick="window.voter('${id}', 'down')" ${canVote(id) ? "" : "disabled"}>👎</button>
        <span>Votes : ${data.votes_up || 0} 👍 / ${data.votes_down || 0} 👎</span>
        <span style="margin-left:16px;">Lectures : <span id="lect-${id}">${data.lectures || 0}</span></span>
      </div>
      <textarea id="comment-${id}" placeholder="Écrire un commentaire…" class="comment-textarea" style="margin-top:12px;"></textarea>
      <button onclick="window.commenter('${id}')" style="margin-top:7px;">Envoyer</button>
      <div class="commentaires" style="max-height:16vh; overflow-y:auto; margin-top:7px;"><b>Commentaires :</b><br>${commentairesHtml}</div>
    </div>
  `;

  incrementLecture(id);
}

window.onload = async function() {
  await fetchCapsules();
  afficherCapsule(0);

  document.getElementById("prevCapsule").onclick = () => {
    afficherCapsule(currentIndex - 1);
  };
  document.getElementById("nextCapsule").onclick = () => {
    afficherCapsule(currentIndex + 1);
  };
};

window.voter = async function(id, type) {
  if (!canVote(id)) return;
  const capsuleRef = doc(db, "capsules", id);
  const field = type === "up" ? "votes_up" : "votes_down";
  await updateDoc(capsuleRef, { [field]: increment(1) });
  markVoted(id);
  await fetchCapsules();
  afficherCapsule(currentIndex);
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
  await fetchCapsules();
  afficherCapsule(currentIndex);
};

window.subscribe = function () {
  const email = document.getElementById("subscribeEmail").value.trim();
  if (email) alert("Merci pour votre abonnement : " + email);
};
