let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');

let player = {
  x: 400,
  y: 300,
  width: 50,
  height: 50,
  dx: 4,  // Player's speed has been doubled
  dy: 4   // Player's speed has been doubled
};

let lasers = [];

let enemies = [
  {x: 100, y: 100, width: 50, height: 50},
  {x: 200, y: 200, width: 50, height: 50},
  {x: 300, y: 300, width: 50, height: 50}
]; // Multiple enemies have been added

let keys = {};
let score = 0;
document.getElementById('score').innerHTML = "Score: " + score;

window.addEventListener('keydown', function(e) {
  keys[e.keyCode] = true;
  if (e.keyCode === 32) {
    lasers.push({
      x: player.x + player.width / 2,
      y: player.y,
      width: 5,
      height: 15,
      dy: -4
    });
  }
}, false);

window.addEventListener('keyup', function(e) {
  delete keys[e.keyCode];
}, false);

function game() {
  update();
  render();
  collisionDetection();
  window.requestAnimationFrame(game);
}

function update() {
  if (keys[87]) player.y -= player.dy; // w
  if (keys[83]) player.y += player.dy; // s
  if (keys[65]) player.x -= player.dx; // a
  if (keys[68]) player.x += player.dx; // d

  for (let i = 0; i < lasers.length; i++) {
    lasers[i].y += lasers[i].dy;
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
  for (let i = 0; i < lasers.length; i++) {
    context.fillRect(lasers[i].x, lasers[i].y, lasers[i].width, lasers[i].height);
  }
}

function collisionDetection() {
  for (let i = 0; i < lasers.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (lasers[i].x < enemies[j].x + enemies[j].width &&
        lasers[i].x + lasers[i].width > enemies[j].x &&
        lasers[i].y < enemies[j].y + enemies[j].height &&
        lasers[i].y + lasers[i].height > enemies[j].y) {
        // collision detected!
        enemies.splice(j, 1);  // remove enemy
        lasers.splice(i, 1);   // remove laser
        score++;
        document.getElementById('score').innerHTML = "Score: " + score;
        break;
      }
    }
  }
}

game();
