import { db } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Récupère toutes les capsules et les affiche
async function afficherToutesLesCapsules() {
  const capsulesRef = collection(db, "capsules");
  const querySnapshot = await getDocs(capsulesRef);

  const main = document.querySelector("main");
  main.innerHTML = ""; // Nettoie le contenu précédent

  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const capsuleId = docSnap.id;

    const section = document.createElement("section");
    section.innerHTML = `
      <h2>🌟 ${data.title}</h2>
      <p>${data.content}</p>
      <div>
        <button onclick="vote('${capsuleId}', 'up')">👍</button>
        <button onclick="vote('${capsuleId}', 'down')">👎</button>
      </div>
      <div id="vote-${capsuleId}">Votes : ${data.votes_up || 0} 👍 / ${data.votes_down || 0} 👎</div>
      <div id="read-${capsuleId}">Lue : ${data.lues || 0} fois</div>
      <textarea id="comment-${capsuleId}" placeholder="Écrire un commentaire…"></textarea>
      <button onclick="sendComment('${capsuleId}')">Envoyer</button>
      <div id="comments-${capsuleId}"></div>
    `;
    main.appendChild(section);

    // Incrémente le compteur de lecture
    incrementReadCount(capsuleId);
  });
}

// Incrémente le compteur de lecture
async function incrementReadCount(id) {
  const capsuleRef = doc(db, "capsules", id);
  await updateDoc(capsuleRef, {
    lues: increment(1)
  });
}

// Vote 👍👎
window.vote = async function(id, type) {
  const capsuleRef = doc(db, "capsules", id);
  const field = type === 'up' ? 'votes_up' : 'votes_down';
  await updateDoc(capsuleRef, {
    [field]: increment(1)
  });

  // Recharger les capsules pour mettre à jour les votes
  afficherToutesLesCapsules();
};

// Simule l'envoi de commentaires
window.sendComment = function(id) {
  const input = document.getElementById("comment-" + id);
  const content = input.value.trim();
  if (content) {
    const div = document.getElementById("comments-" + id);
    const p = document.createElement("p");
    p.textContent = "💬 " + content;
    div.appendChild(p);
    input.value = "";
  }
};

// Initialise la page
afficherToutesLesCapsules();
