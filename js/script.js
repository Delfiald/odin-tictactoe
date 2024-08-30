const GameBoard = (() => {
  let board = Array.from({length: 3}, () => Array(3).fill(null));

  let firstPlayerScores = 0;
  let secondPlayerScores = 0;
  
  const gameLogic = (x, y, mark) => {
    let horizontal = true;
    let vertical = true;
    let diagonal = false;
    if(board[x][y] === mark){
      for(let i = 0; i < board.length; i++){
        // Check Horizontal
        if(board[x][y] != board[x][i]){
          horizontal = false;
        }
  
        // Check Vertical
        if(board[x][y] != board[i][y]){
          vertical = false;
        }
      }
    }

    // I think need optimizations
    // Check Diagonal
    if(x === 0 && y === 0 || x === 1 && y === 1 || x === 2 && y === 2 || x === 0 && y === 2 || x === 2 && y === 0){
      if(
        board[x][y] === board[1][1] &&
        board[x][y] === board [2][2] &&
        board[x][y] === board[0][0])
      {
        diagonal = true;
      }else if(
        board[x][y] === board[1][1] &&
        board[x][y] === board [2][0] &&
        board[x][y] === board[0][2])
      {
        diagonal = true;
      }
    }

    if(horizontal){
      console.log('horizontal');
      console.log(`player with ${mark} wins`);
      console.log(board);
      return true;
    }
    else if(vertical){
      console.log('vertical');
      console.log(`player with ${mark} wins`);
      console.log(board);
      return true;
    }
    else if(diagonal){
      console.log('diagonal');
      console.log(`player with ${mark} wins`);
      console.log(board);
      return true;
    }

    return false;
  }
  
  return {
    getBoard: () => {
      console.log(board);
    },
    playerTurn: (x, y, mark) => {
      if(board[x][y] === null){
        board[x][y] = mark;
      }else{
        console.log('filled');
      }

      if(gameLogic(x, y, mark)){
        // Adding Score
        // Reset Game
        console.log('Game End');
      }
    },
  };
})();

GameBoard.playerTurn(0, 2, 'o');
GameBoard.playerTurn(1, 0, 'o');
GameBoard.playerTurn(2, 1, 'x');
GameBoard.playerTurn(0, 1, 'x');
GameBoard.playerTurn(1, 2, 'o');
GameBoard.playerTurn(2, 0, 'x');
GameBoard.playerTurn(2, 2, 'o');
GameBoard.getBoard();