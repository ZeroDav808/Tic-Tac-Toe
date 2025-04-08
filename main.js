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
    let openSlot = board[row][col];

    if (
      openSlot.getValue() !== "" ||
      row >= 3 ||
      row < 0 ||
      col >= 3 ||
      col < 0
    ) {
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
      score: 0,
    },

    {
      name: name2,
      value: "O",
      score: 0,
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
    let success = board.addSelection(row, col, getCurrentPlayer());

    if (!success) {
      console.log(
        `That slot is already taken! ${
          getCurrentPlayer().name
        }, please choose a different position.`
      );
      return false;
    }

    if (checkRow() || checkCol() || checkDiagLtR() || checkDiagBlTr()) {
      winner = true;
      board.printBoard();
      console.log(`${getCurrentPlayer().name} wins!`);
      getCurrentPlayer().score++;
      resetGame();
      return true;
    }

    if (checkTie()) {
      board.printBoard();
      console.log("It's a tie!");
      resetGame();
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
    getBoard: board.getBoard, // ← add this!
  };
}

function displayController() {

    const dataObj = {};
    const form = document.querySelector('form');
    let isFormSubmitted = false;

    const game = gameController();
    const boardDiv = document.querySelector(".board");
    const turnDiv = document.querySelector(".playerTurn");
  
    const updateDisplay = () => {
      boardDiv.textContent = "";
      const board = game.getBoard();
      const player = game.getCurrentPlayer();
      turnDiv.textContent = `${player.name}'s turn`;
  
      board.forEach((rowArr, rowIndex) => {
        rowArr.forEach((cell, colIndex) => {
          const cellBtn = document.createElement("button");
          cellBtn.classList.add("Cell");
          cellBtn.dataset.column = colIndex;
          cellBtn.dataset.row = rowIndex;
          cellBtn.textContent = cell.getValue();
          cellBtn.style.borderRadius = "25px";
          cellBtn.style.border = "5px solid white";
          cellBtn.style.fontSize = "25px";
          boardDiv.appendChild(cellBtn);
        });
      });
    };

    function formHandler(event) {
        event.preventDefault();
        isFormSubmitted = true;

        const formData = new FormData(form);

        formData.forEach((value, key) => {
            dataObj[key] = value;
        });

        // ✅ Attach clickHandler once, not inside updateDisplay
        boardDiv.addEventListener("click", clickHandler);

        console.log("Form submitted. Data:", dataObj); // Logs updated data after form submission
    }
  
    function clickHandler(e) {
      const column = Number(e.target.dataset.column);
      const row = Number(e.target.dataset.row);
  
      if (isNaN(column) || isNaN(row)) return;
  
      game.playNextRound(row, column);
      updateDisplay();
    }
  
    form.addEventListener('submit', formHandler);

    // ✅ Attach clickHandler once, not inside updateDisplay
    //boardDiv.addEventListener("click", clickHandler);
  
    // ✅ Only call updateDisplay to draw board
    updateDisplay();
  }
  

displayController();