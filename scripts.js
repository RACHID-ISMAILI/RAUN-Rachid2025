import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let capsules = [];
let currentIndex = 0;

// ---------------------------
// CHARGEMENT & NAVIGATION
// ---------------------------

async function fetchCapsules() {
  const querySnapshot = await getDocs(collection(db, "capsules"));
  capsules = [];
  querySnapshot.forEach(docSnap => {
    capsules.push({ id: docSnap.id, ...docSnap.data() });
  });
  // Trie par date si tu veux plus tard (optionnel)
  // capsules.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

async function afficherCapsule(index) {
  if (capsules.length === 0) {
    document.getElementById("capsulesContainer").innerHTML = "<div style='color:lime'>Aucune capsule pour le moment…</div>";
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
    <div class="capsule">
      <b>${data.titre || "(Sans titre)"}</b>
      <div class="capsule-content">${data.contenu || ""}</div>
      <div>
        <button onclick="window.voter('${id}', 'up')" ${canVote(id) ? "" : "disabled"}>👍</button>
        <button onclick="window.voter('${id}', 'down')" ${canVote(id) ? "" : "disabled"}>👎</button>
      </div>
      <div>Votes : ${data.votes_up || 0} 👍 / ${data.votes_down || 0} 👎</div>
      <div>Lectures : <span id="lect-${id}">${data.lectures || 0}</span></div>
      <textarea id="comment-${id}" placeholder="Écrire un commentaire…"></textarea>
      <button onclick="window.commenter('${id}')">Envoyer</button>
      <div class="commentaires"><b>Commentaires :</b><br>${commentairesHtml}</div>
    </div>
  `;

  incrementLecture(id); // Incrémente la lecture à l’affichage seulement
}

// Navigation gauche/droite
window.capsuleSuivante = function () {
  if (capsules.length === 0) return;
  afficherCapsule(currentIndex + 1);
};
window.capsulePrecedente = function () {
  if (capsules.length === 0) return;
  afficherCapsule(currentIndex - 1);
};

// ---------------------------
// VOTES, LECTURES, COMMENTAIRES
// ---------------------------

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

// ---------------------------
// ADMIN : AJOUT CAPSULE/ARTICLE
// ---------------------------

window.ajouterCapsule = async function() {
  const titre = document.getElementById("adminTitre").value.trim();
  const contenu = document.getElementById("adminContenu").value.trim();
  if (!titre || !contenu) return;
  await addDoc(collection(db, "capsules"), {
    titre, contenu, votes_up: 0, votes_down: 0, lectures: 0, commentaires: []
  });
  document.getElementById("adminTitre").value = "";
  document.getElementById("adminContenu").value = "";
  // Recharge la liste pour l’admin
  afficherListeAdmin();
};

// Affiche toutes les capsules dans l’admin
async function afficherListeAdmin() {
  await fetchCapsules();
  let html = "<h2>Capsules publiées</h2>";
  capsules.forEach(data => {
    html += `
      <div class="capsule-admin">
        <b>${data.titre || "(Sans titre)"}</b><br>
        <div style="color:#caffdb;">${data.contenu || ""}</div>
        Votes : ${data.votes_up || 0} 👍 / ${data.votes_down || 0} 👎 — Lectures : ${data.lectures || 0}
      </div>
    `;
  });
  if (document.getElementById("capsulesList"))
    document.getElementById("capsulesList").innerHTML = html;
}

// Pour le formulaire d’abonnement (public)
window.subscribe = function () {
  const email = document.getElementById("subscribeEmail").value.trim();
  if (email) alert("Merci pour votre abonnement : " + email);
};

// Chargement initial (public & admin)
window.onload = async function () {
  await fetchCapsules();
  if (document.getElementById("capsulesContainer")) afficherCapsule(0);
  if (document.getElementById("capsulesList")) afficherListeAdmin();
};

// ---------------------------
// Effet Matrix intégré (pas besoin de matrix.js)
// ---------------------------

document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.createElement("canvas");
  canvas.id = "matrixRain";
  document.body.prepend(canvas);
  let ctx = canvas.getContext("2d");
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let fontSize = 16, cols = Math.floor(window.innerWidth / fontSize);
  let drops = Array(cols).fill(1);
  let chars = "アァイィウヴエカガキギクグケゲコゴサザシジスズセゼabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%&";
  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px monospace";
    ctx.fillStyle = "#00ff66";
    for (let i = 0; i < drops.length; i++) {
      let txt = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(txt, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.98)
        drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(drawMatrix, 42);
});
