const canvas = document.getElementById('area');
const ctx = canvas.getContext('2d'); //stored in ctx to allow for pixel manipulation on the canvas.

// Main triangle.
const T = [[300, 0], [0, 600], [600, 600]];

// Start point.
let current = [300, 300];

function midPoint([x1, y1], [x2, y2]) {
  return [(x1 + x2) / 2, (y1 + y2) / 2];
}

function putPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Max steps.
const maxSteps = 50000;

function step() {
  const to = randomInRange(0, 2);
  current = midPoint(current, T[to]);
  putPixel(...current, '#f00'); // Use red color only
}

function run() {
  ctx.clearRect(0, 0, 600, 600);
  for (let i = 0; i < maxSteps; i++) {
    step();
  }
}

// Setup main triangle.
putPixel(...T[0], '#f00');
putPixel(...T[1], '#f00');
putPixel(...T[2], '#f00');

// Go.
run();

// Refresh every second.
setInterval(run, 1000);
