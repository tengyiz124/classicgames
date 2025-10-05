const canvas = document.getElementById("breakout");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddle = {
  width: 120,
  height: 20,
  x: canvas.width / 2 - 60,
  y: canvas.height - 50,
  dx: 0,
  speed: 10
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 80,
  radius: 10,
  speed: 6,
  dx: 6,
  dy: -6
};

const brick = {
  rows: 5,
  cols: 8,
  width: 100,
  height: 30,
  padding: 15,
  offsetTop: 80,
  offsetLeft: 60
};

let bricks = [];
let score = 0;

// Initialize bricks
for (let r = 0; r < brick.rows; r++) {
  bricks[r] = [];
  for (let c = 0; c < brick.cols; c++) {
    const bx = brick.offsetLeft + c * (brick.width + brick.padding);
    const by = brick.offsetTop + r * (brick.height + brick.padding);
    bricks[r][c] = { x: bx, y: by, status: 1 };
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" || e.key === "a") paddle.dx = -paddle.speed;
  if (e.key === "ArrowRight" || e.key === "d") paddle.dx = paddle.speed;
});

document.addEventListener("keyup", e => {
  if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) paddle.dx = 0;
});

// Draw paddle
function drawPaddle() {
  ctx.fillStyle = "limegreen";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

// Draw bricks
function drawBricks() {
  for (let r = 0; r < brick.rows; r++) {
    for (let c = 0; c < brick.cols; c++) {
      const b = bricks[r][c];
      if (b.status === 1) {
        ctx.fillStyle = `hsl(${(r * 60 + c * 10) % 360}, 100%, 50%)`;
        ctx.fillRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

// Move paddle
function movePaddle() {
  paddle.x += paddle.dx;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width)
    paddle.x = canvas.width - paddle.width;
}

// Move ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collisions
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
    ball.dx *= -1;
  if (ball.y - ball.radius < 0) ball.dy *= -1;

  // Paddle collision
  if (
    ball.y + ball.radius > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collisions
  for (let r = 0; r < brick.rows; r++) {
    for (let c = 0; c < brick.cols; c++) {
      const b = bricks[r][c];
      if (b.status === 1) {
        if (
          ball.x > b.x &&
          ball.x < b.x + brick.width &&
          ball.y > b.y &&
          ball.y < b.y + brick.height
        ) {
          ball.dy *= -1;
          b.status = 0;
          score += 10;
        }
      }
    }
  }

  // Game over
  if (ball.y + ball.radius > canvas.height) {
    drawGameOver();
    cancelAnimationFrame(animation);
  }

  // Win condition
  if (score === brick.rows * brick.cols * 10) {
    drawWin();
    cancelAnimationFrame(animation);
  }
}

// Draw score
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.fillText(`Score: ${score}`, 40, 40);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 30);
  ctx.font = "28px Arial";
  ctx.fillText("Press 🔄 to restart", canvas.width / 2, canvas.height / 2 + 20);
}

function drawWin() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "limegreen";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("You Win! 🎉", canvas.width / 2, canvas.height / 2 - 30);
  ctx.font = "28px Arial";
  ctx.fillText("Press 🔄 to restart", canvas.width / 2, canvas.height / 2 + 20);
}

// Main draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawPaddle();
  drawBall();
  drawScore();
  movePaddle();
  moveBall();

  animation = requestAnimationFrame(draw);
}

let animation = requestAnimationFrame(draw);
