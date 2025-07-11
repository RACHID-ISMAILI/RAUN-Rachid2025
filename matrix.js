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

  const letters = "アァカサタナハマヤャラワガザダバパABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
  const fontSize = 22;
  let columns, drops, speed;
  speed = 0.32; // <--- PLUS PETIT = PLUS LENT

  function initDrops() {
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let x = 0; x < columns; x++) drops[x] = Math.random() * canvas.height / fontSize;
  }
  initDrops();
  window.addEventListener('resize', initDrops);

  function draw() {
    ctx.fillStyle = "rgba(0, 10, 4, 0.16)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + "px monospace";
    ctx.fillStyle = "#00FF44";
    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      // Ici on augmente drops[i] très peu à chaque frame pour ralentir la pluie
      drops[i] += speed;
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
}
if(document.getElementById("matrixRain")) startMatrixRain();
