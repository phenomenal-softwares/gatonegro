// set background images
setBackgroundImage();

//game music
const gameMusic = document.getElementById('game-music');
const btnSound = document.getElementById('btn-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const invalidSound = document.getElementById('invalid-sound');
const successSound = document.getElementById('success-sound');
const arrivalSound = document.getElementById('arrival-sound');
let playSounds = checkSoundSetup();

//modal functions
let modalContainer = document.querySelector('.modal-container');
let settings = document.querySelector('.settings');
let showChooseNumber = document.querySelector('.choose-number');
let commentPopUp = document.querySelector('.comment-popup');
let commentPopUpFirstWord = document.querySelector('.first-word');
let commentPopUpLastWord = document.querySelector('.last-word');
let hintModal = document.querySelector('.hint-modal');
let scoreboardModal = document.querySelector('.scoreboard-modal');
let gameOverModal = document.querySelector('.game-over-modal');
let arrivalModal = document.querySelector('.arrival-modal');

//create variables
const submit = document.querySelector('.guess-submit');
const userInput = document.querySelector('.guess-input');
const guessSlot = document.querySelector('.guesses');
const attemptsLeft = document.querySelector('.guess-left img');
const startOver = document.querySelector('.guess-result');
const comment = document.querySelector('.guess-comment');
let country = document.querySelector('.country');
let coinsAvailable = document.querySelector('.coins');
let miceAvailable = document.querySelector('.mice');
let highestNumber, rank, currentCity, randomNumber, currentProgress, xp, coins, mice, mouseForHint, mouseForUltraInstinct, hintMaxNumber, maxAttempt, incProgressBar, coinsReward, miceReward, xpGain, coinsGain, oneStarNum, TwoStarNum, threeStarNum, isFirstGuess, addCoins, addMice;

//hold the prev values of user guesses.
let previousGuesses = [];
//counting number of guess by the user.
let numGuesses = 1;
let playGame = true;

//progress bar
currentProgress = loadCurrentProgress();
function loadCurrentProgress() {
  x = localStorage.getItem('savedProgress');
  if (x) {
   return Number(x)
  } else {
   return 0
  }
}
function saveCurrentProgress(currentProgress) {
  localStorage.setItem('savedProgress', currentProgress);
}

//check for saved xp
document.querySelector('.xp').innerHTML = loadSavedXP();
function loadSavedXP() {
  xp = localStorage.getItem('savedXP');
  if (xp) {
   return xp = Number(xp)
  } else {
   return xp = 0
  }
}
function saveUserXP(xp) {
  localStorage.setItem('savedXP', xp);
}
function initRank() {
  loadSavedXP();
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

//initialize highest number, random nunber, and all game properties
let haltGameProgress;
setupGameProperties();

//show welcome modal at intervals
initArrivalModal();
//clear progress bar width at 100%
clearProgressBar();

//game level
function loadUserLevel() {
  const level = localStorage.getItem('userLevel');
  return level ? parseInt(level) : 0;
}
function saveUserLevel(level) {
  localStorage.setItem('userLevel', level);
}
function loadClaimedLevels() {
  const claimedLevels = localStorage.getItem('claimedLevels');
  return claimedLevels ? JSON.parse(claimedLevels) : [];
}
function saveClaimedLevels(claimedLevels) {
  localStorage.setItem('claimedLevels', JSON.stringify(claimedLevels));
}
function loadLevelSelected() {
  const levelSelected = localStorage.getItem('levelSelected');
  return parseInt(levelSelected);
}

//set number
function setNumber(x) {
  localStorage.setItem("highestNumber", x);
  location.reload();
}

//initialize game hint
let isHintUsed = false;
let isUltraInstinctUsed = false;
let starsGiven;
initializeHint();

//time and duration
let currentTime, timeTaken;

//main driver code
if (playGame){
    submit.addEventListener('click', function(e){
        e.preventDefault();
        //Getting the number from user
        const guess = parseInt(userInput.innerHTML);
        validateGuess(guess);
    });
}
//if the user enters wrong input, giving alert messages.
function validateGuess(guess){
  //check if the number is Null
    if (guess > highestNumber || guess < 1 || isNaN(guess)){
      if (playSounds) {
     invalidSound.play();
   }
      comment.innerHTML = 'Invalid input! <br>' + 'Guess between 1 and ' + highestNumber;
    } else if (previousGuesses.includes(guess)) {
      if (playSounds) {
     invalidSound.play();
   }
      comment.innerHTML = "Number already entered"
    } else {
     //Keep record of number of attempted guesses
     //push it to empty array created above
     previousGuesses.push(guess);
     

   //Check if game is over
   if (numGuesses === maxAttempt && guess != randomNumber){
      displayGuesses(guess);
  comment.innerHTML = "Game Over... Number was " + randomNumber;
  gameOver();
   } else {
   //Display previous guessed numbers
   displayGuesses(guess);
  //Check guess and display if wrong
   checkGuess(guess);
   if (playSounds) {
     btnSound.play();
   } 
     }
  }
}

function checkGuess(guess){
 let x, y, z;
 if (highestNumber <= 10) {
   x = 2;
   y = 4;
   z = 5;
 } else if (highestNumber <= 20) {
   x = 3;
   y = 7;
   z = 10;
 } else {
    x = 2 / 100 * highestNumber;
    y = 10 / 100 * highestNumber;
    z = 20 / 100 * highestNumber;
 }
 
  currentTime = new Date();
  timeTaken = (currentTime - gameStats.startTime) / 1000; // in seconds
  renderStats();
  
  //Display clue if guess is high or low
    if (guess === randomNumber){
    comment.innerHTML = "Great! You nailed it! <br> Number was " + randomNumber;
    endGame();
    } else if (randomNumber - guess >= z) {
      comment.innerHTML = guess + " is way too LOW... <br> Try a much bigger number!";
      commentPopUpFirstWord.innerHTML = "way";
      commentPopUpLastWord.innerHTML = "too Low!";
      commentModal();
    } else if (randomNumber - guess >= y) {
      comment.innerHTML = guess + " is very LOW... <br> Raise the number up!";
      commentPopUpFirstWord.innerHTML = "Very";
      commentPopUpLastWord.innerHTML = "Low!"; 
      commentModal();
    } else if (randomNumber - guess >= x) {
      comment.innerHTML = guess + " is low but almost there... <br> Increase the number!";
      commentPopUpFirstWord.innerHTML = "low...";
      commentPopUpLastWord.innerHTML = "but almost!"; 
      commentModal();
    } else if (randomNumber - guess >= 1) {
      comment.innerHTML = guess + " is low but so so close... <br> Just raise it up a bit!";
      commentPopUpFirstWord.innerHTML = "So so";
      commentPopUpLastWord.innerHTML = "close!";
      commentModal();
    } else if (guess - randomNumber >= z) {
      comment.innerHTML = guess + " is way too HIGH... <br> Try a much smaller number!";
     commentPopUpFirstWord.innerHTML = "way";
     commentPopUpLastWord.innerHTML = "too high!";
      commentModal();
    } else if (guess - randomNumber >= y) {
      comment.innerHTML = guess + " is very HIGH... <br> Slash down the number!";
     commentPopUpFirstWord.innerHTML = "very";
     commentPopUpLastWord.innerHTML = "high!";
      commentModal();
    } else if (guess - randomNumber >= x) {
      comment.innerHTML = guess + " is high but close... <br> Trim it down!";
      commentPopUpFirstWord.innerHTML = "high..";
      commentPopUpLastWord.innerHTML = "but close!";
      commentModal();
    } else if (guess - randomNumber >= 1) {
      comment.innerHTML = guess + " is high but so so close... <br> Just decrease it a bit!";
      commentPopUpFirstWord.innerHTML = "So so";
      commentPopUpLastWord.innerHTML = "close!";
      commentModal();
    }
}
//details of the guessed number by user
function displayGuesses(guess){
    userInput.innerHTML = '';
 if (guess < randomNumber) {
   guessSlot.innerHTML += "<span class='lowGuess'>" + guess + ", </span>";
 } else {
   guessSlot.innerHTML += "<span class='highGuess'>" + guess + ", </span>";
 }
    numGuesses++;
 let guessLeft = maxAttempt + 1 - numGuesses;
    if (guessLeft == 9) {
      attemptsLeft.src = "countdown/ctd9.png"
    } else if (guessLeft == 8) {
      attemptsLeft.src = "countdown/ctd8.png"
    } else if (guessLeft == 7) {
      attemptsLeft.src = "countdown/ctd7.png"
    } else if (guessLeft == 6) {
      attemptsLeft.src = "countdown/ctd6.png"
    } else if (guessLeft == 5) {
      attemptsLeft.src = "countdown/ctd5.png"
    } else if (guessLeft == 4) {
      attemptsLeft.src = "countdown/ctd4.png"
    } else if (guessLeft == 3) {
      attemptsLeft.src = "countdown/ctd3.png"
    } else if (guessLeft == 2) {
      attemptsLeft.src = "countdown/ctd2.png"
    } else if (guessLeft == 1) {
      attemptsLeft.src = "countdown/ctd1.png"
    } 
    else {
      attemptsLeft.src = "countdown/ctd10.png"
    }
}

//end game
function endGame(){
  if (playSounds) {
     winSound.play();
   } 
  playGame = false;
  let attempts = numGuesses - 1;
  document.querySelector('.right-guess').innerHTML = randomNumber;
  document.querySelector('.att').innerHTML = attempts;
  document.querySelector('.xp-gain').innerHTML = xpGain;
  starRating();
  progressBar();
  progressXP();
  gameCoins();
  initDuration();
  validateStats();
  if (!isHintUsed && !isUltraInstinctUsed) {
    localStorage.setItem("gameHints", false)
  }
  scoreboardModal.style.display = "flex";
  localStorage.setItem("gameAttempts", attempts)
}
function gameOver() {
  if (playSounds) {
     loseSound.play();
   } 
  loseSound.play();
  currentTime = new Date();
  timeTaken = (currentTime - gameStats.startTime) / 1000; // in seconds
  renderStats(); 
  gameStats.currentStreak = 0;
  gameStats.losingStreak++;
  gameStats.incorrectGuesses++;
  gameStats.totalGamesPlayed++;
  gameStats.totalTimePlayed += timeTaken;
  if (gameStats.losingStreak > gameStats.highestLosingStreak) {
      gameStats.highestLosingStreak = gameStats.losingStreak;
    }
  saveGameStats();
  document.querySelector('.display-right-guess').innerHTML = randomNumber;
  gameOverModal.style.display = "flex";
}

//on-screen keys
function initGame(key) {
  userInput.innerHTML += key;
}
//backspace key
function backspace() {
  let text = userInput.innerHTML; 
  let result = text.slice(0, -1);
  userInput.innerHTML = result;
}

//comment modal
function commentModal() {
  commentPopUp.style.display = "block";
  setTimeout(function() {
    commentPopUp.style.display = "none";
  }, 2000);
}

//game rewards after game ends
function starRating() {
  let x = document.getElementsByClassName('fa-star');
  let attempts = numGuesses - 1;
  for (i = 0; i < x.length; i++) {
    x[i].style.color = "#aaa9a9";
    if (attempts >= oneStarNum) {
    x[1].style.color = "gold";
    starsGiven = 1;
    }
    else if (attempts >= TwoStarNum) {
    x[0].style.color = "gold";
    x[1].style.color = "gold";
    starsGiven = 2;
    }
    else {
      x[i].style.color = "gold";
      starsGiven = 3;
      localStorage.setItem("isThreeStars", true)
    }
  }
}
function progressBar() {
  let progress;
    if (haltGameProgress) {
      progress = 100
    } else {
      progress = loadCurrentProgress() + incProgressBar;
      saveCurrentProgress(progress);
    }
    document.querySelector('.score-progress').style.width = progress + "%";
}
function progressXP() {
  let newXP
  newXP = Number(xp + xpGain);
  saveUserXP(newXP)
}
function gameCoins() {
  let w = Number(miceAvailable.innerHTML),
  x = Number(coinsAvailable.innerHTML),
  y;
    if (starsGiven == 3) {
      y = coinsGain + 70;
      coins = x + y;
      document.querySelector('.stars-given').innerHTML = y;
    } else if (starsGiven == 2) {
      y = coinsGain + 30;
      coins = x + y;
      document.querySelector('.stars-given').innerHTML = y;
    } else {
      y = coinsGain;
      coins = x + y;
      document.querySelector('.stars-given').innerHTML = y;
    }
    saveUserCoins(coins);
    saveUserMice(w);
}

//hints and ultra instinct
function initializeHint() {
  document.querySelector('.hint-box').style.backgroundImage = "url(bg/hint.png)";
  document.querySelector('.instinct-box').style.backgroundImage = "url(img/ultra-instinct.png)";
let x = Number(randomNumber);
let h = hintMaxNumber;
let y1 = Math.floor(Math.random() * h) + 1;
let y2 = Math.floor(Math.random() * h) + 1;
let z = Number(highestNumber);
let rmin, rplus;
let hintOne = document.querySelector('.hint-one');
let hintTwo = document.querySelector('.hint-two');

if (x > 5) {
  rmin = x - y1;
} else {
  rmin = 1;
}
if (x + y2 > z) {
  rplus = z;
} else {
  rplus = x + y2;
}

// program to check if the number is even or odd
//check if the number is even
if(x % 2 == 0) {
    hintOne.innerHTML = "Number is even";
}
// if the number is odd
else {
    hintOne.innerHTML = "Number is odd";
}
hintTwo.innerHTML = "Number is between " + rmin + " and " + rplus;
}
function showHint() {
  let x = mouseForHint,
  y = Number(miceAvailable.innerHTML);
  if (y >= x && !isHintUsed) {
    if (playSounds) {
     successSound.play();
   }
    isHintUsed = true;
    let miceLeft = y - x;
    gameStats.spentMice += x;
    saveUserMice(miceLeft);
    saveSpentMice(gameStats.spentMice);
    miceAvailable.innerHTML = miceLeft;
    hintModal.style.display = "flex";
    renderStats();
  } else if (isHintUsed) {
    hintModal.style.display = "flex";
  }
  else {
    if (playSounds) {
     invalidSound.play();
   }
    comment.innerHTML = "Not enough mice" + "<br>" + "to use Cat Instinct!"
  }
}
function catUltraInstinct() {
  let v = mouseForUltraInstinct,
  w = document.querySelector('.ultra-instinct-modal'),
  x = Number(randomNumber),
  y = Number(miceAvailable.innerHTML),
  z = document.querySelector('.instinct-text');
  if (y >= v && !isUltraInstinctUsed) {
    if (playSounds) {
     successSound.play();
   }
    isUltraInstinctUsed = true;
    let miceLeft = y - v;
    gameStats.spentMice += v;
    saveUserMice(miceLeft);
    saveSpentMice(gameStats.spentMice);
    miceAvailable.innerHTML = miceLeft;
    z.innerHTML = x;
    w.style.display = "flex";
    renderStats();
  } else if (isUltraInstinctUsed) {
    z.innerHTML = x;
    w.style.display = "flex";
  }
  else {
    if (playSounds) {
     invalidSound.play();
   }
    comment.innerHTML = "Not enough mice" + "<br>" + "to use Cat Ultra Instinct!"
  }
}

//each game duration
let start;
function elapsedTime(startDate, endDate) {
  const diff = Number(endDate - startDate);
  let minutes = Number(Math.floor(diff / 60000));
  let seconds = Number(Math.floor((diff % 60000) / 1000));
 localStorage.setItem("gameTime", seconds);
if(minutes < 10) {
  minutes = '0' + minutes;
}
if (seconds < 10) {
  seconds = '0' + seconds;
}
  return `${minutes}:${seconds}`;
}
function initDuration() {
  const end = new Date();
document.querySelector(".game-duration").innerHTML = elapsedTime(start, end);
}

//clear progress bar once full
function clearProgressBar() {
  if (currentProgress >= 100 && !haltGameProgress) {
      localStorage.removeItem("savedProgress");
    document.querySelector('.progress').style.width = "0%";
  }
}
//set highest number with all properties
function initHighestNumber() {
  currentProgress = loadCurrentProgress();
  let city = document.querySelector(".city-name"), 
  miceCost = document.querySelector(".mice-cost"),
  miceUltraCost = document.querySelector(".mice-ultra-cost");
  let progress;
  if (currentProgress) {
    progress = currentProgress;
  } else {
    progress = incProgressBar;
  }
  document.querySelector('.progress').style.width = progress + "%";
  if (xp >= 8875) {
    //game finished
    document.querySelector('.progress').style.width = 100 + "%";
    highestNumber = 5000;
    maxAttempt = 12;
    hintMaxNumber = 20;
    mouseForHint = 100;
    xpGain = 0;
    coinsGain = 500;
    incProgressBar = 100;
    oneStarNum = 9;
    TwoStarNum = 6;
    currentCity = "Game Completed";
    city.style.fontSize = "12px";
    city.style.backgroundColor = "gold";
    city.innerHTML = "COMPLETED!";
    country.src = "country/brazil.png";
    attemptsLeft.src = "countdown/ctd12.png"
  }  else if (xp >= 3875) {
    highestNumber = 5000;
    maxAttempt = 12;
    hintMaxNumber = 20;
    mouseForHint = 100;
    xpGain = 100;
    coinsGain = 500;
    incProgressBar = 2;
    oneStarNum = 9;
    TwoStarNum = 6;
    currentCity = "Rio, Brazil";
    city.innerHTML = "Rio";
    country.src = "country/brazil.png";
    attemptsLeft.src = "countdown/ctd12.png"
  } else if (xp >= 2275) {
    highestNumber = 2000;
    maxAttempt = 11;
    hintMaxNumber = 10;
    mouseForHint = 50;
    xpGain = 40;
    coinsGain = 400;
    incProgressBar = 2.5;
    oneStarNum = 8;
    TwoStarNum = 5;
    currentCity = "Sydney, Australia";
    city.innerHTML = "Sydney";
    country.src = "country/australia.png";
    attemptsLeft.src = "countdown/ctd11.png"
  } else if (xp >= 1375) {
    highestNumber = 1000;
    maxAttempt = 10;
    hintMaxNumber = 7;
    mouseForHint = 30;
    xpGain = 30;
    coinsGain = 300;
    incProgressBar = 3.3334;
    oneStarNum = 7;
    TwoStarNum = 5;
    currentCity = "New York City, USA";
    city.innerHTML = "New York";
    country.src = "country/usa.png";
    attemptsLeft.src = "countdown/ctd10.png"
  } else if (xp >= 875) {
    highestNumber = 500;
    maxAttempt = 10;
    hintMaxNumber = 6;
    mouseForHint = 20;
    xpGain = 20;
    coinsGain = 100;
    incProgressBar = 4;
    oneStarNum = 7;
    TwoStarNum = 5;
    currentCity = "Lagos, Nigeria";
    city.innerHTML = "Lagos";
    country.src = "country/nigeria.png";
    attemptsLeft.src = "countdown/ctd10.png"
  } else if (xp >= 475) {
    highestNumber = 200;
    maxAttempt = 10;
    hintMaxNumber = 6;
    mouseForHint = 15;
    xpGain = 20;
    coinsGain = 50;
    incProgressBar = 5;
    oneStarNum = 7;
    TwoStarNum = 5;
    currentCity = "Cairo, Egypt";
    city.innerHTML = "Cairo";
    country.src = "country/egypt.png";
    attemptsLeft.src = "countdown/ctd10.png"
  } else if (xp >= 250) {
    highestNumber = 100;
    maxAttempt = 8;
    hintMaxNumber = 6;
    mouseForHint = 15;
    xpGain = 15;
    coinsGain = 40;
    incProgressBar = 6.6667;
    oneStarNum = 7;
    TwoStarNum = 5;
    currentCity = "Tokyo, Japan";
    city.innerHTML = "Tokyo";
    country.src = "country/japan.png";
    attemptsLeft.src = "countdown/ctd8.png"
  } else if (xp >= 100) {
    highestNumber = 50;
    maxAttempt = 7;
    hintMaxNumber = 5;
    mouseForHint = 10;
    xpGain = 15;
    coinsGain = 30;
    incProgressBar = 10;
    oneStarNum = 6;
    TwoStarNum = 4;
    currentCity = "Dubai, UAE";
    city.innerHTML = "Dubai";
    country.src = "country/uae.png";
    attemptsLeft.src = "countdown/ctd7.png"
  } else if (xp >= 50) {
    highestNumber = 20;
    maxAttempt = 5;
    hintMaxNumber = 4;
    mouseForHint = 5;
    xpGain = 10;
    coinsGain = 25;
    incProgressBar = 20;
    oneStarNum = 4;
    TwoStarNum = 3;
    currentCity = "Paris, France";
    city.innerHTML = "Paris";
    country.src = "country/france.png";
    attemptsLeft.src = "countdown/ctd5.png"
  } else {
    highestNumber = 10;
    maxAttempt = 5;
    hintMaxNumber = 3;
    mouseForHint = 5;
    xpGain = 10;
    coinsGain = 20;
    incProgressBar = 20;
    oneStarNum = 4;
    TwoStarNum = 3;
    currentCity = "Madrid, Spain";
    city.innerHTML = "Madrid";
    country.src = "country/spain.png";
    attemptsLeft.src = "countdown/ctd5.png"
  }
  randomNumber = parseInt((Math.random()*highestNumber)+1);
  mouseForUltraInstinct = mouseForHint * 10;
  miceCost.innerHTML = mouseForHint;
  miceUltraCost.innerHTML = mouseForUltraInstinct;
}
//pause game progress when level is selected manually
function initChosenLevel() {
  let levelSelected = loadLevelSelected();
  let city = document.querySelector(".city-name"), 
  miceCost = document.querySelector(".mice-cost"),
  miceUltraCost = document.querySelector(".mice-ultra-cost");
  document.querySelector('.progress').style.width = 100 + "%";
  xpGain = 0;
  
  if (levelSelected == 9) {
    highestNumber = 5000;
    maxAttempt = 12;
    hintMaxNumber = 20;
    mouseForHint = 100;
    coinsGain = 400;
    oneStarNum = 9;
    TwoStarNum = 6;
    currentCity = "Rio, Brazil";
    city.innerHTML = "Rio";
    country.src = "country/brazil.png";
    attemptsLeft.src = "countdown/ctd12.png"
  } else if (levelSelected == 8) {
    highestNumber = 2000;
    maxAttempt = 11;
    hintMaxNumber = 10;
    mouseForHint = 50;
    coinsGain = 200;
    oneStarNum = 8;
    TwoStarNum = 5;
    currentCity = "Sydney, Australia";
    city.innerHTML = "Sydney";
    country.src = "country/australia.png";
    attemptsLeft.src = "countdown/ctd11.png"
  } else if (levelSelected == 7) {
    highestNumber = 1000;
    maxAttempt = 10;
    hintMaxNumber = 7;
    mouseForHint = 30;
    coinsGain = 100
    oneStarNum = 7;
    TwoStarNum = 5;
    currentCity = "New York City, USA";
    city.innerHTML = "New York";
    country.src = "country/usa.png";
    attemptsLeft.src = "countdown/ctd10.png"
  } else if (levelSelected == 6) {
    highestNumber = 500;
    maxAttempt = 10;
    hintMaxNumber = 6;
    mouseForHint = 20;
    coinsGain = 60;
    oneStarNum = 7;
    TwoStarNum = 5;
    currentCity = "Lagos, Nigeria";
    city.innerHTML = "Lagos";
    country.src = "country/nigeria.png";
    attemptsLeft.src = "countdown/ctd10.png"
  } else if (levelSelected == 5) {
    highestNumber = 200;
    maxAttempt = 10;
    hintMaxNumber = 6;
    mouseForHint = 15;
    coinsGain = 40;
    oneStarNum = 7;
    TwoStarNum = 5;
    currentCity = "Cairo, Egypt";
    city.innerHTML = "Cairo";
    country.src = "country/egypt.png";
    attemptsLeft.src = "countdown/ctd10.png"
  } else if (levelSelected == 4) {
    highestNumber = 100;
    maxAttempt = 8;
    hintMaxNumber = 6;
    mouseForHint = 15;
    coinsGain = 30;
    oneStarNum = 7;
    TwoStarNum = 5;
    currentCity = "Tokyo, Japan";
    city.innerHTML = "Tokyo";
    country.src = "country/japan.png";
    attemptsLeft.src = "countdown/ctd8.png"
  } else if (levelSelected == 3) {
    highestNumber = 50;
    maxAttempt = 7;
    hintMaxNumber = 5;
    mouseForHint = 10;
    coinsGain = 20;
    oneStarNum = 6;
    TwoStarNum = 4;
    currentCity = "Dubai, UAE";
    city.innerHTML = "Dubai";
    country.src = "country/uae.png";
    attemptsLeft.src = "countdown/ctd7.png"
  } else if (levelSelected == 2) {
    highestNumber = 20;
    maxAttempt = 5;
    hintMaxNumber = 4;
    mouseForHint = 5;
    coinsGain = 15;
    oneStarNum = 4;
    TwoStarNum = 3;
    currentCity = "Paris, France";
    city.innerHTML = "Paris";
    country.src = "country/france.png";
    attemptsLeft.src = "countdown/ctd5.png"
  } else if (levelSelected == 1) {
    highestNumber = 10;
    maxAttempt = 5;
    hintMaxNumber = 3;
    mouseForHint = 5;
    coinsGain = 10;
    oneStarNum = 4;
    TwoStarNum = 3;
    currentCity = "Madrid, Spain";
    city.innerHTML = "Madrid";
    country.src = "country/spain.png";
    attemptsLeft.src = "countdown/ctd5.png"
  }
  randomNumber = parseInt((Math.random()*highestNumber)+1);
  mouseForUltraInstinct = mouseForHint * 10;
  miceCost.innerHTML = mouseForHint;
  miceUltraCost.innerHTML = mouseForUltraInstinct;
}
//decide between auto-level or chosen level
function setupGameProperties() {
if (loadLevelSelected()) {
  haltGameProgress = true;
  initChosenLevel();
} else {
  haltGameProgress = false;
  initHighestNumber();
}
}

//arrival modal at checkpoints
function initArrivalModal() {
  let arrivalImg = document.querySelector('.arrival-img'),
  arrivalCity = document.querySelector('.arrival-city'),
  arrivalGuess = document.querySelector('.arrival-guess'),
  arrivalCoins = document.querySelector('.arrival-coins'),
  arrivalMice = document.querySelector('.arrival-mice');
  
  if (xp == 0) {
    gameStats.level = 1;
    arrivalImg.src = "arrival/madrid.png";
    arrivalCity.innerHTML = "Madrid, Spain";
    arrivalGuess.innerHTML = "1 - 10";
    coinsReward = 100;
    miceReward = 20;
    levelUp();
  } else if (xp == 50) {
    gameStats.level = 2;
    arrivalImg.src = "arrival/paris.png";
    arrivalCity.innerHTML = "Paris, France";
    arrivalGuess.innerHTML = "1 - 20";
    coinsReward = 100;
    miceReward = 20;
    levelUp();
  } else if (xp == 100) {
    gameStats.level = 3;
    arrivalImg.src = "arrival/dubai.png";
    arrivalCity.innerHTML = "Dubai, UAE";
    arrivalGuess.innerHTML = "1 - 50";
    coinsReward = 150;
    miceReward = 35;
    levelUp();
  } else if (xp == 250) {
    gameStats.level = 4;
    arrivalImg.src = "arrival/tokyo.png";
    arrivalCity.innerHTML = "Tokyo, Japan";
    arrivalGuess.innerHTML = "1 - 100";
    coinsReward = 150;
    miceReward = 40;
    levelUp();
  } else if (xp == 475) {
    gameStats.level = 5;
    arrivalImg.src = "arrival/cairo.png";
    arrivalCity.innerHTML = "Cairo, Egypt";
    arrivalGuess.innerHTML = "1 - 200";
    coinsReward = 200;
    miceReward = 50;
    levelUp();
  } else if (xp == 875) {
    gameStats.level = 6;
    arrivalImg.src = "arrival/lagos.png";
    arrivalCity.innerHTML = "Lagos, Nigeria";
    arrivalGuess.innerHTML = "1 - 500";
    coinsReward = 500;
    miceReward = 100;
    levelUp();
  } else if (xp == 1375) {
    gameStats.level = 7;
    arrivalImg.src = "arrival/nyc.png";
    arrivalCity.innerHTML = "New York City, USA";
    arrivalGuess.innerHTML = "1 - 1000";
    coinsReward = 1000;
    miceReward = 200;
    levelUp();
  } else if (xp == 2275) {
    gameStats.level = 8;
    arrivalImg.src = "arrival/sydney.png";
    arrivalCity.innerHTML = "Sydney, Australia";
    arrivalGuess.innerHTML = "1 - 2000";
    coinsReward = 2000;
    miceReward = 500;
    levelUp();
  } else if (xp == 3875) {
    gameStats.level = 9;
    arrivalImg.src = "arrival/rio.png";
    arrivalCity.innerHTML = "Rio City, Brazil";
    arrivalGuess.innerHTML = "1 - 5000";
    coinsReward = 5000;
    miceReward = 1000;
    levelUp();
  } else if (xp == 8875) {
    let finalModal = localStorage.getItem("finalModal");
    if (finalModal) {
      finalModal = true;
    } else {
      finalModal = false;
    }
    gameStats.level = 10;
    arrivalImg.src = "img/game-complete.png";
    arrivalCity.innerHTML = "All cities visited!";
    arrivalGuess.innerHTML = "1 - 5000";
    coinsReward = 10000;
    miceReward = 5000;
    if (finalModal == false) {
      localStorage.setItem("finalModal", true);
      levelUp();
    }
  }
    arrivalCoins.innerHTML = coinsReward;
    arrivalMice.innerHTML = miceReward;
}
function levelUp() {
  // Check if the level reward has already been claimed
  if (!gameStats.claimedLevels.includes(gameStats.level)) {
    if (playSounds) {
     arrivalSound.play();
   }
    saveUserLevel(gameStats.level);
    gameStats.currentCoins += coinsReward;
    gameStats.currentMice += miceReward;
    gameStats.claimedLevels.push(gameStats.level);
    saveUserCoins(gameStats.currentCoins);
    saveUserMice(gameStats.currentMice);
    saveClaimedLevels(gameStats.claimedLevels);
    //display arrival modal
    arrivalModal.style.display = "flex";
  }
  renderLevelStats();
}
function renderLevelStats() {
  coinsAvailable.textContent = gameStats.currentCoins;
  miceAvailable.textContent = gameStats.currentMice;
}
renderLevelStats();

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
const achievementBtn = document.querySelector('.achievement-btn');
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
      achievementBtn.style.color = "gold";
      menuBtn.classList.add("goldBlink")
    }
  });
  if (!unclaimedAchievements) {
    achievementBtn.style.color = "#FEFFE9";
    menuBtn.classList.remove("goldBlink")
  }
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
startGame();

//game stats
function startGame() {
  userInput.innerHTML = '';
  guessSlot.innerHTML = '';
  comment.innerHTML = "Let's go again!"
  gameStats.attempts = 0;
  gameStats.previousGuess = null;
  start = new Date();
  gameStats.startTime = new Date();
  saveGameStats();
  renderStats();
}
function saveGameStats() {
  localStorage.setItem('gameStats', JSON.stringify(gameStats));
}
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
  document.querySelector('.current-city').textContent = currentCity;
  document.querySelector('.current-guess').textContent = `1 - ${highestNumber}`;
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
function validateStats(){
  gameStats.correctGuesses++;
  gameStats.currentStreak++;
  gameStats.losingStreak = 0;
  gameStats.incorrectGuesses = 0;
  gameStats.totalGamesPlayed++;

    if (gameStats.currentStreak > gameStats.bestStreak) {
      gameStats.bestStreak = gameStats.currentStreak;
    }

    if (gameStats.fastestCorrectGuess === null || timeTaken < gameStats.fastestCorrectGuess) {
      gameStats.fastestCorrectGuess = timeTaken;
    }
    
    if (gameStats.slowestCorrectGuess === null || timeTaken > gameStats.slowestCorrectGuess) {
      gameStats.slowestCorrectGuess = timeTaken;
    }

  gameStats.totalTimePlayed += timeTaken;
  saveGameStats();
  renderStats();
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
  const musicToggleButton = document.querySelector('.sound-btn');
  if (playSounds) {
    gameMusic.play();
    document.querySelector('.sound-check').checked = true;
  } else {
    gameMusic.pause();
    document.querySelector('.sound-check').checked = false;
  }
  musicToggleButton.addEventListener('click', function() {
    if (!playSounds) {
      playSounds = true;
      gameMusic.play();
      document.querySelector('.sound-check').checked = true;
      localStorage.removeItem("soundOff")
    } else {
      playSounds = false;
      gameMusic.pause();
      document.querySelector('.sound-check').checked = false;
      saveSoundSetup(true);
    }
  });
});

// set all background images
function setBackgroundImage() {
  document.body.style.backgroundImage = "url(bg.gif)";
  document.querySelector('.modal-box').style.backgroundImage = "url(bg/menu.png)";
  document.querySelector('.comment-popup').style.backgroundImage = "url(comment.png)";
  document.querySelector('.game-over').style.backgroundImage = "url(bg/guess-wrong.png)";
}

//restart game button after win/lose
function refreshGame() {
  previousGuesses = [];
  numGuesses = 1;
  playGame = true;
  document.querySelector('.xp').innerHTML = loadSavedXP();
  coinsAvailable.innerHTML = loadCurrentCoins();
  miceAvailable.innerHTML = loadCurrentMice();
  setupGameProperties();
initArrivalModal();
clearProgressBar();
isHintUsed = false;
isUltraInstinctUsed = false;
initializeHint();
getAllAchievments();
checkForAchievements();
gameStats = loadGameStats();
renderStats();
renderShopStats();
renderAchievements();
startGame();
scoreboardModal.style.display = "none";
gameOverModal.style.display = "none";
}