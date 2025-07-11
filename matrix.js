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

  const letters = "0123456789".split(""); // Chiffres uniquement
  const fontSize = 22;
  let columns, drops, speed;
  speed = 0.31;

  function initDrops() {
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let x = 0; x < columns; x++) drops[x] = Math.random() * canvas.height / fontSize;
  }
  initDrops();
  window.addEventListener('resize', initDrops);

  function draw() {
    // Fond noir semi-transparent (crée la traînée Matrix)
    ctx.fillStyle = "rgba(0, 12, 2, 0.16)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;
    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      // "Tête" blanche pour le chiffre qui tombe en tête de colonne
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      // Traînée verte néon
      ctx.fillStyle = "#08ff44";
      ctx.fillText(text, i * fontSize, (drops[i] - 1) * fontSize);

      drops[i] += speed;
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.977) drops[i] = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
}
if(document.getElementById("matrixRain")) startMatrixRain();
