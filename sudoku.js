// sudoku.js
// Predefined puzzle + interactive UI + backtracking solver for hint & check

const puzzle = [
  [0,0,3,0,2,0,6,0,0],
  [9,0,0,3,0,5,0,0,1],
  [0,0,1,8,0,6,4,0,0],
  [0,0,8,1,0,2,9,0,0],
  [7,0,0,0,0,0,0,0,8],
  [0,0,6,7,0,8,2,0,0],
  [0,0,2,6,0,9,5,0,0],
  [8,0,0,2,0,3,0,0,9],
  [0,0,5,0,1,0,3,0,0]
];

const boardEl = document.getElementById('board');
const numpadEl = document.getElementById('numpad');
const statusEl = document.getElementById('status');

let cells = []; // {el,row,col,value,fixed}
let selected = null;

function buildBoard(){
  boardEl.innerHTML = '';
  cells = [];
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      const val = puzzle[r][c];
      if(val !== 0){
        cell.textContent = val;
        cell.classList.add('fixed');
      } else {
        cell.textContent = '';
      }
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.addEventListener('click', ()=> selectCell(r,c));
      boardEl.appendChild(cell);
      cells.push({ el: cell, row: r, col: c, value: val || 0, fixed: val !== 0 });
    }
  }
}

function selectCell(r,c){
  document.querySelectorAll('.cell').forEach(x=>x.classList.remove('selected'));
  selected = cells.find(x=>x.row===r && x.col===c);
  if(selected && !selected.fixed){
    selected.el.classList.add('selected');
  } else {
    selected = null;
  }
}

function placeNumber(n){
  if(!selected) return;
  if(selected.fixed) return;
  selected.value = n;
  selected.el.textContent = n || '';
  validateConflicts();
  statusEl.textContent = '';
}

function buildNumpad(){
  numpadEl.innerHTML = '';
  for(let i=1;i<=9;i++){
    const b = document.createElement('button');
    b.textContent = i;
    b.addEventListener('click', ()=> placeNumber(i));
    numpadEl.appendChild(b);
  }
  const clear = document.createElement('button');
  clear.textContent = '⌫';
  clear.addEventListener('click', ()=> placeNumber(0));
  numpadEl.appendChild(clear);

  document.addEventListener('keydown', e=>{
    if(e.key >= '1' && e.key <= '9') placeNumber(parseInt(e.key));
    if(e.key === 'Backspace' || e.key === 'Delete') placeNumber(0);
  });
}

function validateConflicts(){
  cells.forEach(x=> x.el.classList.remove('conflict'));
  const grid = Array.from({length:9}, ()=> Array(9).fill(0));
  cells.forEach(x => grid[x.row][x.col] = x.value || 0);

  // rows
  for(let r=0;r<9;r++){
    const seen = {};
    for(let c=0;c<9;c++){
      const v = grid[r][c];
      if(!v) continue;
      if(seen[v] !== undefined){
        markConflict(r,c); markConflict(r,seen[v]);
      } else seen[v] = c;
    }
  }

  // cols
  for(let c=0;c<9;c++){
    const seen = {};
    for(let r=0;r<9;r++){
      const v = grid[r][c];
      if(!v) continue;
      if(seen[v] !== undefined){
        markConflict(r,c); markConflict(seen[v],c);
      } else seen[v] = r;
    }
  }

  // boxes
  for(let br=0;br<3;br++){
    for(let bc=0;bc<3;bc++){
      const seen = {};
      for(let r=br*3;r<br*3+3;r++){
        for(let c=bc*3;c<bc*3+3;c++){
          const v = grid[r][c];
          if(!v) continue;
          const key = v;
          if(seen[key] !== undefined){
            markConflict(r,c);
            markConflict(seen[key][0], seen[key][1]);
          } else seen[key] = [r,c];
        }
      }
    }
  }
}

function markConflict(r,c){
  const cell = cells.find(x=>x.row===r && x.col===c);
  if(cell) cell.el.classList.add('conflict');
}

// Simple backtracking solver (returns solved grid or null)
function solveSudoku(grid){
  function findEmpty(g){
    for(let r=0;r<9;r++) for(let c=0;c<9;c++) if(g[r][c]===0) return [r,c];
    return null;
  }
  function valid(g,r,c,val){
    for(let i=0;i<9;i++) if(g[r][i]===val || g[i][c]===val) return false;
    const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
    for(let i=0;i<3;i++) for(let j=0;j<3;j++) if(g[br+i][bc+j]===val) return false;
    return true;
  }
  function solve(g){
    const empty = findEmpty(g);
    if(!empty) return true;
    const [r,c] = empty;
    for(let v=1; v<=9; v++){
      if(valid(g,r,c,v)){
        g[r][c] = v;
        if(solve(g)) return true;
        g[r][c] = 0;
      }
    }
    return false;
  }
  const copy = grid.map(row => row.slice());
  if(solve(copy)) return copy;
  return null;
}

function cellsToGrid(){
  const g = Array.from({length:9}, ()=> Array(9).fill(0));
  cells.forEach(x => g[x.row][x.col] = x.value || 0);
  return g;
}

// Hint: fill the first empty cell with a value from solver
function hint(){
  const grid = cellsToGrid();
  const solved = solveSudoku(grid);
  if(!solved){
    statusEl.textContent = 'No solution available';
    return;
  }
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      const idx = cells.findIndex(x=>x.row===r && x.col===c);
      if(cells[idx].value === 0 && !cells[idx].fixed){
        cells[idx].value = solved[r][c];
        cells[idx].el.textContent = solved[r][c];
        validateConflicts();
        statusEl.textContent = 'Hint placed';
        return;
      }
    }
  }
  statusEl.textContent = 'No empty cells';
}

// Check board: solve current grid; if solved -> success
function checkComplete(){
  const grid = cellsToGrid();
  const solved = solveSudoku(grid);
  if(!solved){
    statusEl.textContent = 'Incorrect or incomplete';
    return;
  }
  // check match with solver (and no conflicts)
  statusEl.textContent = '🎉 Puzzle solved!';
}

// Actions binding
document.getElementById('hintBtn').addEventListener('click', hint);
document.getElementById('checkBtn').addEventListener('click', checkComplete);
document.getElementById('eraseBtn').addEventListener('click', ()=> placeNumber(0));

// Initialize
buildBoard();
buildNumpad();
validateConflicts();
statusEl.textContent = '';
