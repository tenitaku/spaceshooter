// ゲームの状態を表す変数
let isGameOver;
let score;

// プレーヤーの情報を表すオブジェクト
let player;
const playerWidth = 50;
const playerHeight = 50;

// ミサイルの情報を表すオブジェクト
let missile;
const missileWidth = 10;
const missileHeight = 30;
const missileSpeed = 5;

// 敵機の情報を表すオブジェクト
let enemy;
const enemyWidth = 50;
const enemyHeight = 50;
const enemySpeed = 2;

// キー入力の状態を表すオブジェクト
let keys = {};

// 描画用のキャンバスとコンテキスト
let canvas;
let ctx;

// スタートボタンとリトライボタン
let startButton;
let retryButton;

// ゲームの初期化処理
function init() {
  isGameOver = true;
  score = 0;

  player = {
    x: canvas.width / 2 - playerWidth / 2,
    y: canvas.height - playerHeight - 10,
    width: playerWidth,
    height: playerHeight,
  };

  missile = {
    x: 0,
    y: 0,
    width: missileWidth,
    height: missileHeight,
    isActive: false,
  };

  enemy = {
    x: 0,
    y: 0,
    width: enemyWidth,
    height: enemyHeight,
    isActive: false,
  };

  canvas.addEventListener('keydown', handleKeyDown);
  canvas.addEventListener('keyup', handleKeyUp);

  startButton = createButton('Start', startGame);
  retryButton = createButton('Retry', restartGame);

  updateScore();
  updateButtons();
}

// ゲームの開始処理
function startGame() {
  isGameOver = false;
  hideButton(startButton);
  hideButton(retryButton);
  requestAnimationFrame(gameLoop);
}

// ゲームのリスタート処理
function restartGame() {
  showButton(startButton);
  hideButton(retryButton);
  init();
}

// ゲームループ
function gameLoop() {
  if (isGameOver) {
    return;
  }

  update();
  render();

  requestAnimationFrame(gameLoop);
}

// ゲームの状態を更新
function update() {
  movePlayer();
  moveMissile();
  moveEnemy();

  checkCollision();
}

// ゲーム画面を描画
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawMissile();
  drawEnemy();
}

// プレーヤーの移動処理
function movePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) {
      player.x -= 5;
    }
  
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
      player.x += 5;
    }
  }

// ミサイルの移動処理
function moveMissile() {
  if (missile.isActive) {
    missile.y -= missileSpeed;

    if (missile.y < 0) {
      missile.isActive = false;
    }
  }
}

// 敵機の移動処理
function moveEnemy() {
  if (!enemy.isActive) {
    enemy.x = Math.random() * (canvas.width - enemy.width);
    enemy.y = -enemy.height;
    enemy.isActive = true;
  }

  enemy.y += enemySpeed;

  if (enemy.y > canvas.height) {
    enemy.isActive = false;
  }
}

// 衝突判定の処理
function checkCollision() {
  if (isColliding(player, enemy) || isColliding(missile, enemy)) {
    gameOver();
  }
}

// ゲームオーバー処理
function gameOver() {
  isGameOver = true;
  showButton(retryButton);
}

// 衝突判定
function isColliding(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// プレーヤーを描画
function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// ミサイルを描画
function drawMissile() {
  if (missile.isActive) {
    ctx.fillStyle = 'red';
    ctx.fillRect(missile.x, missile.y, missile.width, missile.height);
  }
}

// 敵機を描画
function drawEnemy() {
  if (enemy.isActive) {
    ctx.fillStyle = 'green';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }
}

// スコアを更新
function updateScore() {
  document.getElementById('score').innerText = `Score: ${score}`;
}

// キーの押下状態を記録
function handleKeyDown(e) {
    keys[e.key] = true;
  
    if (e.key === ' ') { // スペースキー
      e.preventDefault(); // ブラウザのデフォルトのスクロールなどを無効化
      fireMissile();
    }
  }

// キーの解放状態を記録
function handleKeyUp(e) {
    keys[e.key] = false;
}

// ミサイルを発射
function fireMissile() {
  missile.x = player.x + player.width / 2 - missile.width / 2;
  missile.y = player.y;
  missile.isActive = true;
}

// ボタンを作成
function createButton(text, clickHandler) {
  const button = document.createElement('button');
  button.innerText = text;
  button.addEventListener('click', clickHandler);
  document.body.appendChild(button);
  return button;
}

// ボタンを表示
function showButton(button) {
  button.style.display = 'block';
}

// ボタンを非表示
function hideButton(button) {
  button.style.display = 'none';
}

function start() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
  
    init();
  }
  
window.addEventListener('DOMContentLoaded', start);
  
