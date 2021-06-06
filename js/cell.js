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
  this.showCellGenerate = function () {
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