import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let capsulesData = [];
let currentCapsule = 0;

// Empêcher plusieurs votes
function canVote(id) { return !localStorage.getItem('voted_' + id); }
function markVoted(id) { localStorage.setItem('voted_' + id, "1"); }

// Affichage d'une capsule à l'index donné
function showCapsule(index) {
  const container = document.getElementById("capsulesContainer");
  if (capsulesData.length === 0) {
    container.innerHTML = "<i>Aucune capsule trouvée.</i>";
    return;
  }
  const data = capsulesData[index];
  const id = data.id;
  // Affichage commentaires propre
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
  // Lecture: incrémente une seule fois par session
  if (!sessionStorage.getItem('lu_' + id)) {
    updateDoc(doc(db, "capsules", id), { lectures: increment(1) });
    sessionStorage.setItem('lu_' + id, "1");
  }
}

// Chargement et navigation
async function afficherCapsules() {
  const querySnapshot = await getDocs(collection(db, "capsules"));
  capsulesData = [];
  querySnapshot.forEach((docSnap) => {
    capsulesData.push({ id: docSnap.id, ...docSnap.data() });
  });
  capsulesData.sort((a, b) => (b.date || "").localeCompare(a.date || "")); // Tri optionnel par date
  currentCapsule = 0;
  showCapsule(currentCapsule);
}

// Navigation boutons
window.onload = () => {
  afficherCapsules();
  document.getElementById("prevCapsule").onclick = () => {
    if (currentCapsule > 0) { currentCapsule--; showCapsule(currentCapsule);}
  };
  document.getElementById("nextCapsule").onclick = () => {
    if (currentCapsule < capsulesData.length - 1) { currentCapsule++; showCapsule(currentCapsule);}
  };
}

// Vote sans reload
window.voter = async function(id, type) {
  if (!canVote(id)) return;
  const capsuleRef = doc(db, "capsules", id);
  const field = type === "up" ? "votes_up" : "votes_down";
  await updateDoc(capsuleRef, { [field]: increment(1) });
  markVoted(id);
  afficherCapsules();
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

// S'abonner
window.subscribe = function () {
  const email = document.getElementById("subscribeEmail").value.trim();
  if (email) alert("Merci pour votre abonnement : " + email);
};

// Matrix pluie (canvas)
document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("matrixRain");
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
