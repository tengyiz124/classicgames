// Simple Asteroids Game 🚀

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ship, bullets, asteroids, keys, score, lives, gameOver;

function init() {
  ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0,
    velX: 0,
    velY: 0,
    thrust: false,
    radius: 15
  };
  bullets = [];
  asteroids = [];
  keys = {};
  score = 0;
  lives = 3;
  gameOver = false;

  // Create asteroids
  for (let i = 0; i < 6; i++) {
    asteroids.push(newAsteroid());
  }

  loop();
}

function newAsteroid() {
  let x, y;
  do {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
  } while (Math.hypot(x - ship.x, y - ship.y) < 100);
  return {
    x,
    y,
    velX: (Math.random() - 0.5) * 2,
    velY: (Math.random() - 0.5) * 2,
    radius: 30 + Math.random() * 30
  };
}

function loop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(loop);
}

function update() {
  // Ship rotation and thrust
  if (keys["ArrowLeft"]) ship.angle -= 0.07;
  if (keys["ArrowRight"]) ship.angle += 0.07;
  ship.thrust = keys["ArrowUp"];

  if (ship.thrust) {
    ship.velX += Math.cos(ship.angle) * 0.1;
    ship.velY += Math.sin(ship.angle) * 0.1;
  } else {
    ship.velX *= 0.99;
    ship.velY *= 0.99;
  }

  ship.x += ship.velX;
  ship.y += ship.velY;
  wrap(ship);

  // Update bullets
  bullets.forEach((b) => {
    b.x += b.velX;
    b.y += b.velY;
    wrap(b);
  });
  bullets = bullets.filter((b) => b.life > 0);
  bullets.forEach((b) => b.life--);

  // Update asteroids
  asteroids.forEach((a) => {
    a.x += a.velX;
    a.y += a.velY;
    wrap(a);
  });

  // Collisions: bullets vs asteroids
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      const dx = bullets[i].x - asteroids[j].x;
      const dy = bullets[i].y - asteroids[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < asteroids[j].radius) {
        bullets.splice(i, 1);
        score += 100;
        splitAsteroid(j);
        break;
      }
    }
  }

  // Collisions: ship vs asteroids
  for (let j = asteroids.length - 1; j >= 0; j--) {
    const dx = ship.x - asteroids[j].x;
    const dy = ship.y - asteroids[j].y;
    const dist = Math.hypot(dx, dy);
    if (dist < asteroids[j].radius + ship.radius) {
      lives--;
      if (lives <= 0) {
        gameOver = true;
        setTimeout(() => {
          ctx.fillStyle = "#ff3333";
          ctx.font = "50px Arial";
          ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
        }, 100);
      }
      resetShip();
      break;
    }
  }
}

function splitAsteroid(index) {
  const a = asteroids[index];
  if (a.radius > 20) {
    for (let i = 0; i < 2; i++) {
      asteroids.push({
        x: a.x,
        y: a.y,
        velX: (Math.random() - 0.5) * 3,
        velY: (Math.random() - 0.5) * 3,
        radius: a.radius / 2
      });
    }
  }
  asteroids.splice(index, 1);
  if (asteroids.length === 0) {
    for (let i = 0; i < 6; i++) asteroids.push(newAsteroid());
  }
}

function resetShip() {
  ship.x = canvas.width / 2;
  ship.y = canvas.height / 2;
  ship.velX = 0;
  ship.velY = 0;
}

function wrap(obj) {
  if (obj.x < 0) obj.x += canvas.width;
  if (obj.x > canvas.width) obj.x -= canvas.width;
  if (obj.y < 0) obj.y += canvas.height;
  if (obj.y > canvas.height) obj.y -= canvas.height;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ship
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);
  ctx.strokeStyle = "#00ff99";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(-15, -10);
  ctx.lineTo(-15, 10);
  ctx.closePath();
  ctx.stroke();
  if (ship.thrust) {
    ctx.beginPath();
    ctx.moveTo(-15, -5);
    ctx.lineTo(-25, 0);
    ctx.lineTo(-15, 5);
    ctx.strokeStyle = "orange";
    ctx.stroke();
  }
  ctx.restore();

  // Draw bullets
  ctx.fillStyle = "#fff";
  bullets.forEach((b) => ctx.fillRect(b.x - 2, b.y - 2, 4, 4));

  // Draw asteroids
  ctx.strokeStyle = "#ccc";
  asteroids.forEach((a) => {
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
    ctx.stroke();
  });

  // UI
  ctx.fillStyle = "#00ff99";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);
  ctx.fillText(`Lives: ${lives}`, 20, 60);
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") shoot();
});
document.addEventListener("keyup", (e) => (keys[e.key] = false));

function shoot() {
  bullets.push({
    x: ship.x,
    y: ship.y,
    velX: Math.cos(ship.angle) * 5 + ship.velX,
    velY: Math.sin(ship.angle) * 5 + ship.velY,
    life: 60
  });
}

init();
