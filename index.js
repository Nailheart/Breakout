const startGameButton = document.querySelector('.btn-start');
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Шарик
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 20;
let dx = 3;
let dy = -3;
let ballColor = "#0095DD";

// Ракетка
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Кнопки
let rightPressed = false;
let leftPressed = false;

// Кирпичи
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;
let lives = 3;
let speed = 3;
let gameReq;

// Создаем двумерный массив
let bricks = [];
for(let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];

  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Обработчики событий
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keydown", toggleGameHandler, false);
document.addEventListener("keydown", speedHandler, false);

// Начинаем игру по клику мыши
startGameButton.addEventListener('click', () => {
  startGameButton.classList.add('btn-start--hide');
  draw();
});

// Движения ракетки мышкой
function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX - paddleWidth / 2 > 0 && relativeX < canvas.width - paddleWidth / 2) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// Стрелочка нажата
function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

// Стрелочку отпустили
function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

// Запустить остановить игру
function toggleGameHandler(e) {
  if (e.keyCode == 32 && startGameButton.classList.contains('btn-start--hide')) {
    cancelAnimationFrame(gameReq);
    startGameButton.classList.remove('btn-start--hide');
  } else if (e.keyCode == 32) {
    cancelAnimationFrame(gameReq);
    startGameButton.classList.add('btn-start--hide');
    draw();
  }
}

// Повышение скорости игры
function speedHandler(e) {
  if (e.keyCode == 38) {
    dx > 0 ? dx++ : dx--;
    dy > 0 ? dy++ : dy--;
  } else if (e.keyCode == 40) {
    dx > 0 ? dx-- : dx++;
    dy > 0 ? dy-- : dy++;
  }
}

// Обнаружения столкновений
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];

      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;

          if (score == brickRowCount * brickColumnCount) {
            drawGameComponent();
            alert("You win congratulation! score: " + score);
            document.location.reload();
          }
        }
      }
    }
  }
}

// Рисуем счет
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

// Рисуем жизни
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// Рисуем скорость
function drawSpeed() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Speed: " + speed, 220, 20);
}

// Рисуем мяч
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

// Меняем цвет шара на рандомный
function changeBallColor() {
  ballColor = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
}

// Рисуем ракетку
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Рисуем кирпичи 
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Рисуем все компонеты игры
function drawGameComponent() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  // drawSpeed();
}

// Отрисовка игры
function draw() {
  // Удаляем содержымое канваса
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Отрисовка содержимого канваса
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  // drawSpeed();
  collisionDetection();
  
  // Отскок от границ игрового поля
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  } 

  // Управление ракеткой
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  // Движение мяча
  x += dx;
  y += dy;

  gameReq = requestAnimationFrame(draw);
}

// Отрисовка компонентов игры
drawGameComponent();
