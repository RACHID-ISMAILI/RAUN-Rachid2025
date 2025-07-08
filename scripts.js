
// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function afficherCapsules() {
  const container = document.getElementById("capsules");
  db.collection("capsules").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const capsuleId = doc.id;
      const dejaVote = localStorage.getItem("vote_" + capsuleId);

      // HTML de la capsule
      const div = document.createElement("div");
      div.classList.add("capsule");

      const titre = document.createElement("h3");
      titre.innerText = data.titre;

      const texte = document.createElement("p");
      texte.innerText = data.texte;

      // Votes
      const votes = document.createElement("div");
      const btnUp = document.createElement("button");
      btnUp.innerText = "👍";
      btnUp.disabled = dejaVote;
      btnUp.onclick = () => voter(capsuleId, true, btnUp, btnDown, compteur);

      const btnDown = document.createElement("button");
      btnDown.innerText = "👎";
      btnDown.disabled = dejaVote;
      btnDown.onclick = () => voter(capsuleId, false, btnUp, btnDown, compteur);

      const compteur = document.createElement("span");
      compteur.innerText = " Votes: " + (data.votes || 0);

      votes.appendChild(btnUp);
      votes.appendChild(btnDown);
      votes.appendChild(compteur);

      // Commentaires
      const commentaireSection = document.createElement("div");
      commentaireSection.innerHTML = "<h4>Commentaires :</h4>";
      const commentaireList = document.createElement("ul");
      (data.commentaires || []).forEach((c) => {
        const li = document.createElement("li");
        li.textContent = c;
        commentaireList.appendChild(li);
      });

      // Formulaire commentaire
      const input = document.createElement("input");
      input.placeholder = "Laisser un commentaire";
      const btnComment = document.createElement("button");
      btnComment.innerText = "Envoyer";
      btnComment.onclick = () => {
        const val = input.value.trim();
        if (val) {
          db.collection("capsules").doc(capsuleId).update({
            commentaires: firebase.firestore.FieldValue.arrayUnion(val)
          }).then(() => {
            const li = document.createElement("li");
            li.textContent = val;
            commentaireList.appendChild(li);
            input.value = "";
          });
        }
      };

      commentaireSection.appendChild(commentaireList);
      commentaireSection.appendChild(input);
      commentaireSection.appendChild(btnComment);

      div.appendChild(titre);
      div.appendChild(texte);
      div.appendChild(votes);
      div.appendChild(commentaireSection);

      container.appendChild(div);

      // Incrémentation lecture
      db.collection("capsules").doc(capsuleId).update({
        lectures: firebase.firestore.FieldValue.increment(1)
      });
    });
  });
}

function voter(id, positif, btnUp, btnDown, compteur) {
  const voteKey = "vote_" + id;
  if (localStorage.getItem(voteKey)) return;

  const increment = firebase.firestore.FieldValue.increment(1);
  db.collection("capsules").doc(id).update({
    votes: increment
  }).then(() => {
    const current = parseInt(compteur.innerText.replace(" Votes: ", ""));
    compteur.innerText = " Votes: " + (current + 1);
    localStorage.setItem(voteKey, "true");
    btnUp.disabled = true;
    btnDown.disabled = true;
  });
}

document.addEventListener("DOMContentLoaded", afficherCapsules);
