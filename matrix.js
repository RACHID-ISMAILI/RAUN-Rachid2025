const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

// -- CHOIX DES CARACTÈRES (chiffres + lettres)
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 28; // Taille du caractère
const verticalSpacing = 46; // <--- espace vertical ENTRE les caractères
const columnSpacing = 34;
let columns;

// Ajuste la taille du canvas et le nombre de colonnes
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / columnSpacing);
}
resizeCanvas();
window.onresize = resizeCanvas;

let drops = [];
function initDrops() {
  drops = [];
  for (let i = 0; i < columns; i++) {
    // Décalage de départ aléatoire pour la fluidité
    drops[i] = Math.floor(Math.random() * canvas.height / verticalSpacing);
  }
}
initDrops();
window.onresize = () => { resizeCanvas(); initDrops(); };

// -- ANIMATION
function draw() {
  ctx.fillStyle = 'rgba(10,24,8,0.18)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + "px monospace";
  ctx.textAlign = "center";

  for (let i = 0; i < columns; i++) {
    let y = drops[i] * verticalSpacing;
    // Caractère aléatoire
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    const x = i * columnSpacing + columnSpacing / 2;

    // Effet glow matrix
    ctx.shadowColor = "#00ff99";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#b8ffb1";
    ctx.fillText(text, x, y);

    ctx.shadowBlur = 0;

    // "descente" douce
    if (y > canvas.height && Math.random() > 0.98) {
      drops[i] = 0;
    } else {
      drops[i] += 0.27; // vitesse lente/souple
    }
  }

  requestAnimationFrame(draw);
}
draw();
