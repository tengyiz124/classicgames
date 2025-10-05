// --- Minesweeper --- //

const gridSize = 10;
const mineCount = 15;
const gameContainer = document.getElementById("game");

let grid = [];
let gameOver = false;

function createBoard() {
  const mines = new Set();
  while (mines.size < mineCount) {
    mines.add(Math.floor(Math.random() * gridSize * gridSize));
  }

  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    gameContainer.appendChild(cell);

    grid.push({
      element: cell,
      mine: mines.has(i),
      revealed: false,
      flagged: false,
    });

    cell.addEventListener("click", () => reveal(i));
    cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      toggleFlag(i);
    });
  }
}

function reveal(index) {
  if (gameOver) return;
  const cell = grid[index];
  if (cell.revealed || cell.flagged) return;

  cell.revealed = true;
  cell.element.classList.add("open");

  if (cell.mine) {
    cell.element.classList.add("mine");
    gameOver = true;
    alert("💥 Game Over!");
    revealAllMines();
    return;
  }

  const minesAround = countMinesAround(index);
  if (minesAround > 0) {
    cell.element.textContent = minesAround;
    cell.element.style.color = getNumberColor(minesAround);
  } else {
    getNeighbors(index).forEach(reveal);
  }

  checkWin();
}

function toggleFlag(index) {
  if (gameOver) return;
  const cell = grid[index];
  if (cell.revealed) return;

  cell.flagged = !cell.flagged;
  cell.element.textContent = cell.flagged ? "🚩" : "";
  cell.element.classList.toggle("flag");
}

function countMinesAround(index) {
  return getNeighbors(index).filter((i) => grid[i].mine).length;
}

function getNeighbors(index) {
  const x = index % gridSize;
  const y = Math.floor(index / gridSize);
  const neighbors = [];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
        neighbors.push(ny * gridSize + nx);
      }
    }
  }
  return neighbors;
}

function revealAllMines() {
  grid.forEach((cell) => {
    if (cell.mine) {
      cell.element.classList.add("mine");
      cell.element.textContent = "💣";
    }
  });
}

function checkWin() {
  if (
    grid.every(
      (cell) => cell.mine || (cell.revealed && !cell.mine)
    )
  ) {
    alert("🎉 You Win!");
    gameOver = true;
  }
}

function getNumberColor(num) {
  const colors = ["", "cyan", "green", "yellow", "orange", "red"];
  return colors[num] || "white";
}

createBoard();
