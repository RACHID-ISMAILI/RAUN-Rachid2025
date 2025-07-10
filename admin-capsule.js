// admin-capsule.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ADMIN_EMAIL = "admin@raun.com";
const ADMIN_PASS = "raun2025";

window.loginAdmin = function() {
  const email = document.getElementById('adminEmail').value.trim();
  const pass = document.getElementById('adminPassword').value.trim();
  if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminPanel').style.display = '';
    loadCapsulesAdmin();
  } else {
    document.getElementById('loginError').innerText = "Identifiants invalides !";
  }
};

window.logoutAdmin = function() {
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('loginBox').style.display = '';
};

async function loadCapsulesAdmin() {
  const capsulesList = document.getElementById("capsulesList");
  capsulesList.innerHTML = "Chargement…";
  const querySnapshot = await getDocs(collection(db, "capsules"));
  let html = "";
  querySnapshot.forEach(docSnap => {
    const d = docSnap.data();
    html += `
      <div class="capsule">
        <b>${d.titre || '(Sans titre)'}</b><br>
        <small>${d.contenu || ''}</small><br>
        Votes: ${d.votes_up || 0} 👍 / ${d.votes_down || 0} 👎 — Lectures: ${d.lectures || 0}<br>
        <button onclick="deleteCapsule('${docSnap.id}')">🗑️ Supprimer</button>
      </div>
    `;
  });
  capsulesList.innerHTML = html || "<i>Aucune capsule.</i>";
}

window.deleteCapsule = async function(id) {
  if (confirm("Supprimer définitivement cette capsule ?")) {
    await deleteDoc(doc(db, "capsules", id));
    loadCapsulesAdmin();
  }
};

// Ajout capsule
document.getElementById("addCapsuleForm").onsubmit = async function(e) {
  e.preventDefault();
  const titre = document.getElementById("capsTitle").value.trim();
  const contenu = document.getElementById("capsContent").value.trim();
  if (!titre || !contenu) return;
  await addDoc(collection(db, "capsules"), {
    titre, contenu, votes_up: 0, votes_down: 0, lectures: 0, commentaires: []
  });
  document.getElementById("capsTitle").value = "";
  document.getElementById("capsContent").value = "";
  loadCapsulesAdmin();
};

window.loadCapsulesAdmin = loadCapsulesAdmin;
