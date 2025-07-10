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

// Chargement capsules + affichage
async function afficherCapsules() {
  const container = document.getElementById("capsulesContainer");
  const querySnapshot = await getDocs(collection(db, "capsules"));
  container.innerHTML = "";
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;

    // Affichage des commentaires (correction bug [object Object])
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
    // Compter la lecture une seule fois par session (pas à chaque reload)
    if (!sessionStorage.getItem('lu_' + id)) {
      updateDoc(doc(db, "capsules", id), { lectures: increment(1) });
      sessionStorage.setItem('lu_' + id, "1");
    }
  });
}

// Vote sans reloa
