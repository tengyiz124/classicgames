// --- PAC-MAN GAME --- //
// Responsive, simple, functional version

const canvas = document.getElementById("pacman");
const ctx = canvas.getContext("2d");
const tileSize = 16;

const map = [
  "############################",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#o####.#####.##.#####.####o#",
  "#.####.#####.##.#####.####.#",
  "#..........................#",
  "#.####.##.########.##.####.#",
  "#......##....##....##......#",
  "######.##### ## #####.######",
  "     #.##### ## #####.#     ",
  "     #.##          ##.#     ",
  "     #.## ###--### ##.#     ",
  "######.## #      # ##.######",
  "      .   #      #   .      ",
  "######.## #      # ##.######",
  "     #.## ######## ##.#     ",
  "     #.##          ##.#     ",
  "     #.## ######## ##.#     ",
  "######.## ######## ##.######",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#o..##................##..o#",
  "###.##.##.########.##.##.###",
  "#......##....##....##......#",
  "#.##########.##.##########.#",
  "#..........................#",
  "############################",
];

let pacman = {
  x: 14,
  y: 23,
  dx: 0,
  dy: 0,
};

function drawMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = map[y][x];
      if (cell === "#") {
        ctx.fillStyle = "blue";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      } else if (cell === ".") {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (cell === "o") {
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
}

function drawPacman() {
  ctx.beginPath();
  ctx.arc(
    pacman.x * tileSize + tileSize / 2,
    pacman.y * tileSize + tileSize / 2,
    tileSize / 2,
    0.25 * Math.PI,
    1.75 * Math.PI
  );
  ctx.lineTo(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
}

function update() {
  const nextX = pacman.x + pacman.dx;
  const nextY = pacman.y + pacman.dy;
  if (map[nextY][nextX] !== "#") {
    pacman.x = nextX;
    pacman.y = nextY;
  }

  // Eat dots
  if (map[pacman.y][pacman.x] === ".") {
    map[pacman.y] =
      map[pacman.y].substring(0, pacman.x) +
      " " +
      map[pacman.y].substring(pacman.x + 1);
  }

  // Wrap around tunnels
  if (pacman.x < 0) pacman.x = map[0].length - 1;
  if (pacman.x >= map[0].length) pacman.x = 0;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawPacman();
  update();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") { pacman.dy = -1; pacman.dx = 0; }
  if (e.key === "ArrowDown") { pacman.dy = 1; pacman.dx = 0; }
  if (e.key === "ArrowLeft") { pacman.dx = -1; pacman.dy = 0; }
  if (e.key === "ArrowRight") { pacman.dx = 1; pacman.dy = 0; }
});

gameLoop();
