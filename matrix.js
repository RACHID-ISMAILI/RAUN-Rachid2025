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
  const spacing = 4; // Espacement entre colonnes
  const trailLength = 10; // Longueur de la traînée
  let columns, drops, speed;
  speed = 0.29;

  function initDrops() {
    columns = Math.floor(canvas.width / (fontSize + spacing));
    drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * canvas.height / fontSize;
    }
  }
  initDrops();

  function draw() {
    ctx.fillStyle = "rgba(0, 15, 6, 0.13)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < columns; i++) {
      let x = i * (fontSize + spacing);

      // Pour chaque colonne, chaque chiffre de la traînée a un offset horizontal aléatoire (zigzag)
      for (let k = 0; k < trailLength; k++) {
        // Décalage horizontal aléatoire pour chaque chiffre (max +/-8px)
        let offsetX = (Math.random() - 0.5) * fontSize * 0.7;
        let realX = x + offsetX;

        // Position verticale du chiffre
        let y = (drops[i] - k) * fontSize;

        // Opacité dégressive pour la traînée, couleur tête blanche, reste vert Matrix
        let fade = Math.max(0, 1 - k / (trailLength - 1));
        if (k === 0) {
          ctx.fillStyle = "#fff"; // Tête blanche
        } else {
          ctx.fillStyle = `rgba(57, 255, 20, ${0.33 * fade})`; // Traînée Matrix verte
        }

        // Affichage du chiffre (si à l'écran)
        if (y > 0 && y < canvas.height) {
          const num = letters[Math.floor(Math.random() * letters.length)];
          ctx.fillText(num, realX, y);
        }
      }

      // Mouvement goutte
      drops[i] += speed;
      // Reset goutte en bas avec petit random
      if ((drops[i] - trailLength) * fontSize > canvas.height && Math.random() > 0.978) {
        drops[i] = 0;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}
if(document.getElementById("matrixRain")) startMatrixRain();
