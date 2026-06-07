const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const StartGameModal = document.querySelector('.start-game');
const GameOverModal = document.querySelector('.Game-over');
const restartButton = document.querySelector('.btn-restart');

const highestScoreelement = document.querySelector('#highestScore');
const scoreelement = document.querySelector('#Score');
const timetelement = document.querySelector('#Time');
const finalScoreElement = document.querySelector('#finalScore');
const finalHighestScoreElement = document.querySelector('#finalHighestScore');

const blockHeight = 30;
const blockWidth = 30;
const baseSpeed = 200;
const minSpeed = 80;
const speedStep = 10;
const scoreStep = 10;

let highestScore = localStorage.getItem('highestScore') || 0;
let score = 0;
let time = `00-00`;

highestScoreelement.innerText = highestScore;
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerIntervalid = null;
let food = null;

board.style.gridTemplateColumns = `repeat(${cols},1fr)`;
board.style.gridTemplateRows = `repeat(${rows},1fr)`;


const blocks = {};
let snake = [{ x: 1, y: 3 }];

let direction = 'down';

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function getRandomFoodPosition() {
    let nextFood = null;

    do {
        nextFood = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
    } while (snake.some(segment => segment.x === nextFood.x && segment.y === nextFood.y));

    return nextFood;
}

function getCurrentSpeed() {
    return Math.max(minSpeed, baseSpeed - Math.floor(score / scoreStep) * speedStep);
}

function startSnakeLoop() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        render();
    }, getCurrentSpeed());
}

function endGame() {
    clearInterval(intervalId);
    clearInterval(timerIntervalid);
    finalScoreElement.innerText = score;
    finalHighestScoreElement.innerText = highestScore;
    modal.style.display = 'flex';
    StartGameModal.style.display = 'none';
    GameOverModal.style.display = 'flex';
}

food = getRandomFoodPosition();

function render() {
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add('food');

    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    }
    else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    }
    else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }
    else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }

    const ateFood = head.x === food.x && head.y === food.y;
    const bodyToCheck = ateFood ? snake : snake.slice(0, -1);

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        endGame();
        return;
    }

    const hitSelf = bodyToCheck.some(segment => segment.x === head.x && segment.y === head.y);
    if (hitSelf) {
        endGame();
        return;
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill', 'snake-head');
    });

    snake.unshift(head);

    if (ateFood) {
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = getRandomFoodPosition();
        score += 10;
        scoreelement.innerText = score;

        if (score > highestScore) {
            highestScore = score;
            localStorage.setItem('highestScore', highestScore);
            highestScoreelement.innerText = highestScore;
        }
        startSnakeLoop();
    } else {
        snake.pop();
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    });
    blocks[`${snake[0].x}-${snake[0].y}`].classList.add('snake-head');
    blocks[`${food.x}-${food.y}`].classList.add('food');
}

startButton.addEventListener('click', ()=>{
    modal.style.display = 'none';
    StartGameModal.style.display = 'flex';
    GameOverModal.style.display = 'none';
    startSnakeLoop();
    timerIntervalid = setInterval(() => {
       let [min,sec] = time.split("-").map(Number);
       sec++;
       time = `${min}-${sec}`;
       timetelement.innerText = time;
    }, 1000);
})

restartButton.addEventListener('click', restartGame);

function restartGame(){

    blocks[`${food.x}-${food.y}`].classList.remove('food');
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill', 'snake-head');
    });
    score = 0;
    time = `00-00`;
    scoreelement.innerText = score;
    timetelement.innerText = time;
    highestScoreelement.innerText = highestScore;

    clearInterval(intervalId);
    direction = 'down';
    clearInterval(timerIntervalid);
    modal.style.display = 'none';
    StartGameModal.style.display = 'flex';
    GameOverModal.style.display = 'none';
    snake = [{ x: 1, y: 3 }];
    food = getRandomFoodPosition();
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    });
    blocks[`${snake[0].x}-${snake[0].y}`].classList.add('snake-head');
    blocks[`${food.x}-${food.y}`].classList.add('food');
    startSnakeLoop();
    timerIntervalid = setInterval(() => {
       let [min,sec] = time.split("-").map(Number);
       sec++;
       time = `${min}-${sec}`;
       timetelement.innerText = time;
    }, 1000);
}



addEventListener('keydown', (e) => {
    direction = e.key;
    if (direction === "ArrowUp") {
        direction = "up";
    }
    else if (direction === "ArrowDown") {
        direction = "down";
    }
    else if (direction === "ArrowRight") {
        direction = "right";
    }
    else if (direction === "ArrowLeft") {
        direction = "left";
    }
});
