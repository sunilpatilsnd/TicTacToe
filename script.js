const GameBoard = (function () {
  let board = [];
  let name = "Tik-Tak-Toe";

  function init() {
    while (board.length > 0) {
      board.pop();
    }
    for (let i = 0; i < 3; i++) {
      const arr = [];
      for (j = 0; j < 3; j++) {
        arr[j] = null;
      }
      board.push(arr);
    }
  }

  init(); //runs init function

  return { board, init, name };
})();

const createPlayer = function (name, marker, id) {
  this.id = id;
  this.name = name;
  this.marker = marker;
  this.score = 0;

  function getScore() {
    return this.score;
  }

  function incrementScore() {
    this.score++;
  }
  return { name, getScore, incrementScore, marker, score, id };
};

// UI controller Starts

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

    const nameEditor = document.createElement("button");

    nameEditor.textContent = "Edit";

    playerInfo.classList.add("player-card");
    playerInfo.id = player.id;

    playerName.textContent = player.name;
    playerMarker.textContent = `marker: ${player.marker}`;
    playerScore.textContent = `Score: ${player.score}`;

    playerInfo.appendChild(playerName);
    playerInfo.appendChild(playerMarker);
    playerInfo.appendChild(playerScore);
    playerName.appendChild(nameEditor);

    container.appendChild(playerInfo);

    nameEditor.addEventListener(
      "click",
      (event) => {
        updatePlayerNameDOM(player);
        nameEditor.removeEventListener("click", this.event, true);
      },
      true
    );
  };

  const createGameBoardUI = function (board) {
    const container = document.querySelector(".gameContainer");
    const boardContainer = document.createElement("div");
    const boardName = document.createElement("h1");

    boardContainer.id = GameBoard.name;
    boardName.textContent = GameBoard.name;

    container.appendChild(boardName);

    boardContainer.id = "board";

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

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset";
    resetBtn.classList.add("reset-btn");
    resetBtn.addEventListener("click", resetBoardDOM);
    container.appendChild(resetBtn);
  };

  const playTurn = function (event) {
    let i = event.target.dataset.row;
    let j = event.target.dataset.column;

    let currPlayer = GameController.getCurrPlayer();

    console.log(currPlayer.name + "'s Turn");

    if (GameController.getIsGameOver() == false) {
      if (event.target.textContent == "") {
        event.target.textContent = currPlayer.marker;
        GameController.playRound(i, j);
      } else {
        console.log("already marked!!");
      }
    } else if (GameController.getIsGameTie() == true) {
      console.log("Game Tied");
    } else {
      console.log("Game Over!");
      console.log(`${currPlayer.name}  Won!!`);
    }

    // console.log(GameController.getIsGameOver());
  };
  // createGameDOM();
  const updateDOM = function () {
    let gameOver = GameController.getIsGameOver();
    let currPlayer = GameController.getCurrPlayer();

    updatePlayerDOM();

    if (gameOver == true) {
      shoWResultDOM(currPlayer.name);
    }
  };

  const updatePlayerDOM = function () {
    //Toggle CSS for active players
    let allPlayers = document.querySelectorAll(`.player-card`);

    allPlayers.forEach((player) => {
      player.classList.remove("active"); //removes active class for all players
    });

    let currPlayer = GameController.getCurrPlayer();
    let currTurn = document.querySelector(`#${currPlayer.id}`);

    currTurn.classList.add(`active`); //add active class for current active player
    currTurn.lastChild.textContent = `Score: ${GameController.getCurrPlayer().getScore()}`; //updates score
  };

  const resetBoardDOM = function () {
    const board = document.querySelector(`#board`);
    const boartBtns = board.querySelectorAll(`button`);
    boartBtns.forEach((btn) => (btn.textContent = null));
    GameController.resetGame();
  };

  const shoWResultDOM = function (player) {
    const result = document.querySelector(".resultContainer");
    const resultText = document.createElement("p");

    result.appendChild(resultText);

    while (result.firstChild) {
      result.removeChild(result.firstChild);
    }

    resultText.textContent = `${player} Won!`;
    result.appendChild(resultText);
  };

  const updatePlayerNameDOM = function (player) {
    const selectedPlayerID = player.id;

    console.log(selectedPlayerID);

    const dialog = document.querySelector("dialog");
    dialog.querySelector("#playerName").value = player.name;
    dialog.showModal();

    console.log(player.name + "Inside dialogue open");

    const form = dialog.querySelector("form");

    form.addEventListener("submit", handleSubmit, true);

    function handleSubmit(event) {
      handleFormData(player);
      event.preventDefault();
      console.log(player.name + "Inside Submit");

      let a = document.querySelector(`#${selectedPlayerID}`);

      a.querySelector("h2").textContent = player.name;
      form.removeEventListener("submit", handleSubmit, true);
    }
  };

  function handleFormData(player) {
    const dialog = document.querySelector("dialog");
    const newName = dialog.querySelector("#playerName").value;

    GameController.changePlayerName(player, newName);
    dialog.close();
  }

  return { createGameDOM, updateDOM, resetBoardDOM };
})();

// UI controller Ends

// Game Controller starts

const GameController = (function () {
  const board = GameBoard.board;

  // console.table(board);
  const player1 = createPlayer("Player-1", "X", "player-1");
  const player2 = createPlayer("Player-2", "O", "player-2");
  let winner = null;

  let isGameOver = false;
  let isGameTie = false;

  let currPlayer = player1;

  screenController.createGameDOM(player1, player2, board);

  const toggleCurrentPlayer = function () {
    currPlayer = currPlayer == player1 ? player2 : player1;
    return currPlayer;
  };

  const playRound = function (i, j) {
    if (isGameOver == false && isGameTie == false) {
      if (board[i][j] === null) {
        board[i][j] = currPlayer.marker;
        updateGameState();
        screenController.updateDOM();
        if (winner == null) {
          toggleCurrentPlayer();
        }
      } else {
        console.log("Illegal Move");
      }
    }
  };

  const updateGameState = function () {
    let rowCompleted = false;
    let colCompleted = false;
    let diagonalCompleted = false;

    let marker = currPlayer.marker;

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

    if (isGameOver) {
      winner = currPlayer;
      // alert(`game over!`);
      currPlayer.incrementScore();
    } else if (isGameOver == false) {
      let boardContent = board.flat();

      if (boardContent.includes(null)) {
        isGameTie = false;
      } else {
        isGameTie = true;
      }
    }
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
  function resetGame() {
    GameBoard.init();
    winner = null;
    isGameOver = false;
    isGameTie = false;
    let currPlayer = player1;
  }

  function changePlayerName(selectedPlayer, newName) {
    console.log(selectedPlayer.name + "inside GameController");
    selectedPlayer.name = newName;
    console.log(selectedPlayer);
  }

  return {
    toggleCurrentPlayer,
    playRound,
    getCurrPlayer,
    getIsGameOver,
    getIsGameTie,
    resetGame,
    changePlayerName,
    player1,
    player2,
  };
})();
