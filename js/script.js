const createPlayer = (marker, name, isHuman) => ({
  marker,
  scores: 0,
  name,
  isHuman
})

const GameBoard = (() => {
  const players = {
    player1: createPlayer('X', 'John Doe', true),
    player2: createPlayer('O', 'Jane Doe', false)
  }

  let board = Array.from({length: 3}, () => Array(3).fill(null));

  let rounds = 1;
  let currentPlayer = 'player1';
  let round = true;
  
  const gameLogic = (x, y, mark) => {
    let horizontal = true;
    let vertical = true;
    let diagonal = false;
    
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

      // Check Diagonal
      const isMainDiagonal = (x === y);
      const isAntiDiagonal = (x + y === 2);

      if(isMainDiagonal || isAntiDiagonal) {
        if(isMainDiagonal) {
          diagonal = board[0][0] === mark && board[1][1] === mark && board[2][2] === mark;
        }

        if(isAntiDiagonal){
          diagonal = board[0][2] === mark && board[1][1] === mark && board[2][0] === mark;
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
      players[currentPlayer].scores++;

      return true;
    }
    return false;
  }

  const switchPlayer = () => {
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
  }

  const isItTie = () => {
    for(let row of board){
      for(let column of row){
        if(column === null){
          return false;
        }
      }
    }

    console.log('Tie');
    return true;
  }

  const reset = () => {
    board = Array.from({length: 3}, () => Array(3).fill(null));
    round = true;
    currentPlayer = 'player1';
  }
  
  const roundEnd = () => {
    console.log("Round Ended");
    console.log({
      player1: players['player1'].scores,
      player2: players['player2'].scores
    });
    round = false;
    rounds++;

    if(rounds > 3){
      gameEnded();
    }
  }

  const gameEnded = () => {
    let winner;
    let player;

    if(players.player1.scores === players.player2.scores) {
      console.log("It's a Tie");
      return;
    }else {
      if(players.player1.scores > players.player2.scores) {
        winner = players.player1;
        player = 1;
      }else{
        winner = players.player2;
        player = 2;
      }
    }

    if(winner.human) {
      console.log(`Player ${player} Win`)
    }else{
      console.log('AI Win')
    }
  }

  const manageRound = (restartGame = false) => {
    if(restartGame) {
      rounds = 1;
      players.player1.scores = 0;
      players.player2.scores = 0;
    }else{
      if(rounds > 3) {
        console.log('Game Ended');
        return;
      }
    }
    
    reset();
  }
  
  return {
    getBoard: () => {
      const boardCopy = board.map(row => [...row]);
      console.log(boardCopy);
    },
    player: (player, marker, isHuman, name) => {
      if(players[player]){
        players[player].marker = createPlayer(marker, name, isHuman);
      }
      console.log(players);
    },
    playerInfo: () => ({
      marker: players[currentPlayer].marker,
      isHuman: players[currentPlayer].human,
      playerName: players[currentPlayer].name
    }),
    move: (x, y) => {
      if(board[x][y] === null && round){
        board[x][y] = players[currentPlayer].marker;

        if(gameLogic(x, y, board[x][y]) || isItTie()){
          roundEnd();
        }else{
          switchPlayer();
        }
      }else{
        console.log('filled or round ended');
        return true;
      }
    },
    getScores: () => ({
        player1: players['player1'].scores,
        player2: players['player2'].scores
    }),
    manageRound
  };
})();

const move = (x, y) => {
  console.log(x, y)
  console.log(GameBoard.playerInfo().isHuman);
  if(GameBoard.playerInfo().isHuman){
    GameBoard.move(x, y);
    GameBoard.getBoard();
  }else{
    aiMoves(x, y);
    GameBoard.getBoard();
  }
}

const aiMoves = (x, y) => {
  while(!GameBoard.move(x, y)){
    x = Math.floor(Math.random() * 3);
    y = Math.floor(Math.random() * 3);
    console.log(x, y)
    GameBoard.getBoard();
  }
}

const next = (restart = false) => {
  GameBoard.manageRound(restart);
}

document.addEventListener('click', (e) => {
  if(e.target.closest('.circle')){
    const x = Math.floor(Math.random() * 3);
    const y = Math.floor(Math.random() * 3);
    move(x, y);
  }else if(e.target.closest('.reset')){
    next();
  }else if(e.target.closest('.restart')){
    next(true);
  }
})

GameBoard.player('player1', '#', true, 'John Doe');
GameBoard.player('player2', '*', false, 'Jane Doe');