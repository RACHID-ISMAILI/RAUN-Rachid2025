import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

document.addEventListener("DOMContentLoaded", async () => {
  const capsuleRef = doc(db, "capsules", "capsule1");

  const docSnap = await getDoc(capsuleRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("capsuleText").textContent = data.text;
    document.getElementById("voteCount").textContent = `Votes : ${data.up || 0} 👍 / ${data.down || 0} 👎`;
    document.getElementById("readCount").textContent = `Lue : ${data.reads || 0} fois`;
    await updateDoc(capsuleRef, { reads: increment(1) });
  }
});

window.vote = async (type) => {
  const capsuleRef = doc(db, "capsules", "capsule1");
  await updateDoc(capsuleRef, { [type]: increment(1) });
  location.reload();
};

window.sendComment = () => {
  const input = document.getElementById("commentInput").value;
  if (input) alert("Commentaire envoyé : " + input); // Simplicité, Firebase en étape suivante
};