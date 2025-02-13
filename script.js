const createGameBoard = function (name) {
  //This is a Gameboard object it has  name, board (2D array)

  this.name = name;
  const board = [];

  // init method fills the board with null value
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

  const play = function (i, j, marker) {
    // play method takes row and column index and a marker and
    // checks if the game is over and returns boolean value of the same.

    if (board[i][j] === null && isGameOver(marker) == false) {
      board[i][j] = marker;
      // console.table(board);
      return isGameOver(marker);
    }

    return false;
  };

  const isGameOver = function (marker) {
    //isGameOver method takes in a marker as input and checks if the winning
    // patter exists for the provided marker and returns boolean true if exists else returns false

    let rowCompleted = false;
    let colCompleted = false;
    let diagonalCompleted = false;

    const rowMatcher = function (r1, r2, r3) {
      rowCompleted =
        r1.every((item) => item == marker) ||
        r2.every((item) => item == marker) ||
        r3.every((item) => item == marker);
      // alert("rowCompleted " + rowCompleted);
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
      // alert("colCompleted " + colCompleted);
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

    return rowCompleted || colCompleted || diagonalCompleted;
  };

  return { name, play, isGameOver, board };
};

const createPlayer = function (name, marker) {
  // creates a player with name and marker and score initialized to zero
  // provides incrementScore to add 1 point to player score.

  this.name = name;
  this.marker = marker;
  this.score = 0;

  this.incrementScore = () => score++;
  return { name, score, incrementScore, marker };
};

const screenController = (function () {
  const createGameDOM = function (player1, player2, board, currPlayer) {
    createGameBoardUI(player1, player2, board, currPlayer);
    createPlayerCard(player1, currPlayer);
    createPlayerCard(player2, currPlayer);
  };

  const createPlayerCard = function (player, currPlayer) {
    const container = document.querySelector("main");
    const playerInfo = document.createElement("div");
    const playerName = document.createElement("h2");
    const playerMarker = document.createElement("h3");
    const playerScore = document.createElement("p");

    playerName.textContent = player.name;
    playerMarker.textContent = `marker: ${player.marker}`;
    playerScore.textContent = `Score: ${player.score}`;

    playerInfo.appendChild(playerName);
    playerInfo.appendChild(playerMarker);
    playerInfo.appendChild(playerScore);

    if (currPlayer === player) {
      playerInfo.classList.toggle("current");
    }

    container.appendChild(playerInfo);
  };

  const createGameBoardUI = function (player1, player2, board, currPlayer) {
    const container = document.querySelector("main");
    const boardContainer = document.createElement("div");
    const boardName = document.createElement("h1");

    const rowLength = board.board.length;
    const colLength = board.board.length;

    for (let i = 0; i < rowLength; i++) {
      const row = document.createElement("div");
      for (j = 0; j < colLength; j++) {
        const colItem = document.createElement("button");
        colItem.textContent = board.board[i][j];
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

    const playTurn = function (event) {
      let i = event.target.dataset.row;
      let j = event.target.dataset.column;
      let currPlayer = Game.toggleCurrentPlayer();
      event.target.textContent = currPlayer.marker;
      Game.playRound(i, j);
      return currPlayer;
    };

    boardContainer.id = board.name;
    boardName.textContent = board.name;

    container.appendChild(boardContainer);
  };

  return { createGameDOM };
})();

const Game = (function () {
  const board = createGameBoard("Tic-Tac-Toe");
  const player1 = createPlayer("SuperMan", "X");
  const player2 = createPlayer("Batman", "O");

  let isGameOver = false;
  let currPlayer = player1;

  screenController.createGameDOM(player1, player2, board, currPlayer);

  const toggleCurrentPlayer = function () {
    currPlayer = currPlayer == player1 ? player2 : player1;
    return currPlayer;
  };

  const playRound = function (i, j) {
    if (!isGameOver) {
      isGameOver = board.play(i, j, currPlayer.marker);
      console.log(Game.isGameOver);
    } else {
      currPlayer = currPlayer == player1 ? player2 : player1;
      alert(`${currPlayer.name} Won!`);
    }
    return isGameOver;
  };

  // currPlayer = currPlayer == player1 ? player2 : player1;

  return { board, toggleCurrentPlayer, playRound };
})();
