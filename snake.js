// --- Snake Game --- //

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Grid setup
const box = 25;
let snake = [{ x: 8 * box, y: 8 * box }];
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box
};
let score = 0;

// Controls
document.addEventListener("keydown", changeDirection);
function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// Mobile swipe
let startX, startY;
document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
document.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;
  let endY = e.changedTouches[0].clientY;
  let dx = endX - startX;
  let dy = endY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
    else if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (dy > 0 && direction !== "UP") direction = "DOWN";
    else if (dy < 0 && direction !== "DOWN") direction = "UP";
  }
});

function drawBox(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, box, box);
  ctx.strokeStyle = "#003300";
  ctx.strokeRect(x, y, box, box);
}

function draw() {
  ctx.fillStyle = "#002200";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  drawBox(food.x, food.y, "red");

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    drawBox(snake[i].x, snake[i].y, i === 0 ? "limegreen" : "green");
  }

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // Collision
  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(newHead);

  // Score
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 20, 40);
}

function gameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 20);
}

let game = setInterval(draw, 100);
