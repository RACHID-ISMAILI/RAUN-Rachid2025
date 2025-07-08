import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("publishButton").addEventListener("click", async () => {
  const titre = document.getElementById("title").value.trim();
  const contenu = document.getElementById("content").value.trim();

  if (!titre || !contenu) {
    alert("Merci de remplir tous les champs.");
    return;
  }

  try {
    await addDoc(collection(db, "capsules"), {
      titre,
      contenu,
      date: serverTimestamp(),
      lectures: 0,
      votes_up: 0,
      votes_down: 0,
      commentaires: []
    });
    alert("Capsule ajoutée avec succès !");
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
  } catch (e) {
    alert("Erreur : " + e.message);
  }
});