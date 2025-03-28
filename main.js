console.log('Hello, World@');

const gameBoard = (function() {
    let board = [
        ['x', null, null],
        [null, 'y', null],
        [null, null, 'z']
    ];

    // Mutator functions to assign X or O
    const topLeft    = (val) => board[0][0] = val;
    const topMiddle  = (val) => board[0][1] = val;
    const topRight   = (val) => board[0][2] = val;
    const midLeft    = (val) => board[1][0] = val;
    const midMiddle  = (val) => board[1][1] = val;
    const midRight   = (val) => board[1][2] = val;
    const botLeft    = (val) => board[2][0] = val;
    const botMiddle  = (val) => board[2][1] = val;
    const botRight   = (val) => board[2][2] = val;
    // Resets the boards state to empty
    let resetBoard = () => {
        board.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                board[rowIndex][colIndex] = '';
            });
        });
    };
    

    return {board,topLeft, topMiddle, topRight, midLeft, 
            midMiddle, midRight, botLeft, botMiddle, 
            botRight, resetBoard};
})();

function createPlayer(value) {
    const item = value;
}

  