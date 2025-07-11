// matrix.js
function startMatrixRain() {
  const canvas = document.getElementById("matrixRain");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resizeMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeMatrix();
  window.addEventListener('resize', () => {
    resizeMatrix();
    initDrops();
  });

  const letters = "0123456789".split("");
  const fontSize = 24;
  const spacing = 4;   // Espace entre colonnes
  let columns, drops, speed, offsets;
  speed = 0.29;

  function initDrops() {
    columns = Math.floor(canvas.width / (fontSize + spacing));
    drops = [];
    offsets = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * canvas.height / fontSize;
      offsets[x] = Math.random() * fontSize; // Décalage vertical initial pour chaque colonne
    }
  }
  initDrops();

  function draw() {
    ctx.fillStyle = "rgba(0, 15, 6, 0.13)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;
    for (let i = 0; i < columns; i++) {
      let x = i * (fontSize + spacing);
      let y = drops[i] * fontSize + offsets[i];

      // Tête blanche
      ctx.fillStyle = "#fff";
      const headNum = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(headNum, x, y);

      // Traînée Matrix (plusieurs nuances vertes)
      for (let k = 1; k < 9; k++) {
        const fade = Math.max(0, 1 - k / 8);
        ctx.fillStyle = `rgba(57, 255, 20, ${0.35 * fade})`;
        const trailNum = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(trailNum, x, y - k * fontSize);
      }

      // Mouvement goutte
      drops[i] += speed;

      // Décalage vertical dynamique : vibration matrix (très discret)
      if (Math.random() > 0.995) offsets[i] = Math.random() * fontSize;

      if (y > canvas.height && Math.random() > 0.978) {
        drops[i] = 0;
        offsets[i] = Math.random() * fontSize;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}
if(document.getElementById("matrixRain")) startMatrixRain();
