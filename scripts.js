
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function afficherToutesLesCapsules() {
  const capsuleContainer = document.querySelector("main");
  capsuleContainer.innerHTML = "";

  const q = query(collection(db, "capsules"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const capsuleId = docSnap.id;

    const capsuleDiv = document.createElement("div");
    capsuleDiv.classList.add("capsule");

    capsuleDiv.innerHTML = `
      <h2>🌟 ${data.titre}</h2>
      <p>${data.contenu}</p>
      <div>
        <button onclick="vote('${capsuleId}', 'up')">👍</button>
        <button onclick="vote('${capsuleId}', 'down')">👎</button>
      </div>
      <div id="voteCount-${capsuleId}">Votes : ${data.votes_up} 👍 / ${data.votes_down} 👎</div>
      <div id="readCount-${capsuleId}">Lue : ${data.lectures} fois</div>
      <textarea id="commentInput-${capsuleId}" placeholder="Écrire un commentaire…"></textarea>
      <button onclick="sendComment('${capsuleId}')">Envoyer</button>
      <div id="commentsSection-${capsuleId}">
        ${data.commentaires?.map(c => `<p>${c}</p>`).join("") || ""}
      </div>
    `;

    capsuleContainer.appendChild(capsuleDiv);

    // Incrément des lectures
    updateDoc(doc(db, "capsules", capsuleId), {
      lectures: increment(1)
    });
  });
}

window.vote = async function(id, type) {
  const champ = type === "up" ? "votes_up" : "votes_down";
  await updateDoc(doc(db, "capsules", id), {
    [champ]: increment(1)
  });
  afficherToutesLesCapsules();
};

window.sendComment = async function(id) {
  const input = document.getElementById(`commentInput-${id}`);
  const newComment = input.value.trim();
  if (!newComment) return;

  const docRef = doc(db, "capsules", id);
  const snap = await getDocs(query(collection(db, "capsules")));
  const oldData = snap.docs.find(d => d.id === id).data();
  const newComments = [...(oldData.commentaires || []), newComment];

  await updateDoc(docRef, { commentaires: newComments });
  input.value = "";
  afficherToutesLesCapsules();
};

afficherToutesLesCapsules();
