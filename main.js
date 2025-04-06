function gameBoard() {
  const ROWS = 3;
  const COLS = 3;
  const board = [];

  for (let i = 0; i < ROWS; i++) {
    board[i] = [];
    for (let j = 0; j < COLS; j++) {
      board[i].push(slot());
    }
  }

  const getBoard = () => board;

  const addSelection = (row, col, player) => {
    const openSlot = board[row][col];

    if (openSlot.getValue() !== '' || row >= 3 || row < 0 || col >= 3 || col < 0) {
      console.log("Please try again!");
      return false;
    } else {
      openSlot.selectSlot(player.value);
      console.log(
        "Inserted " + player.value + " at " + `board [${row}][${col}]`
      );
      return true;
    }
  };

  const printBoard = () => {
    const boardSlots = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardSlots);
  };

  const resetBoard = () => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        board[row][col].selectSlot("");
      }
    }
  };

  return { getBoard, addSelection, printBoard, resetBoard };
}

function slot() {
  let value = "";

  const selectSlot = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    selectSlot,
    getValue,
  };
}

function gameController(name1 = "Player One", name2 = "Player Two") {
  const board = gameBoard();
  let winner = false;

  const players = [
    {
      name: name1,
      value: "X",
    },

    {
      name: name2,
      value: "O",
    },
  ];

  let currentPlayer = players[0];

  let switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };
  const getCurrentPlayer = () => currentPlayer;

  const printNextRound = () => {
    board.printBoard();
    console.log(`${getCurrentPlayer().name}'s turn.`);
  };

  const checkRow = () => {
    for (let i = 0; i < board.getBoard().length; i++) {
      let arr = board.getBoard()[i];
      // Need to map the objects to their values before filtering
      let values = arr.map((element) => element.getValue());
      values = values.filter((value) => value === getCurrentPlayer().value);
      if (values.length === 3) {
        return true;
      }
    }
    return false;
  };

  const checkCol = () => {
    for (let col = 0; col < board.getBoard().length; col++) {
      let arr = [];
      for (let row = 0; row < board.getBoard().length; row++) {
        arr.push(board.getBoard()[row][col].getValue());
      }
      arr = arr.filter((element) => element === getCurrentPlayer().value);
      if (arr.length === 3) {
        return true;
      }
    }
    return false;
  };

  const checkDiagLtR = () => {
    let arr = [];
    for (let i = 0; i < board.getBoard().length; i++) {
      arr.push(board.getBoard()[i][i].getValue());
    }

    arr = arr.filter((element) => element === getCurrentPlayer().value);
    if (arr.length === 3) {
      return true;
    }
    return false;
  };

  const checkDiagBlTr = () => {
    let arr = [];
    let i = 2;
    for (let row = 0; row < board.getBoard().length; row++) {
      arr.push(board.getBoard()[row][i].getValue());
      i--;
    }
    arr = arr.filter((element) => element === getCurrentPlayer().value);
    if (arr.length === 3) {
      return true;
    }
    return false;
  };

  const checkTie = () => {
    for (let i = 0; i < board.getBoard().length; i++) {
      for (let j = 0; j < board.getBoard()[i].length; j++) {
        if (board.getBoard()[i][j].getValue() === "") {
          return false;
        }
      }
    }
    return true;
  };

  const playNextRound = (row, col) => {
     const success = board.addSelection(row, col, getCurrentPlayer());

     if(!success) {
        console.log(`That slot is already taken! ${getCurrentPlayer().name}, please choose a different position.`);
        return false;
     }

    if (checkRow() || checkCol() || checkDiagLtR() || checkDiagBlTr()) {
      winner = true;
      board.printBoard();
      console.log(`${getCurrentPlayer().name} wins!`);
      return true;
    }

    if (checkTie()) {
      board.printBoard();
      console.log("It's a tie!");
      return true;
    }

    switchPlayer();
    printNextRound();
    return true;
  };

  printNextRound();

  const getWinner = () => winner;
  const resetGame = () => {
    winner = false;
    board.resetBoard();
    currentPlayer = players[0];
    printNextRound();
  };

  return {
    getCurrentPlayer,
    playNextRound,
    resetGame,
    getWinner,
  };
}

const game = gameController();
