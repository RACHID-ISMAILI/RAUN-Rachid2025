const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

// --- Caractères Matrix (chiffres, lettres, katakana pour l'ambiance Matrix) ---
const matrixChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアカサタナハマヤラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレヱゲゼデベペオコソトノホモヨロヲゴゾドボポヴッン";
const fontSize = 22;    // Taille du caractère (réaliste Matrix)
const columnSpacing = 21; // Distance horizontale entre colonnes (doit être >= fontSize pour espacer les colonnes)
let columns = 0;

// Taille du canvas toujours à la taille de la fenêtre
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

// Animation
function draw() {
  // Effet de fondu (pour garder les trainées)
  ctx.fillStyle = "rgba(0, 15, 4, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = "center";

  for (let i = 0; i < columns; i++) {
    // Choisir un caractère aléatoire
    const char = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
    // Calculer la position
    const x = i * columnSpacing + columnSpacing/2;
    const y = drops[i] * fontSize;

    // Effet vert lumineux
    ctx.shadowColor = "#b6ffca";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#21fd0e";
    ctx.fillText(char, x, y);

    // Tête du flux plus blanche/vert clair (pour Matrix)
    ctx.shadowBlur = 0;
    if (Math.random() > 0.95) {
      ctx.fillStyle = "#fff";
      ctx.fillText(char, x, y);
    }

    // Réinitialiser quand la ligne sort de l'écran
    if (y > canvas.height && Math.random() > 0.96) {
      drops[i] = 0;
    } else {
      drops[i] += Math.random() * 0.45 + 0.57; // Vitesse aléatoire, douce et fluide
    }
  }

  requestAnimationFrame(draw);
}
draw();
