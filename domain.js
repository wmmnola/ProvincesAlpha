let width = canSize / cellSize;
let modifier = 1;

let Domain = function(name, starting_tile, color) {
  this.tiles = [];
  this.color = color;
  this.name = name;
  this.tax_eff = 1;
  this.money = 0;
  this.tiles.push(starting_tile)
  this.update = function() {
    this.collectTaxes();
    for (let tile of this.tiles) {
      this.find_neighbors();
      tile.settled = true;
      tile.setColor(this.color)
      tile.setStroke(this.color)
    }
    this.colonizeTile();
  }
  this.colonizeTile = function() {
    let r = floor(random(0, this.neighbors.length - 1));
    let tile = findLargestTax(this.neighbors)
    if (tile) {
      modifier = (1 / (this.tiles.length * this.tiles.length))
      tile.colonize(modifier * this.money, this);
      this.money = 0;
    }
  }
  this.collectTaxes = function() {
    for (let tile of this.tiles) {
      this.money += this.tax_eff * tile.giveTaxes();
    }
  }
  this.find_neighbors = function() {
    let neighbors_raw = [];
    this.neighbors = [];
    for (let cell of this.tiles) {
      let x = cell.cellX;
      let y = cell.cellY;
      let l = (x - 1) + y * width;
      let r = (x + 1) + y * width;
      let t = x + (y - 1) * width;
      let b = x + (y + 1) * width;
      neighbors_raw.push(cells[l]);
      neighbors_raw.push(cells[r]);
      neighbors_raw.push(cells[t]);
      neighbors_raw.push(cells[b]);
      for (let n of neighbors_raw) {
        if (n && n.settled == false) {
          this.neighbors.push(n)
          n.setColorAlpha(this.color, 50)
        }
      }
      neighbors_raw = [];
    }
  }
}

function findLargestTax(tiles) {
  let largest = tiles[0];
  for (let tile of tiles) {
    if (tile.tax > largest.tax) {
      largest = tile;
    }
  }
  return largest
}
