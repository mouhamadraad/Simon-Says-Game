window.addEventListener("load", function () {
  const play = document.getElementById("play");
  const info = document.getElementById("info");
  const levelDisplay = document.getElementById("level");
  const highScoreDisplay = document.getElementById("high-score");
  const btnPlay = document.getElementById("play");
  const board = document.querySelector(".board");
  const tiles = document.querySelectorAll(".tile");

  const colors = ["green", "red", "blue", "yellow"];
  const text = "Make it to 12 to win!";
  let sequence = [];
  let currentLevel = 0;
  let highScore = localStorage.getItem("simonSaysHighScore") || 0;
  const maxLevel = 12;
  const audioFiles = {
    blue: "sounds/blue.mp3",
    red: "sounds/red.mp3",
    yellow: "sounds/yellow.mp3",
    green: "sounds/green.mp3",
    gameOver: "sounds/game-over.wav",
    gameWin: "sounds/game-win.wav",
    wrong: "sounds/wrong.mp3",
  };

  function lightUpTile(color, delay) {
    setTimeout(() => {
      tiles.forEach((tile) => {
        if (tile.classList.contains(color)) {
          tile.style.opacity = "1";

          const audio = new Audio(audioFiles[color]);
          audio.play();

          setTimeout(() => {
            tile.style.opacity = "0.35";
            tile.addEventListener("mouseenter", function () {
              tile.style.opacity = "1";
            });
            tile.addEventListener("mouseleave", function () {
              tile.style.opacity = "35%";
            });
          }, 700);
        }
      });
    }, delay);
  }

  function playSequence() {
    sequence.forEach((color, index) => {
      lightUpTile(color, index * 1000);
    });
  }

  function startNewLevel() {
    currentLevel++;
    sequence = [];

    for (let i = 0; i < currentLevel; i++) {
      sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }

    levelDisplay.textContent = currentLevel;
    playSequence();
  }

  function updateHighScore() {
    if (currentLevel > highScore) {
      highScore = currentLevel;
      localStorage.setItem("simonSaysHighScore", highScore);
    }

    highScoreDisplay.textContent = highScore;
  }

  function restartGame(message) {
    currentLevel = 0;
    sequence = [];
    levelDisplay.textContent = "";
    info.textContent = message;
    setTimeout(() => {
      info.textContent = "Click play to start! Make it to 12 to win!";
      btnPlay.style.visibility = "visible";
    }, 2000);

    board.style.pointerEvents = "none";
  }

  play.addEventListener("click", function () {
    info.style.marginLeft = "7%";
    btnPlay.style.visibility = "hidden";

    board.style.pointerEvents = "all";
    board.style.cursor = "pointer";

    startNewLevel();
  });

  tiles.forEach((tile) => {
    tile.addEventListener("click", function () {
      if (tile.classList.contains(sequence[0])) {
        sequence.shift();

        if (sequence.length === 0) {
          if (currentLevel < maxLevel) {
            updateHighScore();
            setTimeout(() => {
              startNewLevel();
            }, 1000);
          } else {
            const audio = new Audio(audioFiles.gameWin);
            audio.play();
            restartGame("You win!");
            updateHighScore();
          }
        }
      } else {
        const audio = new Audio(audioFiles.wrong);
        audio.play();

        setTimeout(() => {
          const audio = new Audio(audioFiles.gameOver);
          audio.play();
          restartGame("Game Over");
        }, 1000);
      }
    });
  });
});
