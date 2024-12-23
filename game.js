const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rows = 20;
const cols = 10;
const blockSize = 20;
let score = 0;

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFFF33', '#FF33FF'];

const shapes = [
  [
    [[1, 1], [1, 1]], // O shape
  ],
  [
    [[1, 1, 0], [0, 1, 1]], // Z shape
    [[0, 1], [1, 1], [1, 0]], // S shape
  ],
  [
    [[1, 0, 0], [1, 1, 1]], // T shape
  ],
  [
    [[1, 1, 1], [0, 0, 1]], // L shape
    [[1, 0], [1, 0], [1, 1]], // J shape
  ],
];

let currentShape = getRandomShape();
let currentX = Math.floor(cols / 2) - 1;
let currentY = 0;
let gameInterval;

function getRandomShape() {
  const shapeIndex = Math.floor(Math.random() * shapes.length);
  return shapes[shapeIndex][Math.floor(Math.random() * shapes[shapeIndex].length)];
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.strokeStyle = '#34495e';
      ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
    }
  }
}

function drawShape() {
  for (let row = 0; row < currentShape.length; row++) {
    for (let col = 0; col < currentShape[row].length; col++) {
      if (currentShape[row][col]) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect((currentX + col) * blockSize, (currentY + row) * blockSize, blockSize, blockSize);
      }
    }
  }
}

function moveDown() {
  currentY++;
  if (checkCollision()) {
    currentY--;
    placeShape();
    currentShape = getRandomShape();
    currentX = Math.floor(cols / 2) - 1;
    currentY = 0;
  }
}

function placeShape() {
  for (let row = 0; row < currentShape.length; row++) {
    for (let col = 0; col < currentShape[row].length; col++) {
      if (currentShape[row][col]) {
        const x = currentX + col;
        const y = currentY + row;
        if (y < 0) {
          clearInterval(gameInterval); // Game Over
          alert('Game Over!');
          return;
        }
        // Place the shape on the board
      }
    }
  }
  score++;
  document.getElementById('score').textContent = 'Score: ' + score;
}

function checkCollision() {
  for (let row = 0; row < currentShape.length; row++) {
    for (let col = 0; col < currentShape[row].length; col++) {
      if (currentShape[row][col]) {
        const x = currentX + col;
        const y = currentY + row;
        if (x < 0 || x >= cols || y >= rows) {
          return true;
        }
      }
    }
  }
  return false;
}

function gameLoop() {
  drawBoard();
  drawShape();
  moveDown();
}

function handleKeyPress(event) {
  if (event.key === 'ArrowLeft') {
    currentX--;
    if (checkCollision()) currentX++;
  } else if (event.key === 'ArrowRight') {
    currentX++;
    if (checkCollision()) currentX--;
  } else if (event.key === 'ArrowDown') {
    moveDown();
  } else if (event.key === 'ArrowUp') {
    currentShape = rotateShape(currentShape);
    if (checkCollision()) {
      currentShape = rotateShape(currentShape, true);
    }
  }
}

function rotateShape(shape, reverse = false) {
  const newShape = shape[0].map((_, index) => shape.map(row => row[index]));
  return reverse ? newShape.reverse() : newShape;
}

document.addEventListener('keydown', handleKeyPress);
gameInterval = setInterval(gameLoop, 500);
