const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

const matrixChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 22;
const columnSpacing = 27;
let columns = 0;

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
    drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
  }
}
initDrops();

function draw() {
  // Traînée sombre pour effet de pluie Matrix
  ctx.fillStyle = "rgba(0, 15, 4, 0.18)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = "center";

  for (let i = 0; i < columns; i++) {
    const char = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
    const x = i * columnSpacing + columnSpacing/2;
    const y = drops[i] * fontSize;

    // Effet glow Matrix
    ctx.shadowColor = "#b6ffca";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#21fd0e";
    ctx.fillText(char, x, y);

    // Tête blanche/vert Matrix
    ctx.shadowBlur = 0;
    if (Math.random() > 0.97) {
      ctx.fillStyle = "#fff";
      ctx.fillText(char, x, y);
    }

    if (y > canvas.height && Math.random() > 0.96) {
      drops[i] = 0;
    } else {
      drops[i] += Math.random() * 0.09 + 0.07; // Vitesse Matrix TRÈS LENTE
    }
  }

  requestAnimationFrame(draw);
}
draw();
