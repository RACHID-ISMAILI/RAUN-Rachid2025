// matrix.js - Matrix effet très souple et fluide, chiffres bien séparés

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

// Pour chaque colonne, la position actuelle (en lignes)
for (let i = 0; i < columns; i++) {
  drops[i] = Math.floor(Math.random() * height / fontSize);
}

// ----- Variables pour ralentir -----
let lastUpdate = 0;
const speed = 42; // en ms : plus grand = plus lent (essaie 30, 40, 55...)

function draw(now) {
  // Contrôle de la vitesse très souple
  if (now - lastUpdate < speed) {
    requestAnimationFrame(draw);
    return;
  }
  lastUpdate = now;

  ctx.fillStyle = "rgba(0, 30, 0, 0.22)";
  ctx.fillRect(0, 0, width, height);

  ctx.font = fontSize + "px monospace";
  ctx.textAlign = "center";
  for (let i = 0; i < columns; i++) {
    const text = digits[Math.floor(Math.random() * digits.length)];
    const x = i * fontSize + fontSize / 2;
    const y = drops[i] * fontSize;

    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#d8ffd0";
    ctx.globalAlpha = 0.96;
    ctx.fillText(text, x, y);

    // Avance la goutte, souplement
    if (y > height && Math.random() > 0.96) {
      drops[i] = 0;
    } else {
      drops[i] += 1; // Plus tu mets petit (0.5), plus c'est lent. Laisse 1 pour descente pixel par pixel
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

requestAnimationFrame(draw);
