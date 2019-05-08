let col_slower = 100;

let Cell = function(x, y, size, cellx, celly) {
  this.x = x;
  this.y = y;
  this.cellX = cellx;
  this.cellY = celly;
  this.baseTax = randomGaussian(5, 2);
  this.tax = this.baseTax;
  this.localTax_eff = 1;
  this.col_progress = 0;
  this.population = randomGaussian(10, 4);
  if (this.population < 0) this.population = 0;
  console.log(cellx, celly)
  this.size = size;
  this.settled = false;
  this.strColor = color(0, 0, 0);
  this.color = color(255, 255, 255);
  this.percentile = cdf(this.population, 10, 16);
  this.setColor = function(c) {
    this.color = color(c[0], c[1], c[2]);
  }
  this.setColorAlpha = function(c, a) {
    this.color = color(c[0], c[1], c[2], 255 * this.percent)
  }
  this.setStroke = function(c) {
    this.strColor = color(c[0], c[1], c[2]);
  }
  this.populationDraw = function() {
    let c = color(0, 0, 255, 255 * this.percentile);
    push();
    fill(c);
    strokeWeight(1)
    rect(this.x, this.y, this.size, this.size);
    fill(0);
    text(round(this.population, 2), this.x, this.y, this.x + this.size,
      this.y - this.size)
    pop();
  }
  this.baseTaxDraw = function() {
    this.calcTaxes();
    let c = color(0, 255, 0, floor(255 * cdf(this.baseTax, 5, 4)));
    push();
    fill(c);
    strokeWeight(1)
    rect(this.x, this.y, this.size, this.size);
    fill(0);
    text(round(this.baseTax, 2), this.x, this.y, this.x + this.size, this.y -
      this.size)
    pop();
  }
  this.update = function() {
    this.calcTaxes();
  }
  this.colonize = function(money, domain) {
    this.col_progress += money;
    this.percent = this.col_progress / (col_slower * this.baseTax);
    if (this.percent > 1) {
      console.log("colonized!")
      domain.tiles.push(this);
      this.settled = true;
    }
  }
  this.draw = function() {
    push();
    stroke(this.strColor)
    fill(this.color)
    strokeWeight(1)
    rect(this.x, this.y, this.size, this.size);
    if (this.percentile > .85) {
      console.log(this.cellX, this.cellY)
      fill(255, 204, 0)
      ellipse(this.x + this.size / 2, this.y + this.size / 2, (this.percentile *
        this.percentile) * (this.size / 2));
    }
    pop();
  }
  this.calcTaxes = function() {
    this.tax = this.population * this.localTax_eff * this.baseTax;
  }
  this.giveTaxes = function() {
    if (this.localTax_eff > .5) {
      this.localTax_eff -= this.localTax_eff * .1
      return this.tax;
    } else {
      this.localTax_eff += this.localTax_eff * .25;
      return 0;
    }
  }
}

function cdf(x, mean, variance) {
  return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2 * variance))));
}

function erf(x) {
  // save the sign of x
  var sign = (x >= 0) ? 1 : -1;
  x = Math.abs(x);

  // constants
  var a1 = 0.254829592;
  var a2 = -0.284496736;
  var a3 = 1.421413741;
  var a4 = -1.453152027;
  var a5 = 1.061405429;
  var p = 0.3275911;

  // A&S formula 7.1.26
  var t = 1.0 / (1.0 + p * x);
  var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-
    x * x);
  return sign * y; // erf(-x) = -erf(x);
}
