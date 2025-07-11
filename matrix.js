const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

// -- CHOIX DES CARACTÈRES (chiffres + lettres)
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// -- TAILLE ET NOMBRE DE COLONNES
const fontSize = 28; // taille des caractères
const columnSpacing = 34; // espace horizontal entre colonnes
let columns;

// -- Initialisation dimensions canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / columnSpacing);
}
resizeCanvas();
window.onresize = resizeCanvas;

// -- Lignes de chaque colonne (position verticale)
let drops = [];
function initDrops() {
  drops = [];
  for (let i = 0; i < columns; i++) {
    // Position aléatoire de départ pour chaque colonne
    drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
  }
}
initDrops();
window.onresize = () => {
  resizeCanvas();
  initDrops();
};

// -- ANIMATION PRINCIPALE
function draw() {
  // Fait un fondu (effet traînée)
  ctx.fillStyle = 'rgba(10,24,8,0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + "px monospace";
  ctx.textAlign = "center";

  for (let i = 0; i < columns; i++) {
    // Prend un caractère au hasard
    const text = chars.charAt(Math.floor(Math.random() * chars.length));

    // Espace chaque colonne avec columnSpacing
    const x = i * columnSpacing + columnSpacing / 2;

    // Couleur du "glow" (vert matrix)
    ctx.shadowColor = "#00ff99";
    ctx.shadowBlur = 16;

    // Couleur du texte
    ctx.fillStyle = "#b8ffb1";
    ctx.fillText(text, x, drops[i] * fontSize);

    ctx.shadowBlur = 0;

    // Mouvement doux
    if (Math.random() > 0.99) {
      drops[i] = 0;
    }
    drops[i] += 0.33; // **Vitesse lente, souple**
    if (drops[i] * fontSize > canvas.height) {
      drops[i] = 0;
    }
  }

  requestAnimationFrame(draw);
}
draw();
