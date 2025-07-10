import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Pour gérer le défilement des capsules ---
let capsulesData = [];
let currentIndex = 0;

async function chargerCapsules() {
  const querySnapshot = await getDocs(collection(db, "capsules"));
  capsulesData = [];
  querySnapshot.forEach((docSnap) => {
    capsulesData.push({ ...docSnap.data(), id: docSnap.id });
  });
}

function afficherCapsuleUnique(index) {
  const container = document.getElementById("capsulesContainer");
  if (capsulesData.length === 0) {
    container.innerHTML = "<div style='color:lime'>Aucune capsule</div>";
    return;
  }
  const data = capsulesData[index];
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
  // Ne pas incrémenter la lecture sur vote ou commentaire, seulement à l’affichage
  if (!sessionStorage.getItem('lu_' + data.id)) {
    updateDoc(doc(db, "capsules", data.id), { lectures: increment(1) });
    sessionStorage.setItem('lu_' + data.id, "1");
  }
}

// Pour défiler gauche/droite
window.capsuleSuivante = function () {
  if (capsulesData.length === 0) return;
  currentIndex = (currentIndex + 1) % capsulesData.length;
  afficherCapsuleUnique(currentIndex);
};
window.capsulePrecedente = function () {
  if (capsulesData.length === 0) return;
  currentIndex = (currentIndex - 1 + capsulesData.length) % capsulesData.length;
  afficherCapsuleUnique(currentIndex);
};

// Limite : empêcher plusieurs votes (stocke un flag localStorage par capsule)
function canVote(id) {
  return !localStorage.getItem('voted_' + id);
}
function markVoted(id) {
  localStorage.setItem('voted_' + id, "1");
}

// --- Vote sans reload, n'incrémente PAS lectures ---
window.voter = async function(id, type) {
  if (!canVote(id)) return;
  const capsuleRef = doc(db, "capsules", id);
  const field = type === "up" ? "votes_up" : "votes_down";
  await updateDoc(capsuleRef, { [field]: increment(1) });
  markVoted(id);
  await chargerCapsules();
  afficherCapsuleUnique(currentIndex);
};

// --- Commenter sans reload ---
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
  afficherCapsuleUnique(currentIndex);
};

window.subscribe = function () {
  const email = document.getElementById("subscribeEmail").value.trim();
  if (email) alert("Merci pour votre abonnement : " + email);
};

// Chargement initial
window.onload = async function () {
  await chargerCapsules();
  afficherCapsuleUnique(currentIndex);
};

// ---- Matrix pluie (canvas intégré) ----
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
  let chars = "アァイィウヴエカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲンabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%&";
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
