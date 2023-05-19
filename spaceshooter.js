document.addEventListener("DOMContentLoaded", function() {
    // Game canvas
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
  
    // Player
    const playerWidth = 50;
    const playerHeight = 50;
    const playerSpeed = 5;
    const player = {
      x: canvas.width / 2 - playerWidth / 2,
      y: canvas.height - playerHeight - 10,
      width: playerWidth,
      height: playerHeight,
      isMovingLeft: false,
      isMovingRight: false
    };
  
    // Laser
    const laserWidth = 10;
    const laserHeight = 20;
    const laserSpeed = 10;
    const lasers = [];
  
    // Enemy
    const enemyWidth = 50;
    const enemyHeight = 50;
    const enemySpeed = 2;
    const enemies = [];
  
    // Game state
    let score = 0;
    let isGameOver = false;
  
    // Game over text
    const gameOverText = document.getElementById("gameOverText");
  
    // Retry button
    const retryButton = document.getElementById("retryButton");
  
    // Event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    retryButton.addEventListener("click", startGame);
  
    // Start the game
    startGame();
  
    function startGame() {
      isGameOver = false;
      score = 0;
      player.x = canvas.width / 2 - playerWidth / 2;
      player.isMovingLeft = false;
      player.isMovingRight = false;
      lasers.length = 0;
      enemies.length = 0;
      spawnEnemy();
      draw();
      update();
      gameOverText.style.display = "none";
      retryButton.style.display = "none";
    }
  
    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") {
        player.isMovingLeft = true;
      } else if (event.key === "ArrowRight") {
        player.isMovingRight = true;
      }
    }
  
    function handleKeyUp(event) {
      if (event.key === "ArrowLeft") {
        player.isMovingLeft = false;
      } else if (event.key === "ArrowRight") {
        player.isMovingRight = false;
      }
    }
  
    function update() {
      if (isGameOver) {
        return;
      }
  
      // Move player
      if (player.isMovingLeft && player.x > 0) {
        player.x -= playerSpeed;
      } else if (player.isMovingRight && player.x + player.width < canvas.width) {
        player.x += playerSpeed;
      }
  
      // Move lasers
      for (let i = 0; i < lasers.length; i++) {
        const laser = lasers[i];
        laser.y -= laserSpeed;
  
        // Remove lasers that are out of bounds
        if (laser.y < 0) {
          lasers.splice(i, 1);
          i--;
        }
      }
  
      // Move enemies and check collision with player
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        enemy.y += enemySpeed;
  
        // Check collision with player
        if (checkCollision(player, enemy)) {
          gameOver();
          return;
        }
  
        // Remove enemies that are out of bounds
        if (enemy.y > canvas.height) {
          enemies.splice(i, 1);
          i--;
        }
      }
  
      // Check collision between lasers and enemies
      for (let i = 0; i < lasers.length; i++) {
        const laser = lasers[i];
  
        for (let j = 0; j < enemies.length; j++) {
          const enemy = enemies[j];
  
          if (checkCollision(laser, enemy)) {
            lasers.splice(i, 1);
            i--;
            enemies.splice(j, 1);
            j--;
            score++;
            break;
          }
        }
      }
  
      spawnEnemy();
      draw();
      requestAnimationFrame(update);
    }
  
    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw player
      ctx.fillStyle = "red";
      ctx.fillRect(player.x, player.y, player.width, player.height);
  
      // Draw lasers
      ctx.fillStyle = "green";
      for (const laser of lasers) {
        ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
      }
  
      // Draw enemies
      ctx.fillStyle = "blue";
      for (const enemy of enemies) {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      }
  
      // Draw score
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";
      ctx.fillText("Score: " + score, 10, 30);
    }
  
    function spawnEnemy() {
      if (Math.random() < 0.02) {
        const enemyX = Math.random() * (canvas.width - enemyWidth);
        const enemy = {
          x: enemyX,
          y: 0,
          width: enemyWidth,
          height: enemyHeight
        };
        enemies.push(enemy);
      }
    }
  
    function gameOver() {
      isGameOver = true;
      gameOverText.style.display = "block";
      retryButton.style.display = "block";
    }
  
    function checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    }
  });
  