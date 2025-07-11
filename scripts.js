window.ajouterCapsulePublic = async function() {
  const titre = document.getElementById("publicTitre").value.trim();
  const contenu = document.getElementById("publicContenu").value.trim();
  if (!titre || !contenu) {
    document.getElementById("publicAjoutMsg").innerText = "Titre et contenu obligatoires !";
    return;
  }
  await addDoc(collection(db, "capsules"), {
    titre, contenu, votes_up: 0, votes_down: 0, lectures: 0, commentaires: []
  });
  document.getElementById("publicTitre").value = "";
  document.getElementById("publicContenu").value = "";
  document.getElementById("publicAjoutMsg").innerText = "Capsule publiée avec succès !";
  await fetchCapsules();
  afficherCapsule(currentIndex);
}
