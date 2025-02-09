const createGameBoard = function (name) {
  // console.log("inside createGameBoard()");

  this.name = name;
  const board = [];

  const init = function () {
    // console.log("inside init()");
    for (let i = 0; i < 3; i++) {
      const arr = [];
      for (j = 0; j < 3; j++) {
        arr[j] = null;
      }
      board.push(arr);
    }
  };

  init();

  const show = () => board;

  const info = () => `${name}`;

  const play = function (i, j, marker) {
    if (board[i][j] == null) {
      // console.log("inside board.play()");
      board[i][j] = marker;
      return isGameOver(marker);
    }
    return false;
  };

  const isGameOver = function (marker) {
    let rowCompleted = false;
    let colCompleted = false;
    let diagonalCompleted = false;

    // debugger;
    const rowMatcher = function (r1, r2, r3) {
      rowCompleted =
        r1.every((item) => item == marker) ||
        r2.every((item) => item == marker) ||
        r3.every((item) => item == marker);
      // alert("rowCompleted " + rowCompleted);
    };
    rowMatcher(...board);

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
    colMatcher();

    const diagonalMatcher = function () {
      let diagon1 = [];
      let diagon2 = [];

      diagon1.push(board[0][0], board[1][1], board[2][2]);

      diagon2.push(board[0][2], board[1][1], board[2][0]);

      diagonalCompleted =
        diagon1.every((item) => item == marker) ||
        diagon2.every((item) => item == marker);

      // alert("diagonalCompleted " + diagonalCompleted);
      // console.log(diagon1);
      // console.log(diagon2);
    };
    diagonalMatcher();

    return rowCompleted || colCompleted || diagonalCompleted;
  };

  return { info, show, play, isGameOver, board };
};

const createPlayer = function (name, marker) {
  console.log("inside createPlayer()");

  this.name = name;
  this.marker = marker;
  this.score = 0;

  this.info = function () {
    return { name, marker };
  };

  this.appendScore = () => score++;
  return { name, info, appendScore, marker };
};

const createGame = function () {
  const player1 = createPlayer("Player1", "X");
  const player2 = createPlayer("Player2", "O");
  const board = createGameBoard("Tic-Tac-Toe");

  let isGameOver = false;
  let currPlayer = player1;
  let rowNum;
  let colNum;

  while (!isGameOver) {
    console.log(`${currPlayer.name}'s turn`);
    console.log(board.board);

    rowNum = Number(prompt(`${currPlayer.name}'s turn enter row num`));

    colNum = Number(prompt(`${currPlayer.name}'s turn enter col num`));

    isGameOver = board.play(rowNum, colNum, currPlayer.marker);

    currPlayer = currPlayer == player1 ? player2 : player1;
  }
  currPlayer = currPlayer == player1 ? player2 : player1;
  alert(`${currPlayer.name} Won the game`);

  return { board };
};

let myGame = createGame();
