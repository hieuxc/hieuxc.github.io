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
}