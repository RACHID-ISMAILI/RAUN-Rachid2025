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

    // Affichage commentaires (objet OU string)
    let commentsHtml = '';
    if (Array.isArray(data.commentaires) && data.commentaires.length > 0) {
      commentsHtml = `<div class="comments-list"><b>Commentaires :</b>`;
      data.commentaires.forEach(c => {
        if (typeof c === 'object' && c.contenu) {
          commentsHtml += `<div class="comment">${c.contenu}</div>`;
        } else {
          commentsHtml += `<div class="comment">${c}</div>`;
        }
      });
      commentsHtml += `</div>`;
    }

    // Génération du HTML de la capsule
    capsuleDiv.innerHTML = `
      <h2>${data.titre}</h2>
      <p>${data.contenu}</p>
      <div id="vote-block-${id}"></div>
      <div id="votes-${id}">Votes : ${data.votes_up || 0} 👍 / ${data.votes_down || 0} 👎</div>
      <div>Lectures : ${data.lectures || 0}</div>
      <textarea id="comment-${id}" placeholder="Écrire un commentaire…"></textarea>
      <button type="button" onclick="commenter('${id}')">Envoyer</button>
      ${commentsHtml}
    `;
    // Ajoute les boutons de vote dans le bloc prévu
    const voteBlock = capsuleDiv.querySelector(`#vote-block-${id}`);
    voteBlock.appendChild(upBtn);
    voteBlock.appendChild(downBtn);

    container.appendChild(capsuleDiv);

    // Compter la lecture (optionnel, désactive si tu veux pas incrémenter à chaque affichage)
    const capsuleRef = doc(db, "capsules", id);
    await updateDoc(capsuleRef, { lectures: increment(1) });
  });
}

// Gère le commentaire
window.commenter = async function (id) {
  const textarea = document.getElementById("comment-" + id);
  const text = textarea.value.trim();
  if (!text) return;
  const capsuleRef = doc(db, "capsules", id);

  // On ajoute un commentaire objet {contenu, date}
  await updateDoc(capsuleRef, {
    commentaires: arrayUnion({
      contenu: text,
      date: new Date().toLocaleString()
    })
  });
  textarea.value = "";
  afficherCapsules(); // Rafraîchir la liste pour voir le nouveau commentaire
};

afficherCapsules();
