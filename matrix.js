const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

// -- CHOIX DES CARACTÈRES (chiffres + lettres)
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 28; // Taille du caractère
const verticalSpacing = 62; // <--- écart très grand entre caractères
const columnSpacing = 34;
let columns;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / columnSpacing);
}
resizeCanvas();
window.onresize = () => { resizeCanvas(); initDrops(); };

let drops = [];
function initDrops() {
  drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * canvas.height / verticalSpacing);
  }
}
initDrops();

function draw() {
  ctx.fillStyle = 'rgba(10,24,8,0.18)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + "px monospace";
  ctx.textAlign = "center";

  for (let i = 0; i < columns; i++) {
    let y = drops[i] * verticalSpacing;
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    const x = i * columnSpacing + columnSpacing / 2;

    ctx.shadowColor = "#00ff99";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#b8ffb1";
    ctx.fillText(text, x, y);

    ctx.shadowBlur = 0;

    // Descente très très lente et douce
    if (y > canvas.height && Math.random() > 0.98) {
      drops[i] = 0;
    } else {
      drops[i] += 0.15; // encore plus lent
    }
  }

  requestAnimationFrame(draw);
}
draw();
