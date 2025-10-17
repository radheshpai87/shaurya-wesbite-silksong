// Catch the Geo Game
let score = 0;
let timeLeft = 30;
let gameActive = false;
let gameInterval;
let spawnInterval;
let highScore = parseInt(localStorage.getItem('geoHighScore')) || 0;
let currentSpawnRate = 800; // Starting spawn rate in ms

// DOM elements
const startBtn = document.getElementById('startBtn');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const highScoreDisplay = document.getElementById('highScore');
const gameMessage = document.getElementById('gameMessage');

// Initialize - wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  highScoreDisplay.textContent = highScore;
  
  // Start game
  startBtn.addEventListener('click', startGame);
});

function startGame() {
  gameActive = true;
  score = 0;
  timeLeft = 30;
  currentSpawnRate = 800;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  startBtn.style.display = 'none';
  gameMessage.classList.add('hidden');
  
  // Start timer with difficulty increase
  gameInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    
    // Increase difficulty every 5 seconds
    if (timeLeft % 5 === 0 && timeLeft > 0) {
      increaseDifficulty();
    }
    
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
  
  // Start spawning coins
  spawnCoins();
}

function spawnCoins() {
  if (gameActive) {
    spawnCoin();
    // Schedule next spawn with current rate
    spawnInterval = setTimeout(spawnCoins, currentSpawnRate);
  }
}

function increaseDifficulty() {
  // Decrease spawn rate (spawn more frequently)
  currentSpawnRate = Math.max(300, currentSpawnRate - 100);
  console.log(`Difficulty increased! Spawn rate: ${currentSpawnRate}ms`);
}

function getCurrentFallSpeed() {
  // Calculate fall speed based on time remaining
  // Starts at 2-4, ends at 5-8 (progressively faster)
  const timeElapsed = 30 - timeLeft;
  const speedMultiplier = 1 + (timeElapsed / 30) * 2; // 1x to 3x speed
  const baseSpeed = 2 + Math.random() * 2;
  return baseSpeed * speedMultiplier;
}

function spawnCoin() {
  const coin = document.createElement('div');
  coin.classList.add('geo-coin');
  
  // Random horizontal position
  const maxX = gameContainer.clientWidth - 60;
  const randomX = Math.random() * maxX;
  coin.style.left = randomX + 'px';
  coin.style.top = '-60px';
  
  gameContainer.appendChild(coin);
  
  // Animate coin falling with progressive speed
  let position = -60;
  const fallSpeed = getCurrentFallSpeed(); // Use dynamic speed
  
  const fallInterval = setInterval(() => {
    if (!gameActive) {
      clearInterval(fallInterval);
      if (coin.parentNode) {
        coin.remove();
      }
      return;
    }
    
    position += fallSpeed;
    coin.style.top = position + 'px';
    
    // Remove coin if it reaches bottom
    if (position > gameContainer.clientHeight) {
      clearInterval(fallInterval);
      if (coin.parentNode) {
        coin.remove();
      }
    }
  }, 20);
  
  // Click handler
  coin.addEventListener('click', () => {
    if (gameActive && !coin.classList.contains('clicked')) {
      coin.classList.add('clicked');
      score++;
      scoreDisplay.textContent = score;
      
      // Play click effect
      coin.style.pointerEvents = 'none';
      
      setTimeout(() => {
        if (coin.parentNode) {
          coin.remove();
        }
      }, 300);
      
      clearInterval(fallInterval);
    }
  });
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearTimeout(spawnInterval);
  
  // Remove all remaining coins
  const coins = document.querySelectorAll('.geo-coin');
  coins.forEach(coin => coin.remove());
  
  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('geoHighScore', highScore.toString());
    highScoreDisplay.textContent = highScore;
  }
  
  // Show message briefly then show start button
  gameMessage.classList.remove('hidden');
  
  setTimeout(() => {
    gameMessage.classList.add('hidden');
    startBtn.style.display = 'block';
  }, 2000);
}
