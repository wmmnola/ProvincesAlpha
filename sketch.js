let cells;
let domains = [];
let s = 1;
let transX = 0;
let transY = 0;
let canSize = 1000;
let cellSize = 100;

function setup() {
  colorMode(RGB, 255)
  cells = []


  let starting_count = 10;
  createCanvas(canSize, canSize);
  let cellx = 0;
  let celly = 0;
  transX = width / 2;
  transY = height / 2;
  for (let y = 0; y < canSize; y += cellSize) {
    for (let x = 0; x < canSize; x += cellSize) {
      c = new Cell(x, y, cellSize, cellx, celly);
      cellx++;
      cells.push(c);
    }
    celly++;
    cellx = 0;
  }
  for (let i = 0; i < starting_count; i++) {
    let r = floor(random(cells.length))
    let c = [random(255), random(255), random(255)];
    cells[r].settled = true;
    let d = new Domain(r, cells[r], c)
    domains.push(d)
  }
}

function keyPressed() {
  if (keyCode === 87) {
    transY += 100;
  }
  if (keyCode === 83) transY -= (1 / s) * 100;
  if (keyCode === 65) transX += (1 / s) * 100;
  if (keyCode === 68) transX -= (1 / s) * 100;
  if (keyCode === 81) s += .1;
  if (keyCode === 69) s -= .1;

}

function mouseWheel(event) {
  s += .001 * event.delta
}

function draw() {
  background(255);
  scale(s)
  translate(transX, transY)
  for (let cell of cells) {
    if (keyIsDown(66)) {
      cell.baseTaxDraw()
    } else if (keyIsDown(80)) {
      cell.populationDraw();
    } else {
      cell.draw()
    }
  }
  for (let d of domains) {
    d.update();
  }

}
