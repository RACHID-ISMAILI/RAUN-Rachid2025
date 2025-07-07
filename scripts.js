
import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc, increment, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const capsuleRef = doc(db, "capsules", "capsule_1");

async function loadCapsule() {
  const capsuleSnap = await getDoc(capsuleRef);
  if (capsuleSnap.exists()) {
    const data = capsuleSnap.data();
    document.getElementById("capsuleText").innerText = data.texte || "Capsule vide.";
    document.getElementById("voteCount").innerText = `Votes : ${data.upVotes || 0} 👍 / ${data.downVotes || 0} 👎`;
    document.getElementById("readCount").innerText = `Lue : ${data.readCount || 0} fois`;
    await updateDoc(capsuleRef, { readCount: increment(1) });
  }
}

document.getElementById("upVote").onclick = () => updateDoc(capsuleRef, { upVotes: increment(1) });
document.getElementById("downVote").onclick = () => updateDoc(capsuleRef, { downVotes: increment(1) });
document.getElementById("sendComment").onclick = async () => {
  const message = document.getElementById("commentInput").value;
  if (message.trim()) {
    await addDoc(collection(capsuleRef, "comments"), { message, date: new Date() });
    document.getElementById("commentInput").value = "";
  }
};

onSnapshot(collection(capsuleRef, "comments"), (snapshot) => {
  const section = document.getElementById("commentsSection");
  section.innerHTML = "";
  snapshot.forEach(doc => {
    const p = document.createElement("p");
    p.innerText = doc.data().message;
    section.appendChild(p);
  });
});

loadCapsule();
