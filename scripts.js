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
    const capsuleDiv = document.createElement("div");
    capsuleDiv.className = "capsule-block";
    capsuleDiv.innerHTML = `
      <h2>${data.titre || "(Sans titre)"}</h2>
      <p>${data.contenu || ""}</p>
      <div class="votes">
        <button onclick="voter('${docSnap.id}', 'up')">👍</button>
        <button onclick="voter('${docSnap.id}', 'down')">👎</button>
        Votes : ${data.votes_up || 0} 👍 / ${data.votes_down || 0} 👎
      </div>
      <div class="lectures">Lectures : ${data.lectures || 0}</div>
      <textarea id="comment-${docSnap.id}" placeholder="Écrire un commentaire…"></textarea>
      <button onclick="commenter('${docSnap.id}')">Envoyer</button>
      <div class="commentaires" id="comments-${docSnap.id}"></div>
    `;
    container.appendChild(capsuleDiv);

    // Ajout lecture
    const capsuleRef = doc(db, "capsules", docSnap.id);
    await updateDoc(capsuleRef, { lectures: increment(1) });

    // Afficher commentaires si présents
    if (data.commentaires && Array.isArray(data.commentaires)) {
      document.getElementById(`comments-${docSnap.id}`).innerHTML =
        "<b>Commentaires :</b><br>" +
        data.commentaires.map(c => `<span>— ${c}</span>`).join("<br>");
    }
  });
}

window.voter = async function (id, type) {
  const capsuleRef = doc(db, "capsules", id);
  const field = type === "up" ? "votes_up" : "votes_down";
  await updateDoc(capsuleRef, { [field]: increment(1) });
  location.reload();
};

window.commenter = async function (id) {
  const textarea = document.getElementById("comment-" + id);
  const text = textarea.value.trim();
  if (!text) return;
  const capsuleRef = doc(db, "capsules", id);
  await updateDoc(capsuleRef, {
    commentaires: arrayUnion(text)
  });
  alert("Commentaire ajouté.");
  textarea.value = "";
  location.reload();
};

afficherCapsules();
