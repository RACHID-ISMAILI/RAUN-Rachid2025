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
  window.addEventListener('resize', resizeMatrix);

  const letters = "0123456789".split("");
  const fontSize = 24; // Taille bien lisible
  const spacing = 2;   // Espace entre les chiffres
  let columns, drops, speed;
  speed = 0.29; // Fluide et Matrix

  function initDrops() {
    columns = Math.floor(canvas.width / (fontSize + spacing));
    drops = [];
    for (let x = 0; x < columns; x++) drops[x] = Math.random() * canvas.height / fontSize;
  }
  initDrops();
  window.addEventListener('resize', initDrops);

  function draw() {
    // Fond noir semi-transparent (traînée Matrix)
    ctx.fillStyle = "rgba(0, 15, 6, 0.14)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;
    for (let i = 0; i < columns; i++) {
      let x = i * (fontSize + spacing);
      let y = drops[i] * fontSize;

      // Tête blanche
      ctx.fillStyle = "#fff";
      const headNum = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(headNum, x, y);

      // Traînée Matrix (plusieurs nuances vertes derrière la tête)
      for (let k = 1; k < 9; k++) {
        const fade = Math.max(0, 1 - k / 8);
        ctx.fillStyle = `rgba(57, 255, 20, ${0.35 * fade})`; // Vert Matrix, alpha décroissant
        const trailNum = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(trailNum, x, y - k * fontSize);
      }

      // Déplacement goutte
      drops[i] += speed;
      if (y > canvas.height && Math.random() > 0.978) drops[i] = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
}
if(document.getElementById("matrixRain")) startMatrixRain();
