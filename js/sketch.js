let cols, rows;
let w = 60;
let grid = [];
let current, numGen = 2;
let stack = [null];
let cellStart, cellEnd, cellTrace, cellFind, numClickCell = 0;
let stackDFS = [];
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
    if (grid[i] === cellStart || grid[i] === cellEnd) {
      grid[i].showPathSE()
    }
    else {
      if (grid[i].vDFS) grid[i].showPath()
      if (grid[i].isShowPathF) grid[i].showPathF()
    }
  }

  let next
  if (current instanceof Cell) {
    current.visited = true;
    current.highlight();
    next = current.checkNeighbors();
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
    frameRate(30)
    let next
    if (cellFind instanceof Cell) {
      cellFind.vDFS = true;
      next = cellFind.checkDFS();
    }
    if (next) {
      next.prevCell = cellFind
      next.vDFS = true;
      if (next === cellEnd) {
        numClickCell = 3
        cellTrace = cellEnd.prevCell
      }
      stackDFS.push(cellFind);
      cellFind = next;
    } else if (stackDFS.length > 0) {
      cellFind = stackDFS.pop();
    }
  }
  if (numClickCell === 3) {
    if (cellTrace === cellStart) numClickCell = 4
    else {
      cellTrace.isShowPathF = true;
      cellTrace.vDFS = false;
      cellTrace = cellTrace.prevCell
    }
  }
}
function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;
  this.vDFS = false;
  this.isShowPathF = false;
  this.prevCell = null;
  this.checkNeighbors = function () {
    let neighbors = [];

    let top = grid[index(i, j - 1)];
    let right = grid[index(i + 1, j)];
    let bottom = grid[index(i, j + 1)];
    let left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  };
  this.checkDFS = function () {
    let neighbors = [];
    let top = grid[index(i, j - 1)];
    let right = grid[index(i + 1, j)];
    let bottom = grid[index(i, j + 1)];
    let left = grid[index(i - 1, j)];
    if (!this.walls[0] && !top.vDFS) neighbors.push(top)
    if (!this.walls[1] && !right.vDFS) neighbors.push(right)
    if (!this.walls[2] && !bottom.vDFS) neighbors.push(bottom)
    if (!this.walls[3] && !left.vDFS) neighbors.push(left)
    return neighbors[0]
  }
  this.highlight = function () {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();
    fill("green");
    rect(x + 5, y + 5, w - 10, w - 10);
  };
  this.showPath = function () {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();
    fill("yellow");
    // rect(x + 20, y + 20, w - 40, w - 40);
    circle(x + 30, y + 30, 20)
  }
  this.showPathF = function () {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();
    fill("red");
    rect(x + 20, y + 20, w - 40, w - 40);
  }
  this.showPathSE = function () {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();
    fill("green");
    rect(x + 20, y + 20, w - 40, w - 40);
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

    // if (this.visited) {
    //   noStroke();
    //   fill(255, 0, 255, 100);
    //   rect(x + 4, y + 4, w, w);
    // }
  };
}s
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
function mousePressed() {
  let i = index(floor(mouseX / w), floor(mouseY / w))
  if (i >= 0 && i < rows * cols) {
    if (numClickCell === 0) {
      cellStart = grid[i]
      numClickCell = 1
    } else if (numClickCell === 1) {
      cellEnd = grid[i]
      cellFind = cellStart
      numClickCell = 2
    } else {
      for (let i = 0; i < grid.length; i++) {
        grid[i].vDFS = false;
        grid[i].isShowPathF = false;
      }
      cellStart = null
      cellEnd = null
      numClickCell = 0
    }
  }
}
document.getElementById("btnFind").addEventListener("click", function () {
  w = 30
  setup()
  daw()
})