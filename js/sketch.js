let cols, rows;
let w = 60;
let grid = [], cellResults = [];
let current;
let stack = [null], stackDFS = [], stackAStar = [];
let cellStart, cellEnd, cellTrace, cellFind, numClickCell = 0;
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
    current.highlight();
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
      stackDFS.push(cellFind);
      cellFind = next;
    } else if (stackDFS.length > 0) {
      cellFind = stackDFS.pop();
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
function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;
  this.visitedSearch = false;
  this.isCellResult = false;
  this.prevCell = null;
  this.nextCell = null;
  this.checkGenerate = function () {
    let cellNext = [];

    let top = grid[index(i, j - 1)];
    let right = grid[index(i + 1, j)];
    let bottom = grid[index(i, j + 1)];
    let left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      cellNext.push(top);
    }
    if (right && !right.visited) {
      cellNext.push(right);
    }
    if (bottom && !bottom.visited) {
      cellNext.push(bottom);
    }
    if (left && !left.visited) {
      cellNext.push(left);
    }

    if (cellNext.length > 0) {
      let r = floor(random(0, cellNext.length));
      return cellNext[r];
    } else {
      return undefined;
    }
  };
  this.checkDFS = function () {
    let cellNext = [];
    let top = grid[index(i, j - 1)];
    let right = grid[index(i + 1, j)];
    let bottom = grid[index(i, j + 1)];
    let left = grid[index(i - 1, j)];
    if (!this.walls[0] && !top.visitedSearch) cellNext.push(top)
    if (!this.walls[1] && !right.visitedSearch) cellNext.push(right)
    if (!this.walls[2] && !bottom.visitedSearch) cellNext.push(bottom)
    if (!this.walls[3] && !left.visitedSearch) cellNext.push(left)
    return cellNext[0]
  }
  this.checkAStar = function () {
    let cellNext = [];
    let top = grid[index(i, j - 1)];
    let right = grid[index(i + 1, j)];
    let bottom = grid[index(i, j + 1)];
    let left = grid[index(i - 1, j)];
    if (!this.walls[0] && !top.visitedSearch) cellNext.push(top)
    if (!this.walls[1] && !right.visitedSearch) cellNext.push(right)
    if (!this.walls[2] && !bottom.visitedSearch) cellNext.push(bottom)
    if (!this.walls[3] && !left.visitedSearch) cellNext.push(left)
    let dMin = 9999999999999, cellResult;
    for (let cell of cellNext) {
      let d = dist(cell.i, cell.j, cellEnd.i, cellEnd.j);
      if (d < dMin) {
        dMin = d
        cellResult = cell
      }
    }
    return cellResult
  }
  this.highlight = function () {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();
    fill("green");
    rect(x + 5, y + 5, w - 10, w - 10);
  };
  this.showCell = function () {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();
    fill("yellow");
    circle(x + 30, y + 30, 20)
  }
  this.showCellResult = function () {
    let x = this.i * w;
    let y = this.j * w;
    strokeWeight(8);
    stroke("red");
    let px = this.prevCell.i - this.i
    if (px === 1) line(x + 30, y + 30, x + 60, y + 30);
    if (px === -1) line(x + 30, y + 30, x, y + 30);
    let py = this.prevCell.j - this.j
    if (py === 1) line(x + 30, y + 30, x + 30, y + 60);
    if (py === -1) line(x + 30, y + 30, x + 30, y);

    let nx = this.nextCell.i - this.i
    if (nx === 1) line(x + 30, y + 30, x + 60, y + 30);
    if (nx === -1) line(x + 30, y + 30, x, y + 30);
    let ny = this.nextCell.j - this.j
    if (ny === 1) line(x + 30, y + 30, x + 30, y + 60);
    if (ny === -1) line(x + 30, y + 30, x + 30, y);
  }
  this.showCellStart = function () {
    let x = this.i * w;
    let y = this.j * w;
    stroke(0)
    textSize(40)
    fill("green");
    textStyle(BOLD);
    textAlign(CENTER, CENTER)
    text("S", x + 30, y + 30)
  }
  this.showCellEnd = function () {
    let x = this.i * w;
    let y = this.j * w;
    stroke(0)
    textSize(40)
    fill("green");
    textStyle(BOLD);
    textAlign(CENTER, CENTER)
    text("E", x + 30, y + 30)
  }
  this.show = function () {
    let x = this.i * w;
    let y = this.j * w;
    strokeWeight(8);
    stroke(255);
    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }
  };
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