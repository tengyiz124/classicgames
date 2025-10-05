const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 80,
  width: 50,
  height: 30,
  color: "limegreen",
  speed: 10
};

const bullets = [];
const enemies = [];
let score = 0;
let gameOver = false;

// Controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" || e.key === "a") player.x -= player.speed;
  if (e.key === "ArrowRight" || e.key === "d") player.x += player.speed;
  if (e.key === " " || e.key === "Spacebar") shoot();
});

function shoot() {
  bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10 });
}

// Enemy setup
const rows = 4;
const cols = 8;
const enemyWidth = 50;
const enemyHeight = 30;
const spacing = 20;
const startX = 80;
const startY = 80;
let enemyDirection = 1;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    enemies.push({
      x: startX + c * (enemyWidth + spacing),
      y: startY + r * (enemyHeight + spacing),
      width: enemyWidth,
      height: enemyHeight,
      color: "limegreen",
      alive: true
    });
  }
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw bullets
function drawBullets() {
  ctx.fillStyle = "white";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
}

// Draw enemies
function drawEnemies() {
  enemies.forEach(e => {
    if (e.alive) {
      ctx.fillStyle = e.color;
      ctx.fillRect(e.x, e.y, e.width, e.height);
    }
  });
}

// Move enemies
function moveEnemies() {
  let hitEdge = false;

  enemies.forEach(e => {
    if (!e.alive) return;
    e.x += enemyDirection * 3;
    if (e.x + e.width > canvas.width - 50 || e.x < 50) hitEdge = true;
  });

  if (hitEdge) {
    enemyDirection *= -1;
    enemies.forEach(e => (e.y += 20));
  }
}

// Update bullets
function updateBullets() {
  bullets.forEach(b => (b.y -= 10));

  // Remove off-screen bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].y < 0) bullets.splice(i, 1);
  }

  // Collision with enemies
  bullets.forEach((b, bi) => {
    enemies.forEach(e => {
      if (
        e.alive &&
        b.x < e.x + e.width &&
        b.x + b.width > e.x &&
        b.y < e.y + e.height &&
        b.y + b.height > e.y
      ) {
        e.alive = false;
        bullets.splice(bi, 1);
        score += 10;
      }
    });
  });
}

// Check game over
function checkGameOver() {
  enemies.forEach(e => {
    if (e.alive && e.y + e.height > player.y) {
      gameOver = true;
    }
  });

  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = "28px Arial";
    ctx.fillText("Press 🔄 to restart", canvas.width / 2, canvas.height / 2 + 20);
    cancelAnimationFrame(loop);
  }
}

// Draw score
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.fillText(`Score: ${score}`, 40, 40);
}

// Win screen
function checkWin() {
  if (enemies.every(e => !e.alive)) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "limegreen";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("You Win! 🎉", canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = "28px Arial";
    ctx.fillText("Press 🔄 to restart", canvas.width / 2, canvas.height / 2 + 20);
    cancelAnimationFrame(loop);
  }
}

// Main game loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  drawBullets();
  drawScore();

  moveEnemies();
  updateBullets();
  checkGameOver();
  checkWin();

  requestAnimationFrame(loop);
}

loop();
