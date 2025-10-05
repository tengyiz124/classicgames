// --- Pong Game --- //

const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Set size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Paddles
const paddleWidth = 20;
const paddleHeight = 100;
const player1 = { x: 20, y: canvas.height / 2 - 50, dy: 0, score: 0 };
const player2 = { x: canvas.width - 40, y: canvas.height / 2 - 50, dy: 0, score: 0 };

// Ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 12,
  speed: 6,
  dx: 6 * (Math.random() > 0.5 ? 1 : -1),
  dy: 4 * (Math.random() > 0.5 ? 1 : -1),
  color: "white"
};

// Input
document.addEventListener("keydown", e => {
  if (e.key === "w") player1.dy = -8;
  if (e.key === "s") player1.dy = 8;
  if (e.key === "ArrowUp") player2.dy = -8;
  if (e.key === "ArrowDown") player2.dy = 8;
});

document.addEventListener("keyup", e => {
  if (["w", "s"].includes(e.key)) player1.dy = 0;
  if (["ArrowUp", "ArrowDown"].includes(e.key)) player2.dy = 0;
});

// Draw paddle
function drawPaddle(p) {
  ctx.fillStyle = "limegreen";
  ctx.fillRect(p.x, p.y, paddleWidth, paddleHeight);
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
}

// Draw score
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${player1.score}   |   ${player2.score}`, canvas.width / 2, 50);
}

// Move everything
function move() {
  player1.y += player1.dy;
  player2.y += player2.dy;

  // Keep paddles in bounds
  player1.y = Math.max(0, Math.min(canvas.height - paddleHeight, player1.y));
  player2.y = Math.max(0, Math.min(canvas.height - paddleHeight, player2.y));

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall bounce
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (
    ball.x - ball.radius < player1.x + paddleWidth &&
    ball.y > player1.y &&
    ball.y < player1.y + paddleHeight
  ) {
    ball.dx = Math.abs(ball.dx);
  }

  if (
    ball.x + ball.radius > player2.x &&
    ball.y > player2.y &&
    ball.y < player2.y + paddleHeight
  ) {
    ball.dx = -Math.abs(ball.dx);
  }

  // Score
  if (ball.x - ball.radius < 0) {
    player2.score++;
    resetBall();
  }
  if (ball.x + ball.radius > canvas.width) {
    player1.score++;
    resetBall();
  }
}

// Reset after a goal
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 6 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Game over overlay
function drawGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 40);
  ctx.font = "28px Arial";
  ctx.fillText("Press 🔄 to restart", canvas.width / 2, canvas.height / 2 + 10);
}

// Main loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle(player1);
  drawPaddle(player2);
  drawBall();
  drawScore();
  move();

  // Win condition (optional)
  if (player1.score >= 10 || player2.score >= 10) {
    drawGameOver();
    return;
  }

  requestAnimationFrame(loop);
}

loop();
