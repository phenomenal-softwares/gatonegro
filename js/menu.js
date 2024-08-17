// game audio setup
const gameMusic = document.getElementById('game-music');
let playSounds = checkSoundSetup();
function checkSoundSetup() {
  const pauseSounds = localStorage.getItem('soundOff');
  return pauseSounds ? false : true;
}

document.addEventListener('DOMContentLoaded', () => {
  //game music
  if (playSounds) {
    gameMusic.play();
  } else {
    gameMusic.pause();
  }
  
  //carousel and swiping functions
  const carousel = document.querySelector('.carousel');
  const items = document.querySelectorAll('.carousel-item');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  const city = document.querySelector('.city');
  const xp = document.querySelector('.xp');
  const coins = document.querySelector('.coins');
  const mice = document.querySelector('.mice');
  
let userLevel = getUserLevel(),
userProgress = getUserProgress();

city.innerHTML = getUserCity();
xp.innerHTML = getUserXP();
coins.innerHTML = getUserCoins();
mice.innerHTML = getUserMice();
  
 let scrollAmount = 0;
 const itemWidth = items[0].offsetWidth + 40; // Including margin
 let activeIndex = determineActiveIndex(userLevel); // Determine starting item based on XP
  
const backgrounds = [
    'url(map/bg-spain.jpg)', // Background for Item 1
    'url(map/bg-france.jpg)', // Background for Item 2
    'url(map/bg-uae.jpg)', // Background for Item 3
    'url(map/bg-japan.jpg)', // Background for Item 4
    'url(map/bg-egypt.jpg)',  // Background for Item 5
    'url(map/bg-nigeria.jpg)', // Background for Item 6
    'url(map/bg-usa.jpg)', // Background for Item 3
    'url(map/bg-australia.jpg)', // Background for Item 4
    'url(map/bg-brazil.jpg)'  // Background for Item 5
  ];

  // Initial background setup and scroll to correct position
  scrollCarouselToIndex(activeIndex);
  updateButtons(userLevel);

  // Event listeners for buttons
  prevButton.addEventListener('click', () => scrollCarousel('prev'));
  nextButton.addEventListener('click', () => scrollCarousel('next'));

  // Function to scroll the carousel and change the background
  function scrollCarousel(direction) {
    if (direction === 'next' && scrollAmount < (items.length - 1) * itemWidth) {
      scrollAmount += itemWidth;
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
    } else if (direction === 'prev' && scrollAmount > 0) {
      scrollAmount -= itemWidth;
      activeIndex = Math.max(activeIndex - 1, 0);
    }
    carousel.style.transform = `translateX(-${scrollAmount}px)`;
    changeBackground(activeIndex);
    updateButtons(userLevel);
  }

  // Function to scroll to the specified item index
  function scrollCarouselToIndex(index) {
    scrollAmount = index * itemWidth;
    carousel.style.transform = `translateX(-${scrollAmount}px)`;
    changeBackground(index);
    updateButtons(userLevel);
  }

  // Function to change the background image
  function changeBackground(index) {
    document.body.style.backgroundImage = backgrounds[index];
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
  }

  // Determine the active index based on user XP
  function determineActiveIndex(level) {
    if (level >= 9) {
      return 8; // Item 9 for highest level
    } else if (level >= 8) {
      return 7; // Item 8
    } else if (level >= 7) {
      return 6; // Item 7
    } else if (level >= 6) {
      return 5; // Item 6
    } else if (level >= 5) {
      return 4; // Item 5
    } else if (level >= 4) {
      return 3; // Item 4
    } else if (level >= 3) {
      return 2; // Item 3
    } else if (level >= 2) {
      return 1; // Item 2
    } else {
      return 0; // Item 1 for lowest level
    }
  }

  // get user level
  function getUserLevel() {
    return parseInt(localStorage.getItem('userLevel')) || 1;
  }
  // get user level
  function getUserProgress() {
    return parseInt(localStorage.getItem('savedProgress')) || 0;
  }
  // get user XP
  function getUserXP() {
    return parseInt(localStorage.getItem('savedXP')) || 0;
  }
  // get user coins
  function getUserCoins() {
    return parseInt(localStorage.getItem('currentCoins')) || 0;
  }
  // get user mice
  function getUserMice() {
    return parseInt(localStorage.getItem('currentMice')) || 0;
  }
  // current city
  function getUserCity() {
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

  // Function to update button text based on user's XP
  function updateButtons(level) {
    items.forEach((item, index) => {
      const button = item.querySelector('.level-button');
      const progressBar = item.querySelector('.progress');
      const requiredLevel = parseInt(item.getAttribute('data-level'));
      
      if (level > requiredLevel) {
        progress = 100;
        button.textContent =  "Replay Level";
        item.style.backgroundColor =  "rgba(255,215,0,0.3)";
        progressBar.style.width = 100 + "%";
        button.disabled = false;
        button.addEventListener('click', function() {
          saveLevelSelected(requiredLevel);
          document.location = "game.html"
        }
        );
      } else if (level == requiredLevel) {
        button.textContent =  "Continue Game";
        button.style.backgroundColor =  "green";
        progressBar.style.width = userProgress + "%";
        button.disabled = false;
        button.addEventListener('click', function() {
          localStorage.removeItem("levelSelected");
          document.location = "game.html"
        }
        );
      } else if (level < requiredLevel) {
        button.innerHTML = '<i class="fa-solid fa-lock"></i>';
        progressBar.style.width = 0 + "%";
        button.disabled = true;
      }
    });
  }
  
  //save selected level
  function saveLevelSelected(level) {
  localStorage.setItem('levelSelected', level);
}

  // Swipe functionality
  let startX = 0;
  let isSwiping = false;

  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  carousel.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;

    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;

    if (Math.abs(diffX) > 50) { // Swipe threshold
      if (diffX > 0) {
        scrollCarousel('next');
      } else {
        scrollCarousel('prev');
      }
      isSwiping = false; // Prevent multiple swipes
    }
  });

  carousel.addEventListener('touchend', () => {
    isSwiping = false;
  });
});
