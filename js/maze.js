let cols, rows, w = 60;
let grid = [], cellResults = [];
let stack = [null], stackSearch = [];
let current, cellStart, cellEnd, cellTrace, cellFind, numClickCell = 0;
let DFS = true, AStar = false, searching = false;
function setup() {
  createCanvas(600, 600);
  cols = floor(width / w);
  rows = floor(height / w);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
}

function draw() {
  background(10);
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
    if (grid[i] === cellStart) grid[i].showCellStart()
    else if (grid[i] === cellEnd) grid[i].showCellEnd()
    else {
      if (grid[i].visitedSearch) grid[i].showCell()
      if (grid[i].isCellResult) grid[i].showCellResult()
    }
  }

  let next
  if (current instanceof Cell) {
    current.visited = true;
    current.showCellGenerate();
    next = current.checkGenerate();
  }
  if (next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
  if (numClickCell === 2) {
    frameRate(20)
    let next
    if (cellFind instanceof Cell) {
      cellFind.visitedSearch = true;
      if (DFS) next = cellFind.checkDFS();
      if (AStar) next = cellFind.checkAStar();
    }
    if (next) {
      next.prevCell = cellFind
      next.visitedSearch = true;
      if (next === cellEnd) {
        numClickCell = 3
        let cellTemp = cellEnd
        while (cellTemp !== cellStart) {
          cellResults.push(cellTemp)
          cellTemp = cellTemp.prevCell
        }
        cellResults.push(cellStart)
        cellTrace = cellEnd.prevCell
      }
      stackSearch.push(cellFind);
      cellFind = next;
    } else if (stackSearch.length > 0) {
      cellFind = stackSearch.pop();
    }
  }
  if (numClickCell === 3) {
    if (cellTrace === cellStart) {
      numClickCell = 4
      searching = false
    }
    else {
      cellTrace.nextCell = cellResults.find(c => c.prevCell === cellTrace)
      cellTrace.isCellResult = true;
      cellTrace.visitedSearch = false;
      cellTrace = cellTrace.prevCell
    }
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
// function mousePressed() {
function touchStarted() {
  let i = index(floor(mouseX / w), floor(mouseY / w))
  if (i >= 0 && i < rows * cols) {
    if (numClickCell === 0) {
      cellStart = grid[i]
      numClickCell = 1
    } else if (numClickCell === 1) {
      if (grid[i] !== cellStart) {
        cellEnd = grid[i]
        cellFind = cellStart
        searching = true
        numClickCell = 2
      }
    } else {
      resetCell()
    }
  }
  return false;
}
function resetCell() {
  for (let i = 0; i < grid.length; i++) {
    grid[i].visitedSearch = false;
    grid[i].isCellResult = false;
  }
  cellStart = null
  cellEnd = null
  cellResults = []
  numClickCell = 0
}

let DFSInputElement = document.getElementById("DFSInput")
let AStarInputElement = document.getElementById("AStarInput")
document.getElementById("DFS").addEventListener("click", function () {
  if (!searching) {
    DFSInputElement.checked = true
    AStarInputElement.checked = false
    DFS = true;
    AStar = false;
    resetCell()
  }
})
document.getElementById("AStar").addEventListener("click", function () {
  if (!searching) {
    DFSInputElement.checked = false
    AStarInputElement.checked = true
    DFS = false;
    AStar = true;
    resetCell()
  }
})