
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.ajouterCapsule = async function () {
  const content = document.getElementById("capsuleContent").value.trim();
  const messageDiv = document.getElementById("messageAjout");
  if (!content) {
    messageDiv.textContent = "⚠️ Le contenu de la capsule est vide.";
    return;
  }
  try {
    await addDoc(collection(db, "capsules"), {
      texte: content,
      createdAt: serverTimestamp(),
      votesUp: 0,
      votesDown: 0,
      lectures: 0,
      commentaires: []
    });
    messageDiv.textContent = "✅ Capsule ajoutée avec succès !";
    document.getElementById("capsuleContent").value = "";
  } catch (e) {
    messageDiv.textContent = "❌ Erreur : " + e.message;
  }
}
