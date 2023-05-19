let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');

let player = {
    x: 400,
    y: 500,
    width: 50,
    height: 50,
    dx: 4
};

let playerLasers = [];
let enemyLasers = [];
let enemies = [];
let keys = {};
let score = 0;
let gameInterval;

document.getElementById('startButton').addEventListener('click', startGame);

window.addEventListener('keydown', function(e) {
    keys[e.keyCode] = true;
}, false);

window.addEventListener('keyup', function(e) {
    delete keys[e.keyCode];
}, false);

function startGame() {
    gameInterval = setInterval(game, 10);
    setInterval(spawnEnemy, 1000);
}

function game() {
    update();
    render();
    collisionDetection();
}

function update() {
    if (keys[37]) player.x -= player.dx; // left arrow key
    if (keys[39]) player.x += player.dx; // right arrow key

    playerLasers.push({
        x: player.x + player.width / 2,
        y: player.y,
        width: 5,
        height: 15,
        dy: -4
    });

    for (let i = 0; i < playerLasers.length; i++) {
        playerLasers[i].y += playerLasers[i].dy;
    }

    for (let i = 0; i < enemies.length; i++) {
        if (Math.random() < 0.002) {
            enemyLasers.push({
                x: enemies[i].x,
                y: enemies[i].y,
                width: 5,
                height: 15,
                dy: 2
            });
        }
    }

    for (let i = 0; i < enemyLasers.length; i++) {
        enemyLasers[i].y += enemyLasers[i].dy;
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'green';
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = 'red';
    for (let i = 0; i < enemies.length; i++) {
        context.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }

    context.fillStyle = 'orange';
    for (let i = 0; i < playerLasers.length; i++) {
        context.fillRect(playerLasers[i].x, playerLasers[i].y, playerLasers[i].width, playerLasers[i].height);
    }

    context.fillStyle = 'blue';
    for (let i = 0; i < enemyLasers.length; i++) {
        context.fillRect(enemyLasers[i].x, enemyLasers[i].y, enemyLasers[i].width, enemyLasers[i].height);
    }
}

function collisionDetection() {
    for (let i = 0; i < playerLasers.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (playerLasers[i].x < enemies[j].x + enemies[j].width &&
                playerLasers[i].x + playerLasers[i].width > enemies[j].x &&
                playerLasers[i].y < enemies[j].y + enemies[j].height &&
                playerLasers[i].y + playerLasers[i].height > enemies[j].y) {
                enemies.splice(j, 1);
                playerLasers.splice(i, 1);
                score++;
                document.getElementById('score').innerHTML = "Score: " + score;
                break;
            }
        }
    }

    for (let i = 0; i < enemyLasers.length; i++) {
        if (enemyLasers[i].x < player.x + player.width &&
            enemyLasers[i].x + enemyLasers[i].width > player.x &&
            enemyLasers[i].y < player.y + player.height &&
            enemyLasers[i].y + enemyLasers[i].height > player.y) {
            clearInterval(gameInterval);
            alert('Game Over!');
            document.location.reload();
        }
    }
}

function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 50),
        y: 0,
        width: 50,
        height: 50
    });
}

