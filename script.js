const createGameBoard = function (name) {
  this.name = name;
  const board = [];

  const init = function () {
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
      board[i][j] = marker;
      gameStatus(marker);
      return `goodMove`;
    } else {
      return `badMove`;
    }
  };

  const gameStatus = function (marker) {
    const positions = [];
    board.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col == marker) {
          positions.push({ marker, rowIndex, colIndex });
          console.log(positions);
        }
      });
    });
  };

  return { info, show, play };
};

const createPlayer = function (name, marker) {
  this.name = name;
  this.marker = marker;
  this.score = 0;

  this.info = function () {
    return { name, marker };
  };

  this.appendScore = () => score++;
  return { info, appendScore, marker };
};

const createGame = function () {
  const player1 = createPlayer("Player1", "X");
  const player2 = createPlayer("Player2", "O");
  const board = createGameBoard("Tic-Tac-Toe");
  const rounds = 0;

  board.play(
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3),
    player1.marker
  );

  board.play(
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3),
    player2.marker
  );
  board.play(
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3),
    player1.marker
  );

  return { board, rounds, player1, player2 };
};

let myGame = createGame();
