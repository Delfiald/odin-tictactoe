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
  
  let highlight = {
    horizontal: [],
    vertical: [],
    diagonal: []
  };

  let board = Array.from({length: 3}, () => Array(3).fill(null));

  let rounds = 1;
  let currentPlayer = 'player1';
  let round = true;
  
  const gameLogic = (x, y, mark) => {
    let horizontal = true;
    let vertical = true;
    let diagonal = false;

    resetHighlight();

    if(board[x][y] === mark){
      for(let i = 0; i < board.length; i++){
        // Check Horizontal
        if(board[x][y] != board[x][i]){
          horizontal = false;
        }else {
          addHighlight('horizontal', [x, i]);
          // highlight.horizontal.push([x, i]);
        }
  
        // Check Vertical
        if(board[x][y] != board[i][y]){
          vertical = false;
        }else {
          addHighlight('vertical', [i, y]);
          // highlight.vertical.push([i, y]);
        }
      }

      // Check Diagonal
      const isMainDiagonal = (x === y);
      const isAntiDiagonal = (x + y === 2);

      if(isMainDiagonal || isAntiDiagonal) {
        if(isMainDiagonal) {
          diagonal = board[0][0] === mark && board[1][1] === mark && board[2][2] === mark;
          if(diagonal) addHighlight('diagonal', [[0, 0], [1, 1], [2, 2]]);
        }

        if(isAntiDiagonal){
          diagonal = board[0][2] === mark && board[1][1] === mark && board[2][0] === mark;
          if(diagonal) addHighlight('diagonal', [[0, 2], [1, 1], [2, 0]]);
        }
      }
    }

    if(horizontal || vertical || diagonal){
      if(horizontal){
        console.log('horizontal');
        renderHighlight('horizontal');
      }else if(vertical){
        console.log('vertical');
        renderHighlight('vertical');
      }else if( diagonal) {
        console.log('diagonal');
        renderHighlight('diagonal');
      }
      console.log(`player with ${mark} wins`);
      console.log(board);
      
      // Adding Scores;
      players[currentPlayer].scores++;

      return true;
    }
    return false;
  }

  const addHighlight = (track, grids) => {
    if(track){
      highlight[track].push(grids);
    }
  }

  const resetHighlight = (track) => {
    if(track){
      highlight[track] = [];
    }else{
      highlight = {
        horizontal: [],
        vertical: [],
        diagonal: []
      };
    }
  }

  const renderHighlight = (track) => {
    if(track){
      console.log('here');
      console.log(highlight[track]);
    }
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
    resetHighlight();
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

    if(winner.isHuman) {
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
        players[player] = createPlayer(marker, name, isHuman);
      }
      console.log(players);
    },
    playerInfo: () => ({
      marker: players[currentPlayer].marker,
      isHuman: players[currentPlayer].isHuman,
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
      }else if(!round){
        console.log('Round Ended')
        return true;
      }else{
        console.log('Filled');
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