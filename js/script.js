const GameBoard = (() => {
  let board = Array.from({length: 3}, () => Array(3).fill(null));

  let rounds = 0;
  let turns;

  let currentMark = '';

  const players = {
    player1: {
      marker: '',
      scores: 0,
      human: true
    },
    player2: {
      marker: '',
      scores: 0,
      human: false
    }
  }

  const setMark = () => {
    if(currentMark === players['player1'].marker){
      currentMark = players['player2'].marker;
    }else if(currentMark === players['player2'].marker){
      currentMark = players['player1'].marker;
    }else {
      alert(`not your turn ${currentMark}`)
    }
  }
  
  const gameLogic = (x, y, mark) => {
    let horizontal = true;
    let vertical = true;
    let diagonal = false;
    let tie = false;

    if(isItTie()){
      tie = true;
    }
    
    let highlight = {};

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
    }

    if(horizontal || vertical || diagonal){
      if(horizontal){
        console.log('horizontal');
      }else if(vertical){
        console.log('vertical');
      }else if( diagonal) {
        console.log('diagonal');
      }
      console.log(`player with ${mark} wins`);
      console.log(board);
      
      // Adding Scores;
      const currentPlayer = getPlayerByMarker();
      players[currentPlayer].scores++;

      return true;
    }else if(tie){
      console.log('Tie');
      return true;
    }

    return false;
  }

  const isItTie = () => {
    for(let row of board){
      for(let column of row){
        if(column === null){
          return false;
        }
      }
    }

    return true;
  }

  const getPlayerByMarker = () => {
    console.log(currentMark);
    for (const playerKey in players) {
      if (players[playerKey].marker === currentMark) {
        return playerKey;
      }
    }
  }

  let round = true;
  
  const roundEnd = () => {
    console.log("Round Ended");
    console.log({
      player1: players['player1'].scores,
      player2: players['player2'].scores
    });
    round = false;
  }
  
  return {
    getBoard: () => {
      const boardCopy = board.map(row => [...row]);
      console.log(boardCopy);
    },
    player: (player, marker, isHuman) => {
      if(players[player]){
        players[player].marker = marker;
        players[player].human = isHuman;
      }

      currentMark = players['player1'].marker;
      console.log(players);
    },
    getMark: () => {
      return currentMark;
    },
    getTurn: () => {
      const currentPlayer = getPlayerByMarker();
      return players[currentPlayer].human;
    },
    playerMoves: (x, y) => {
      if(board[x][y] === null){
        board[x][y] = currentMark;
      }else{
        console.log('filled');
        return;
      }

      if(gameLogic(x, y, currentMark)){
        // Reset Game
        roundEnd();
        return;
      }

      setMark();
    },
    round : () => {
      return round;
    },
    getScores: () => {
      return {
        player1: players['player1'].scores,
        player2: players['player2'].scores
      }
    },
    reset: () => {
      board = Array.from({length: 3}, () => Array(3).fill(null));
      round = true;
    }
  };
})();

GameBoard.player('player1', '#', true);
GameBoard.player('player2', '*', false);

const move = (x, y) => {
  if(GameBoard.round()){
    console.log(x, y)
    console.log(GameBoard.getTurn());
    if(GameBoard.getTurn()){
      GameBoard.playerMoves(x, y);
      GameBoard.getBoard();
    }else{
      GameBoard.playerMoves(x, y);
      GameBoard.getBoard();
    }
  }else{
    console.log("Round Ended");
  }
}

const reset = () => {
  GameBoard.reset();
}

document.addEventListener('click', (e) => {
  if(e.target.closest('.circle')){
    const x = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
    const y = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
    move(x, y);
  }else if(e.target.closest('.reset')){
    reset();
  }
})