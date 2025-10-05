// --- Flappy Bird --- //

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Fit canvas to screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let bird = { x: 80, y: canvas.height / 2, radius: 20, velocity: 0, gravity: 0.6, jump: -10 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Handle input
document.addEventListener("keydown", flap);
document.addEventListener("touchstart", flap);

function flap() {
  if (!gameOver) {
    bird.velocity = bird.jump;
  } else {
    document.location.reload();
  }
}

function drawBird() {
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.strokeStyle = "orange";
  ctx.stroke();
}

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    const p = pipes[i];
    ctx.fillStyle = "green";
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
  }
}

function createPipe() {
  const gap = 160;
  const top = Math.random() * (canvas.height / 2);
  const bottom = canvas.height - top - gap;
  pipes.push({ x: canvas.width, width: 70, top, bottom });
}

function updatePipes() {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 4;
    if (pipes[i].x + pipes[i].width < 0) {
      pipes.splice(i, 1);
      score++;
    }

    // Collision detection
    if (
      bird.x + bird.radius > pipes[i].x &&
      bird.x - bird.radius < pipes[i].x + pipes[i].width &&
      (bird.y - bird.radius < pipes[i].top || bird.y + bird.radius > canvas.height - pipes[i].bottom)
    ) {
      endGame();
    }
  }
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.radius >= canvas.height) {
    endGame();
  }

  if (bird.y - bird.radius <= 0) {
    bird.y = bird.radius;
    bird.velocity = 0;
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 20, 50);
}

function endGame() {
  gameOver = true;
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 40);
  ctx.font = "24px Arial";
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2);
  ctx.fillText("Press any key or tap to restart", canvas.width / 2, canvas.height / 2 + 40);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (frame % 100 === 0) createPipe();
  updatePipes();
  updateBird();

  drawPipes();
  drawBird();
  drawScore();

  if (!gameOver) {
    frame++;
    requestAnimationFrame(loop);
  }
}

loop();
