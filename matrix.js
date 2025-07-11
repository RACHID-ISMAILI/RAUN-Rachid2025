// matrix.js - Effet Matrix style film, chiffres en colonnes espacées et clairs

const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const fontSize = 28;
const columns = Math.floor(width / fontSize);
const drops = [];
const digits = "0123456789";

for (let i = 0; i < columns; i++) {
  drops[i] = Math.floor(Math.random() * height / fontSize);
}

function draw() {
  ctx.fillStyle = "rgba(0, 30, 0, 0.22)"; // léger voile vert/noir transparent
  ctx.fillRect(0, 0, width, height);

  ctx.font = fontSize + "px monospace";
  ctx.textAlign = "center";
  for (let i = 0; i < columns; i++) {
    const text = digits[Math.floor(Math.random() * digits.length)];
    const x = i * fontSize + fontSize / 2;
    const y = drops[i] * fontSize;

    // Effet vert Matrix net
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#d8ffd0";
    ctx.globalAlpha = 0.96;
    ctx.fillText(text, x, y);

    // Avance la goutte, réinitialise parfois pour éviter superposition
    if (y > height && Math.random() > 0.965) {
      drops[i] = 0;
    } else {
      drops[i]++;
    }
  }
  ctx.globalAlpha = 1.0;
  ctx.shadowBlur = 0;

  requestAnimationFrame(draw);
}

function resizeMatrix() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resizeMatrix);

draw();
