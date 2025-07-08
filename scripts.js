
// Exemple simplifié du script avec la fonction de vote corrigée

function afficherCapsules() {
  const container = document.getElementById("capsules-container");
  container.innerHTML = ''; // Clear before refill
  
  // Exemple capsule à afficher
  const capsules = [
    { id: "1", titre: "Capsule 1", contenu: "Texte inspirant", votes: 0 }
  ];
  
  capsules.forEach(capsule => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${capsule.titre}</h3>
      <p>${capsule.contenu}</p>
      <button onclick="voterCapsule(event, '${capsule.id}', true)">👍</button>
      <button onclick="voterCapsule(event, '${capsule.id}', false)">👎</button>
      <span id="vote-${capsule.id}">Votes: ${capsule.votes}</span>
    `;
    container.appendChild(div);
  });
}

function voterCapsule(event, id, vote) {
  event.preventDefault(); // Empêche le rechargement
  console.log(`Vote ${vote ? "positif" : "négatif"} pour la capsule ${id}`);
  const voteElement = document.getElementById(`vote-${id}`);
  if (voteElement) {
    // simulation d'incrément
    let current = parseInt(voteElement.textContent.replace(/\D/g, '')) || 0;
    voteElement.textContent = "Votes: " + (current + 1);
  }
}

window.onload = afficherCapsules;
