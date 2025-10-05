// Asteroids Game 🚀
// Includes dynamic starfield + explosions + difficulty scaling

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ship, bullets, asteroids, keys, stars, explosions, score, lives, gameOver, wave;

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
  stars = [];
  explosions = [];
  score = 0;
  lives = 3;
  wave = 1;
  gameOver = false;

  spawnAsteroids(5);
  createStars(100);
  loop();
}

// 🌟 Create starfield
function createStars(num) {
  for (let i = 0; i < num; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random()
    });
  }
}

function updateStars() {
  stars.forEach((s) => {
    s.y += s.speed;
    if (s.y > canvas.height) {
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }
    s.opacity += (Math.random() - 0.5) * 0.1;
    s.opacity = Math.max(0.2, Math.min(1, s.opacity));
  });
}

function drawStars() {
  stars.forEach((s) => {
    ctx.globalAlpha = s.opacity;
    ctx.fillStyle = "white";
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });
  ctx.globalAlpha = 1;
}

function spawnAsteroids(num) {
  for (let i = 0; i < num; i++) asteroids.push(newAsteroid());
}

function newAsteroid(size = 60) {
  let x, y;
  do {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
  } while (Math.hypot(x - ship.x, y - ship.y) < 100);

  const speedBoost = 1 + wave * 0.1;
  return {
    x,
    y,
    velX: (Math.random() - 0.5) * 2 * speedBoost,
    velY: (Math.random() - 0.5) * 2 * speedBoost,
    radius: size
  };
}

function loop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(loop);
}

function update() {
  updateStars();

  // Ship movement
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

  // Bullets
  bullets.forEach((b) => {
    b.x += b.velX;
    b.y += b.velY;
    b.life--;
    wrap(b);
  });
  bullets = bullets.filter((b) => b.life > 0);

  // Asteroids
  asteroids.forEach((a) => {
    a.x += a.velX;
    a.y += a.velY;
    wrap(a);
  });

  // Explosions
  explosions.forEach((e) => (e.life -= 1));
  explosions = explosions.filter((e) => e.life > 0);

  // Bullet hits asteroid
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      const dx = bullets[i].x - asteroids[j].x;
      const dy = bullets[i].y - asteroids[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < asteroids[j].radius) {
        createExplosion(asteroids[j].x, asteroids[j].y);
        bullets.splice(i, 1);
        score += 100;
        splitAsteroid(j);
        break;
      }
    }
  }

  // Ship hits asteroid
  for (let j = asteroids.length - 1; j >= 0; j--) {
    const dx = ship.x - asteroids[j].x;
    const dy = ship.y - asteroids[j].y;
    const dist = Math.hypot(dx, dy);
    if (dist < asteroids[j].radius + ship.radius) {
      createExplosion(ship.x, ship.y, true);
      lives--;
      resetShip();
      if (lives <= 0) {
        gameOver = true;
        setTimeout(showGameOver, 200);
      }
      break;
    }
  }

  // Next wave
  if (asteroids.length === 0) {
    wave++;
    spawnAsteroids(4 + wave);
  }
}

// 💥 Explosion
function createExplosion(x, y, big = false) {
  const particles = 15 + Math.random() * 10;
  for (let i = 0; i < particles; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 2 + 1) * (big ? 2 : 1);
    explosions.push({
      x,
      y,
      velX: Math.cos(angle) * speed,
      velY: Math.sin(angle) * speed,
      radius: Math.random() * 3 + 2,
      color: big ? "red" : "orange",
      life: 20
    });
  }
}

function drawExplosions() {
  explosions.forEach((e) => {
    ctx.globalAlpha = e.life / 20;
    ctx.fillStyle = e.color;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
    e.x += e.velX;
    e.y += e.velY;
  });
  ctx.globalAlpha = 1;
}

function splitAsteroid(index) {
  const a = asteroids[index];
  const newRadius = a.radius / 2;
  const speedUp = 1.2;

  if (newRadius > 15) {
    for (let i = 0; i < 2; i++) {
      asteroids.push({
        x: a.x,
        y: a.y,
        velX: (Math.random() - 0.5) * 3 * speedUp,
        velY: (Math.random() - 0.5) * 3 * speedUp,
        radius: newRadius
      });
    }
  }

  asteroids.splice(index, 1);
}

function wrap(obj) {
  if (obj.x < 0) obj.x += canvas.width;
  if (obj.x > canvas.width) obj.x -= canvas.width;
  if (obj.y < 0) obj.y += canvas.height;
  if (obj.y > canvas.height) obj.y -= canvas.height;
}

function resetShip() {
  ship.x = canvas.width / 2;
  ship.y = canvas.height / 2;
  ship.velX = 0;
  ship.velY = 0;
  ship.angle = 0;
}

function shoot() {
  bullets.push({
    x: ship.x + Math.cos(ship.angle) * 20,
    y: ship.y + Math.sin(ship.angle) * 20,
    velX: Math.cos(ship.angle) * 6 + ship.velX,
    velY: Math.sin(ship.angle) * 6 + ship.velY,
    life: 60
  });
}

function showGameOver() {
  ctx.fillStyle = "#ff3333";
  ctx.font = "50px Arial";
  ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background stars
  drawStars();

  // Explosions
  drawExplosions();

  // Ship
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

  // Bullets
  ctx.fillStyle = "white";
  bullets.forEach((b) => ctx.fillRect(b.x - 2, b.y - 2, 4, 4));

  // Asteroids
  ctx.strokeStyle = "#cccccc";
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
  ctx.fillText(`Wave: ${wave}`, 20, 90);
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") shoot();
});
document.addEventListener("keyup", (e) => (keys[e.key] = false));

init();
