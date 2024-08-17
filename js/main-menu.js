//game music
const gameMusic = document.getElementById('game-music');
const btnSound = document.getElementById('btn-sound');
const invalidSound = document.getElementById('invalid-sound');
const successSound = document.getElementById('success-sound');
let playSounds = checkSoundSetup();

//welcome modal 
setTimeout(function() {
  if (!isWelcomeDisplayed()) {
  document.querySelector('.game-welcome-modal').style.display = "flex"
}
}, 2000);

function isWelcomeDisplayed() {
  return localStorage.getItem("welcomeDisplay")
}
function saveWelcomeDisplay() {
  localStorage.setItem("welcomeDisplay", true);
  document.querySelector('.game-welcome-modal').style.display = "none"
}

//game data
  const coinsAvailable = document.querySelector('.coins');
  const miceAvailable = document.querySelector('.mice');
let commentPopUp = document.querySelector('.comment-popup');
let commentPopUpFirstWord = document.querySelector('.first-word');
let commentPopUpLastWord = document.querySelector('.last-word');

//background image
document.body.style.backgroundImage = "url(bg/main-menu.gif)";
commentPopUp.style.backgroundImage = "url(comment.png)";

//game stats
let gameStats = {
  level: loadUserLevel(),
  claimedLevels: loadClaimedLevels(),
  correctGuesses: 0,
  incorrectGuesses: 0,
  bestStreak: 0,
  currentStreak: 0,
  losingStreak: 0,
  highestLosingStreak: 0,
  totalCoins: 0,
  currentCoins: 0,
  spentCoins: 0,
  totalMice: 0,
  currentMice: 0,
  spentMice: 0,
  totalTimePlayed: 0,
  fastestCorrectGuess: null,
  slowestCorrectGuess: null,
  totalGamesPlayed: 0,
  gameCompletion: 0,
  startTime: null
};
let maxAttempt, xp;
document.querySelector('.xp').innerHTML = loadSavedXP();
function initRank() {
  xp = loadSavedXP();
  if (xp >= 8875) {
    rank = "Conqueror"
  } else if (xp >= 5000) {
    rank = "Legendary"
  } else if (xp >= 3000) {
    rank = "Veteran"
  } else if (xp >= 2000) {
    rank = "Seasoned"
  } else if (xp >= 1000) {
    rank = "Proficient"
  } else if (xp >= 500) {
    rank = "Skilled"
  } else if (xp >= 200) {
    rank = "Practiced"
  } else if (xp >= 100) {
    rank = "Experienced"
  } else {
    rank = "Newbie"
  }
}

// get user level
let userLevel = loadUserLevel();
  function loadUserLevel() {
    return parseInt(localStorage.getItem('userLevel')) || 0;
  }
  function loadClaimedLevels() {
  const claimedLevels = localStorage.getItem('claimedLevels');
  return claimedLevels ? JSON.parse(claimedLevels) : [];
}
  // get user XP
  function loadSavedXP() {
    return parseInt(localStorage.getItem('savedXP')) || 0;
  }
  //check for coins
coinsAvailable.innerHTML = loadCurrentCoins();
function loadCurrentCoins() {
  coins = localStorage.getItem('currentCoins');
  if (coins) {
   return coins = Number(coins)
  } else {
   return coins = 0
  }
}
function loadSpentCoins() {
  spentCoins = localStorage.getItem('spentCoins');
  if (spentCoins) {
   return spentCoins = Number(spentCoins)
  } else {
   return spentCoins = 0
  }
}
function saveUserCoins(coins) {
  localStorage.setItem('currentCoins', coins);
}
function saveSpentCoins(coins) {
  localStorage.setItem('spentCoins', coins);
}
//check for mice
miceAvailable.innerHTML = loadCurrentMice();
function loadCurrentMice() {
  mice = localStorage.getItem('currentMice');
  if (mice) {
   return mice = Number(mice)
  } else {
   return mice = 0
  }
}
function loadSpentMice() {
  spentMice = localStorage.getItem('spentMice');
  if (spentMice) {
   return spentMice = Number(spentMice)
  } else {
   return spentMice = 0
  }
}
function saveUserMice(mice) {
  localStorage.setItem('currentMice', mice);
}
function saveSpentMice(mice) {
  localStorage.setItem('spentMice', mice);
}

  // current city
  function loadCurrentCity() {
    if (userLevel == 9) {
      return "Rio"
    } else if (userLevel == 8) {
      return "Sydney"
    } else if (userLevel == 7) {
      return "New York"
    } else if (userLevel == 6) {
      return "Lagos"
    } else if (userLevel == 5) {
      return "Cairo"
    } else if (userLevel == 4) {
      return "Tokyo"
    } else if (userLevel == 3) {
      return "Dubai"
    } else if (userLevel == 2) {
      return "Paris"
    } else {
      return "Madrid"
    }
  }
  
   // highest Number
  function loadHighestNumber() {
    if (userLevel == 9) {
      return "5000"
    } else if (userLevel == 8) {
      return "2000"
    } else if (userLevel == 7) {
      return "1000"
    } else if (userLevel == 6) {
      return "500"
    } else if (userLevel == 5) {
      return "200"
    } else if (userLevel == 4) {
      return "100"
    } else if (userLevel == 3) {
      return "50"
    } else if (userLevel == 2) {
      return "20"
    } else {
      return "10"
    }
  }

// Load claimed achievements from LocalStorage
function loadClaimedAchievements() {
  const claimed = localStorage.getItem('claimedAchievements');
  return claimed ? JSON.parse(claimed) : [];
}

//add sounds to buttons
let menuButtons = document.querySelectorAll('.menu-img');
for (var i = menuButtons.length - 1; i >= 0; i--) {
  menuButtons[i].addEventListener('click', function(){
    if (playSounds) {
      btnSound.play()
    }
  });
}

document.querySelector('.game-footer').addEventListener('click', function(){
    if (playSounds) {
      btnSound.play()
    }
  });


//mouse shop
function buyMouse(mouseType, price) {
  let x = loadCurrentCoins(),
      y = loadCurrentMice(),
      z = loadSpentCoins();
  if (x >= price) {
    if (playSounds) {
     successSound.play();
   }
    x -= price;
    y += mouseType;
    z += price;
    saveUserCoins(x);
    saveUserMice(y);
    saveSpentCoins(z);
    commentPopUpFirstWord.innerHTML = mouseType;
    commentPopUpLastWord.innerHTML = "mice purchased!";
    commentModal();
    renderShopStats();
    renderStats()
  } else {
    if (playSounds) {
     invalidSound.play();
   }
    commentPopUpFirstWord.innerHTML = "not";
    commentPopUpLastWord.innerHTML = "enouch coins!";
    commentModal();
  }
}
function renderShopStats() {
 document.querySelector('.shop-coins').textContent = loadCurrentCoins();
 document.querySelector('.shop-mice').textContent = loadCurrentMice();
  coinsAvailable.innerHTML = loadCurrentCoins();
  miceAvailable.innerHTML = loadCurrentMice();
}
renderShopStats();



//comment modal
function commentModal() {
  commentPopUp.style.display = "block";
  setTimeout(function() {
    commentPopUp.style.display = "none";
  }, 2000);
}


//achievements - fetch all achievements
let achievements, coinImg;
getAllAchievments();
// user object to track achievement parameters
let isThreeStars, stars, gameTime, t, gameAttempts, att, gameHints, h;
checkForAchievements();
gameStats = loadGameStats();
renderStats();
const user = {
  xp: xp,
  star: stars,
  coins: coins,
  time: t,
  attempt: att,
  hintUsed: h,
  firstGame: true,
  winStreak: gameStats.bestStreak,
  losingStreak: gameStats.losingStreak,
  totalCorrectGuesses: gameStats.correctGuesses,
  totalGamesPlayed: gameStats.totalGamesPlayed,
  totalCoins: loadCurrentCoins() + loadSpentCoins(),
  claimedAchievements: loadClaimedAchievements()
};

const achievementsContainer = document.getElementById('achievements');
const menuBtn = document.querySelector('.menu-btn');

// Load claimed achievements from LocalStorage
function loadClaimedAchievements() {
  const claimed = localStorage.getItem('claimedAchievements');
  return claimed ? JSON.parse(claimed) : [];
}

// Save claimed achievements to LocalStorage
function saveClaimedAchievements(claimedAchievements) {
  localStorage.setItem('claimedAchievements', JSON.stringify(claimedAchievements));
}

// Check if the user meets the condition
function checkCondition(condition) {
  if (condition.type === 'xp') {
    return user.xp >= condition.value;
  } else if (condition.type === 'firstGame') {
    return user.firstGame == condition.value;
  } else if (condition.type === 'winStreak') {
    return user.winStreak >= condition.value;
  } else if (condition.type === 'loseStreak') {
    return user.losingStreak == condition.value;
  } else if (condition.type === 'star') {
    return user.star == condition.value;
  } else if (condition.type === 'time') {
    return user.time <= condition.value;
  } else if (condition.type === 'attempt') {
    return user.attempt == condition.value;
  } else if (condition.type === 'allCorrectGuesses') {
    return user.totalCorrectGuesses >= condition.value;
  } else if (condition.type === 'allGameRounds') {
    return user.totalGamesPlayed >= condition.value;
  } else if (condition.type === 'hintUsed') {
    return user.hintUsed == condition.value;
  } else if (condition.type === 'totalCoins') {
    return user.totalCoins >= condition.value;
  }
  return false;
}

// Render the achievements, coins, and notifications
function renderAchievements() {
  const claimedAchievements = loadClaimedAchievements();
  achievementsContainer.innerHTML = '';
  let unclaimedAchievements = false;
  
  achievements.forEach(achievement => {
    const achievementDiv = document.createElement('div');
    achievementDiv.className = 'achievement';

    const achievementName = document.createElement('span');
    achievementName.className = 'achievement-name';
    achievementName.textContent = `${achievement.name}`;
    
    const achievementDesc = document.createElement('span');
    achievementDesc.textContent = `${achievement.desc}`;
    
    const achievementReward = document.createElement('span');
    achievementReward.style.display = "flex";
    achievementReward.innerHTML = `${achievement.reward}`;
    
    const rewardDiv = document.createElement('div');
    rewardDiv.className = 'reward-container';

    const rewardButton = document.createElement('button');
    rewardButton.className = 'reward-button';
    if (user.claimedAchievements.includes(achievement.id)) {
      rewardButton.textContent = 'Claimed';
      rewardButton.style.color = '#bfbfbf';
      rewardButton.style.backgroundColor = '#a78d00'
    } else {
      rewardButton.textContent = 'Claim Reward'
    }
    
    rewardButton.disabled = user.claimedAchievements.includes(achievement.id) || !checkCondition(achievement.condition);

    rewardButton.addEventListener('click', () => {
      claimReward(achievement.id);
    });

  achievementDiv.appendChild(achievementName);
  achievementDiv.appendChild(achievementDesc);
  achievementDiv.appendChild(rewardDiv);
  rewardDiv.appendChild(achievementReward);
  rewardDiv.appendChild(rewardButton);

    achievementsContainer.appendChild(achievementDiv);
    
  if (!user.claimedAchievements.includes(achievement.id) && checkCondition(achievement.condition)) {
      unclaimedAchievements = true;
    }
  });
}

// Claim the reward and update coins
function claimReward(id) {
  const achievement = achievements.find(a => a.id === id);
  
  if (achievement && !user.claimedAchievements.includes(id) && checkCondition(achievement.condition)) {
    if (playSounds) {
     successSound.play();
   }
    user.claimedAchievements.push(id);
    user.coins += achievement.coins;
    saveClaimedAchievements(user.claimedAchievements);
    saveUserCoins(user.coins);
    coinsAvailable.innerHTML = user.coins;
    commentPopUpFirstWord.innerHTML = "You have claimed the reward:";
    commentPopUpLastWord.innerHTML = achievement.reward;
      commentModal();
    renderAchievements();
    renderStats();
  }
}

//check and validate achievements
function checkForAchievements() {
  //check for three stars achievement
isThreeStars = localStorage.getItem("isThreeStars");
  if (isThreeStars) {
    stars = 3;
  } else {
    stars = 0
  }
  
//check for time achievements
gameTime = Number(localStorage.getItem("gameTime"));
  if (gameTime) {
    t = gameTime;
  } else {
    t = 100
  }
//check for attempt achievements
gameAttempts = Number(localStorage.getItem("gameAttempts"));
  if (gameAttempts) {
    att = gameAttempts;
  } else {
    att = 0
  }
//check for hint-used achievement
gameHints = localStorage.getItem("gameHints");
  if (gameHints) {
    h = false;
  } else {
    h = true
  }
}
//list of all achievements
function getAllAchievments() {
coinImg = '<img src="img/coin.png" width="20px" />';
achievements = [
  { id: 1, name: 'welcome', desc: 'Play first game', reward: '<img src="img/coin.png" width="20px" /><span>10</span>', coins: 10, condition: { type: 'firstGame', value: true } },
  { id: 2, name: 'streak starter', desc: 'Guess right 3 times in a row', reward: `${coinImg}<span>20</span>`, coins: 20, condition: { type: 'winStreak', value: 3 } },
  { id: 3, name: 'hot streak', desc: 'Guess right 5 times in a row', reward: `${coinImg}<span>50</span>`, coins: 50, condition: { type: 'winStreak', value: 5 } },
  { id: 4, name: 'blazing', desc: 'Guess right 10 times in a row', reward: `${coinImg}<span>100</span>`, coins: 100, condition: { type: 'winStreak', value: 10 } },
  { id: 5, name: 'unstoppable', desc: 'Guess right 20 times in a row', reward: `${coinImg}<span>200</span>`, coins: 200, condition: { type: 'winStreak', value: 20 } },
  { id: 6, name: 'god', desc: 'Guess right 50 times in a row', reward: `${coinImg}<span>500</span>`, coins: 500, condition: { type: 'winStreak', value: 50 } },
  { id: 7, name: 'cold streak', desc: 'Lose game 3 times in a row', reward: `${coinImg}<span>10</span>`, coins: 10, condition: { type: 'loseStreak', value: 3 } },
  { id: 8, name: 'sub zero', desc: 'Lose game 5 times in a row', reward: `${coinImg}<span>20</span>`, coins: 20, condition: { type: 'loseStreak', value: 5 } },
  { id: 9, name: 'absolute zero', desc: 'Lose game 10 times in a row', reward: `${coinImg}<span>50</span>`, coins: 50, condition: { type: 'loseStreak', value: 10 } },
  { id: 10, name: 'estimator', desc: 'Earn 3 stars', reward: '<img src="img/coin.png" width="20px" /><span>50</span>', coins: 50, condition: { type: 'star', value: 3 } },
  { id: 11, name: 'Experienced', desc: 'Earn 100 XP', reward: `${coinImg}<span>50</span>`, coins: 50, condition: { type: 'xp', value: 100 } },
  { id: 12, name: 'practiced', desc: 'Earn 200 XP', reward: `${coinImg}<span>100</span>`, coins: 100, condition: { type: 'xp', value: 200 } },
  { id: 13, name: 'skilled', desc: 'Earn 500 XP', reward: `${coinImg}<span>300</span>`, coins: 300, condition: { type: 'xp', value: 500 } },
  { id: 14, name: 'proficient', desc: 'Earn 1000 XP', reward: `${coinImg}<span>700</span>`, coins: 700, condition: { type: 'xp', value: 1000 } },
  { id: 15, name: 'seasoned', desc: 'Earn 2000 XP', reward: `${coinImg}<span>1,500</span>`, coins: 1500, condition: { type: 'xp', value: 2000 } },
  { id: 16, name: 'veteran', desc: 'Earn 3,000 XP', reward: `${coinImg}<span>2,500</span>`, coins: 2000, condition: { type: 'xp', value: 3000 } },
  { id: 17, name: 'legendary', desc: 'Earn 5,000 XP', reward: `${coinImg}<span>3,000</span>`, coins: 3000, condition: { type: 'xp', value: 5000 } },
  { id: 18, name: 'voyager', desc: 'Reach Asia', reward: `${coinImg}<span>30</span>`, coins: 30, condition: { type: 'xp', value: 100 } },
  { id: 19, name: 'nomad', desc: 'Reach Africa', reward: `${coinImg}<span>50</span>`, coins: 50, condition: { type: 'xp', value: 475 } },
  { id: 20, name: 'globetrotter', desc: 'Reach North America', reward: `${coinImg}<span>100</span>`, coins: 100, condition: { type: 'xp', value: 1375 } },
  { id: 21, name: 'explorer', desc: 'Reach Australia', reward: `${coinImg}<span>200</span>`, coins: 200, condition: { type: 'xp', value: 2275 } },
  { id: 22, name: 'adventurer', desc: 'Reach South America', reward: `${coinImg}<span>500</span>`, coins: 500, condition: { type: 'xp', value: 3875 } },
  { id: 23, name: 'whirlwind', desc: 'Guess right under 60s', reward: `${coinImg}<span>20</span>`, coins: 20, condition: { type: 'time', value: 60 } },
  { id: 24, name: 'rapid-fire', desc: 'Guess right under 30s', reward: `${coinImg}<span>50</span>`, coins: 50, condition: { type: 'time', value: 30 } },
  { id: 25, name: 'flash', desc: 'Guess right under 15s', reward: `${coinImg}<span>100</span>`, coins: 100, condition: { type: 'time', value: 15 } },
  { id: 26, name: 'diviner', desc: 'Guess right at first attempt', reward: `${coinImg}<span>50</span>`, coins: 50, condition: { type: 'attempt', value: 1 } },
  { id: 27, name: 'speculator', desc: 'Guess right at only two attempts', reward: `${coinImg}<span>20</span>`, coins: 20, condition: { type: 'attempt', value: 2 } },
  { id: 28, name: 'last ride', desc: 'Guess right at final attempt', reward: `${coinImg}<span>30</span>`, coins: 30, condition: { type: 'attempt', value: maxAttempt } },
  { id: 29, name: 'predictor', desc: 'Guess right without using any hints', reward: `${coinImg}<span>20</span>`, coins: 20, condition: { type: 'hintUsed', value: false } },
  { id: 30, name: 'beginner guesser', desc: 'Accumulate 5 correct guesses', reward: `${coinImg}<span>10</span>`, coins: 10, condition: { type: 'allCorrectGuesses', value: 5 } },
  { id: 31, name: 'novice guesser', desc: 'Accumulate 10 correct guesses', reward: `${coinImg}<span>20</span>`, coins: 20, condition: { type: 'allCorrectGuesses', value: 10 } },
  { id: 32, name: 'master predictor', desc: 'Accumulate 50 correct guesses', reward: `${coinImg}<span>200</span>`, coins: 200, condition: { type: 'allCorrectGuesses', value: 50 } },
  { id: 33, name: 'grand diviner', desc: 'Accumulate 100 correct guesses', reward: `${coinImg}<span>500</span>`, coins: 500, condition: { type: 'allCorrectGuesses', value: 100 } },
  { id: 34, name: 'frequent', desc: 'Play 20 rounds of the game', reward: `${coinImg}<span>50</span>`, coins: 50, condition: { type: 'allGameRounds', value: 20 } },
  { id: 35, name: 'determined', desc: 'Play 50 rounds of the game', reward: `${coinImg}<span>100</span>`, coins: 100, condition: { type: 'allGameRounds', value: 50 } },
  { id: 36, name: 'persistent', desc: 'Play 100 rounds of the game', reward: `${coinImg}<span>250</span>`, coins: 250, condition: { type: 'allGameRounds', value: 100 } },
  { id: 37, name: 'addicted', desc: 'Play 200 rounds of the game', reward: `${coinImg}<span>700</span>`, coins: 700, condition: { type: 'allGameRounds', value: 200 } },
  { id: 38, name: 'money minded', desc: 'Earn a total of 1000 coins', reward: `${coinImg}<span>100</span>`, coins: 100, condition: { type: 'totalCoins', value: 1000 } },
  { id: 39, name: 'rich', desc: 'Earn a total of 2000 coins', reward: `${coinImg}<span>250</span>`, coins: 250, condition: { type: 'totalCoins', value: 2000 } },
  { id: 40, name: 'prosperous', desc: 'Earn a total of 5000 coins', reward: `${coinImg}<span>500</span>`, coins: 500, condition: { type: 'totalCoins', value: 5000 } },
  { id: 41, name: 'affluent', desc: 'Earn a total of 10000 coins', reward: `${coinImg}<span>1,000</span>`, coins: 1000, condition: { type: 'totalCoins', value: 10000 } },
  { id: 42, name: 'wealthy', desc: 'Earn a total of 50000 coins', reward: `${coinImg}<span>5,000</span>`, coins: 5000, condition: { type: 'totalCoins', value: 50000 } },
  { id: 43, name: 'conqueror', desc: 'Beat the game', reward: `${coinImg}<span>5,000</span>`, coins: 5000, condition: { type: 'xp', value: 8875 } }
];
}

// render/load achievements and stats
gameStats = loadGameStats();
renderStats();
renderAchievements();

//game stats
function loadGameStats() {
  const stats = localStorage.getItem('gameStats');
  return stats ? JSON.parse(stats) : gameStats;
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}
function renderStats() {
  initRank();
  document.querySelector('.current-rank').textContent = rank;
  document.querySelector('.current-city').textContent = loadCurrentCity();
  document.querySelector('.current-guess').textContent = `1 - ${loadHighestNumber()}`;
  document.querySelector('.total-xp').textContent = loadSavedXP();
  document.querySelector('.total-games-played').textContent = gameStats.totalGamesPlayed;
  document.querySelector('.total-correct-guesses').textContent = gameStats.correctGuesses;
  document.querySelector('.total-incorrect-guesses').textContent = gameStats.totalGamesPlayed - gameStats.correctGuesses;
  document.querySelector('.average-attempts-per-correct').textContent = (gameStats.correctGuesses === 0 ? 0 : (gameStats.correctGuesses / gameStats.totalGamesPlayed).toFixed(2));
  document.querySelector('.best-streak').textContent = gameStats.bestStreak;
  document.querySelector('.current-streak').textContent = gameStats.currentStreak;
 document.querySelector('.losing-streak').textContent = gameStats.losingStreak;
 document.querySelector('.highest-losing-streak').textContent = gameStats.highestLosingStreak;
  document.querySelector('.total-coins-earned').textContent = loadCurrentCoins() + loadSpentCoins();
  document.querySelector('.total-coins-spent').textContent = loadSpentCoins();
  document.querySelector('.current-coins-available').textContent = loadCurrentCoins();
  document.querySelector('.total-mice-earned').textContent = loadCurrentMice() + loadSpentMice();
  document.querySelector('.total-mice-spent').textContent = loadSpentMice();
  document.querySelector('.current-mice-available').textContent = loadCurrentMice();
  document.querySelector('.total-time-played').textContent = formatTime(gameStats.totalTimePlayed);
  document.querySelector('.fastest-correct-guess').textContent = `${gameStats.fastestCorrectGuess ? formatTime(gameStats.fastestCorrectGuess) : 'N/A'}`;
 document.querySelector('.slowest-correct-guess').textContent = `${gameStats.slowestCorrectGuess ? formatTime(gameStats.slowestCorrectGuess) : 'N/A'}`;
 document.querySelector('.achievements-unlocked').textContent = `${ loadClaimedAchievements().length} out of ${achievements.length}`;
 document.querySelector('.game-completion').textContent = `${(loadSavedXP() / 8875 * 100).toFixed(2)}%`;
}

// game audio setup
function checkSoundSetup() {
  const pauseSounds = localStorage.getItem('soundOff');
  return pauseSounds ? false : true;
}
function saveSoundSetup(sound) {
  localStorage.setItem('soundOff', sound);
}

document.addEventListener('DOMContentLoaded', function() {
  let musicToggleButton = document.querySelector('.sound-setup');
  if (playSounds) {
    gameMusic.play();
    musicToggleButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>'
  } else {
    gameMusic.pause();
    musicToggleButton.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
  }
  
  musicToggleButton.addEventListener('click', function() {
    if (!playSounds) {
      playSounds = true;
      gameMusic.play();
      musicToggleButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      localStorage.removeItem("soundOff")
    } else {
      playSounds = false;
      gameMusic.pause();
      musicToggleButton.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      saveSoundSetup(true);
    }
  });
});

//reset game data
function resetGameData() {
  localStorage.clear();
  location.replace("index.html");
}