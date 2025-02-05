const GameBoard = (function () {
  const gameBoard = [];

  const initBoard = function () {
    for (let i = 0; i < 3; i++) {
      const arr = [];
      for (j = 0; j < 3; j++) {
        arr[j] = null;
      }
      gameBoard.push(arr);
    }
  };

  const showBoard = () => gameBoard;

  initBoard();

  return { showBoard };
})();
