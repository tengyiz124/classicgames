// --- Simple Pinball Game --- //

const canvas = document.getElementById("pinball");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 600;

let ball = {
  x: 250,
  y: 300,
  radius: 10,
  dx: 2,
  dy: -4,
  color: "yellow"
};

let paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 30,
  width: 80,
  height: 10,
  color: "limegreen"
};

const bumpers = [
  { x: 150, y: 200, radius: 20 },
  { x: 250, y: 150, radius: 25 },
  { x: 350, y: 250, radius: 20 }
];

let score = 0;
let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
}

function drawPaddle() {
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBumpers() {
  bumpers.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffff";
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);
}

function update() {
  // Move paddle
  if (keys["ArrowLeft"] && paddle.x > 0) paddle.x -= 6;
  if (keys["ArrowRight"] && paddle.x < canvas.width - paddle.width) paddle.x += 6;

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall bounce
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.dx *= -1;
  if (ball.y - ball.radius < 0) ball.dy *= -1;

  // Paddle bounce
  if (
    ball.y + ball.radius > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.dy *= -1;
    score += 10;
  }

  // Bumper collisions
  bumpers.forEach(b => {
    const dist = Math.hypot(ball.x - b.x, ball.y - b.y);
    if (dist < ball.radius + b.radius) {
      ball.dy *= -1;
      ball.dx *= -1;
      score += 50;
    }
  });

  // Lose condition
  if (ball.y - ball.radius > canvas.height) {
    alert(`Game Over! Final Score: ${score}`);
    document.location.reload();
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBumpers();
  drawScore();
  update();
  requestAnimationFrame(loop);
}

loop();
