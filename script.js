const GameBoard = (function () {
  board = [];

  const init = function () {
    for (let i = 0; i < 3; i++) {
      const arr = [];
      for (j = 0; j < 3; j++) {
        arr[j] = null;
      }
      board.push(arr);
    }
  };

  init(); //runs init function

  return { board };
})();

const createPlayer = function (name, marker) {
  // creates a player with name and marker and score initialized to zero
  // provides incrementScore to add 1 point to player score.

  this.name = name;
  this.marker = marker;
  this.score = 0;

  function getScore() {
    return this.score;
  }

  this.incrementScore = () => score++;
  return { name, getScore, incrementScore, marker };
};

const screenController = (function () {
  const createGameDOM = function (player1, player2, board) {
    createGameBoardUI(board);
    createPlayerCard(player1);
    createPlayerCard(player2);
  };

  const createPlayerCard = function (player) {
    const container = document.querySelector(".playersContainer");
    const playerInfo = document.createElement("div");
    const playerName = document.createElement("h2");
    const playerMarker = document.createElement("h3");
    const playerScore = document.createElement("p");

    playerInfo.classList.add("player-card");

    playerName.textContent = player.name;
    playerMarker.textContent = `marker: ${player.marker}`;
    playerScore.textContent = `Score: ${player.score}`;

    playerInfo.appendChild(playerName);
    playerInfo.appendChild(playerMarker);
    playerInfo.appendChild(playerScore);

    container.appendChild(playerInfo);
  };

  const createGameBoardUI = function (board) {
    const container = document.querySelector(".gameContainer");
    const boardContainer = document.createElement("div");
    const boardName = document.createElement("h1");

    boardContainer.id = board.name;
    boardName.textContent = board.name;

    boardContainer.appendChild(boardName);

    const rowLength = board.length;
    const colLength = board.length;

    for (let i = 0; i < rowLength; i++) {
      const row = document.createElement("div");
      for (j = 0; j < colLength; j++) {
        const colItem = document.createElement("button");
        colItem.textContent = board[i][j];
        colItem.dataset.row = i;
        colItem.dataset.column = j;

        colItem.addEventListener("click", (event) => {
          playTurn(event);
          // updateScreen(player1, player2, board, currPlayer);
        });

        row.appendChild(colItem);
      }
      boardContainer.appendChild(row);
    }

    container.appendChild(boardContainer);
  };

  const playTurn = function (event) {
    let i = event.target.dataset.row;
    let j = event.target.dataset.column;

    let currPlayer = GameController.getCurrPlayer();

    if (GameController.getIsGameOver() == false) {
      event.target.textContent =
        event.target.textContent == ""
          ? currPlayer.marker
          : event.target.textContent;
      GameController.playRound(i, j);
    } else {
      alert("Game Over!");
      alert(`${currPlayer.name} Won!!`);
    }

    // console.log(GameController.getIsGameOver());
  };

  return { createGameDOM };
})();

const GameController = (function () {
  const board = GameBoard.board;
  // console.table(board);
  const player1 = createPlayer("SuperMan", "X");
  const player2 = createPlayer("Batman", "O");

  let isGameOver = false;
  let isGameTie = false;

  let currPlayer = player1;

  screenController.createGameDOM(player1, player2, board);

  const toggleCurrentPlayer = function () {
    currPlayer = currPlayer == player1 ? player2 : player1;
  };

  const playRound = function (i, j) {
    GameOverCheck(marker);

    if (board[i][j] === null) {
      board[i][j] = currPlayer.marker;
      console.table(board);
      GameOverCheck(currPlayer.marker);
      if (isGameOver == false) {
        toggleCurrentPlayer();
      }
    }
  };

  const GameOverCheck = function (marker) {
    //GameOverCheck method takes in a marker as input and checks if the winning
    // patter exists for the provided marker and returns boolean true if exists else returns false

    let rowCompleted = false;
    let colCompleted = false;
    let diagonalCompleted = false;

    const rowMatcher = function (r1, r2, r3) {
      rowCompleted =
        r1.every((item) => item == marker) ||
        r2.every((item) => item == marker) ||
        r3.every((item) => item == marker);
    };

    const colMatcher = function () {
      let col1 = [];
      let col2 = [];
      let col3 = [];
      board.forEach((row) => col1.push(row[0]));
      board.forEach((row) => col2.push(row[1]));
      board.forEach((row) => col3.push(row[2]));

      colCompleted =
        col1.every((item) => item == marker) ||
        col2.every((item) => item == marker) ||
        col3.every((item) => item == marker);
    };

    const diagonalMatcher = function () {
      let diagon1 = [];
      let diagon2 = [];

      diagon1.push(board[0][0], board[1][1], board[2][2]);

      diagon2.push(board[0][2], board[1][1], board[2][0]);

      diagonalCompleted =
        diagon1.every((item) => item == marker) ||
        diagon2.every((item) => item == marker);
    };

    rowMatcher(...board);
    colMatcher(this.board);
    diagonalMatcher(this.board);

    // console.log("rowCompleted: " + rowCompleted);
    // console.log("colCompleted: " + colCompleted);
    // console.log("diagonalCompleted: " + diagonalCompleted);

    isGameOver = rowCompleted || colCompleted || diagonalCompleted;

    return isGameOver;
  };

  function getIsGameTie() {
    return isGameTie;
  }

  function getCurrPlayer() {
    return currPlayer;
  }
  function getIsGameOver() {
    return isGameOver;
  }

  return {
    toggleCurrentPlayer,
    playRound,
    getCurrPlayer,
    getIsGameOver,
    getIsGameTie,
  };
})();
