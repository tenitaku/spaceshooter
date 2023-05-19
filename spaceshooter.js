var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var score = 0;

var player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    dx: 0
};

var enemies = [];
var playerLasers = [];
var enemyLasers = [];

var lastEnemySpawnTime = 0;
var lastPlayerLaserTime = 0;
var lastEnemyLaserTime = 0;

// Controls
document.getElementById('leftBtn').addEventListener('touchstart', function() {
    player.dx = -2;
});

document.getElementById('rightBtn').addEventListener('touchstart', function() {
    player.dx = 2;
});

document.getElementById('leftBtn').addEventListener('touchend', function() {
    player.dx = 0;
});

document.getElementById('rightBtn').addEventListener('touchend', function() {
    player.dx = 0;
});

var gameInterval = setInterval(gameLoop, 10);

function gameLoop() {
    // Clear screen
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    context.fillRect(player.x, player.y, player.width, player.height);

    // Move player
    player.x += player.dx;

    // Enemy spawn
    if (Date.now() - lastEnemySpawnTime > 1000) {
        var enemy = {
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 50,
            height: 50,
            dy: 1
        };
        enemies.push(enemy);
        lastEnemySpawnTime = Date.now();
    }

    // Draw enemies and handle enemy lasers
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemy.dy;

        if (Date.now() - lastEnemyLaserTime > 500) {
            var laser = {
                x: enemy.x + 25,
                y: enemy.y + 50,
                width: 5,
                height: 10,
                dy: 2
            };
            enemyLasers.push(laser);
            lastEnemyLaserTime = Date.now();
        }
    }

    // Player laser spawn
    if (Date.now() - lastPlayerLaserTime > 500) {
        var laser = {
            x: player.x + 25,
            y: player.y,
            width: 5,
            height: 10,
            dy: -2
        };
        playerLasers.push(laser);
        lastPlayerLaserTime = Date.now();
    }

    // Draw lasers
    for (var i = 0; i < playerLasers.length; i++) {
        var laser = playerLasers[i];
        context.fillRect(laser.x, laser.y, laser.width, laser.height);
        laser.y += laser.dy;

        if (laser.y + laser.height < 0) {
            playerLasers.splice(i, 1);
            i--;
        }
    }

    // Draw enemy lasers
    for (var i = 0; i < enemyLasers.length; i++) {
        var laser = enemyLasers[i];
        context.fillRect(laser.x, laser.y, laser.width, laser.height);
        laser.y += laser.dy;

        if (laser.y > canvas.height) {
            enemyLasers.splice(i, 1);
            i--;
        }
    }

    // Collision detection
    for (var i = playerLasers.length - 1; i >= 0; i--) {
        var laser = playerLasers[i];
        for (var j = enemies.length - 1; j >= 0; j--) {
            var enemy = enemies[j];
            if (laser.x < enemy.x + enemy.width &&
                laser.x + laser.width > enemy.x &&
                laser.y < enemy.y + enemy.height &&
                laser.y + laser.height > enemy.y) {
                // Collision detected
                playerLasers.splice(i, 1);
                enemies.splice(j, 1);
                score++;
                document.getElementById('score').innerText = 'Score: ' + score;
                break;
            }
        }
    }

    // Game Over
    for (var i = enemyLasers.length - 1; i >= 0; i--) {
        var laser = enemyLasers[i];
        if (laser.x < player.x + player.width &&
            laser.x + laser.width > player.x &&
            laser.y < player.y + player.height &&
            laser.y + laser.height > player.y) {
            // Collision detected
            clearInterval(gameInterval);
            alert('Game Over!');
            break;
        }
    }

    // Game Over by Enemy Collision
    for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];
        if (enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y) {
            // Collision detected
            clearInterval(gameInterval);
            alert('Game Over!');
            break;
        }
    }

    // Remove enemies outside the screen
    for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
        }
    }
}

