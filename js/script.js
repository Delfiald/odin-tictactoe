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

  let highlighted = {};

  let board = Array.from({length: 3}, () => Array(3).fill(null));

  let rounds = 1;
  let currentPlayer = 'player1';
  let round = true;

  const roundText = document.querySelector('.hero .round');

  roundText.textContent = rounds;

  const getCurrentMarker = () => {
    return players[currentPlayer].marker;
  }

  const gameLogic = (x, y, mark) => {
    x = parseInt(x);
    y = parseInt(y);
    
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
        }
  
        // Check Vertical
        if(board[x][y] != board[i][y]){
          vertical = false;
        }else {
          addHighlight('vertical', [i, y]);
        }
      }

      // Check Diagonal
      const isMainDiagonal = (x === y);
      const isAntiDiagonal = (x + y == 2);
      console.log("here1: " + isMainDiagonal);
      console.log("here2: " + isAntiDiagonal);

      if(isMainDiagonal || isAntiDiagonal) {
        if(isMainDiagonal) {
          console.log("jalan main");
          const mainDiagonal = board[0][0] === mark && board[1][1] === mark && board[2][2] === mark;
          if(mainDiagonal) {
            diagonal = true;
            addHighlight('diagonal', [0, 0]);
            addHighlight('diagonal', [1, 1]);
            addHighlight('diagonal', [2, 2]);
          }
        }

        if(isAntiDiagonal){
          console.log("jalan anti");
          const antiDiagonal = board[0][2] === mark && board[1][1] === mark && board[2][0] === mark;
          if(antiDiagonal) {
            diagonal = true;
            addHighlight('diagonal', [0, 2]);
            addHighlight('diagonal', [1, 1]);
            addHighlight('diagonal', [2, 0]);
          }
        }
      }
    }

      if(horizontal || vertical || diagonal){
        setTimeout(() => {
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
        }, 50)
  
        // Adding Scores;
        players[currentPlayer].scores++;

        if(currentPlayer === 'player1'){
          player2Life[players[currentPlayer].scores - 1].classList.add('loss')
        }else{
          player1Life[players[currentPlayer].scores - 1].classList.add('loss')
        }
  
        gameContainer.parentElement.classList.add('winner');
        
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
      highlighted = highlight[track];

      console.log(highlighted);
      highlightGrids(highlighted, getAllGrid);
    }
  }

  const switchPlayer = () => {
    console.log('switch player');
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';

    console.log('player selanjutnya: '+players[currentPlayer].isHuman);

    if(!players[currentPlayer].isHuman){
      let random = [];
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === null) {
            random.push([i, j]);
          }
        }
      }

      const randomIndex = Math.floor(Math.random() * random.length);

      console.log(random);
      console.log(random[randomIndex])
      const x = random[randomIndex][0];
      const y = random[randomIndex][1];

      console.log(x, y);

      setTimeout(() =>{
        gameContainer.style.pointerEvents = 'initial';
        GameBoard.move(x, y);
      }, 500)

      gameContainer.style.pointerEvents = 'none';
    }
  }

  const isItTie = () => {
    for(let row of board){
      for(let column of row){
        if(column === null){
          return false;
        }
      }
    }

    gameContainer.parentElement.classList.add('tie');
    return true;
  }

  const reset = () => {
    console.log("Game Reseted");
    board = Array.from({length: 3}, () => Array(3).fill(null));
    round = true;
    currentPlayer = 'player1';
    highlighted = {};
    resetHighlight();
    body.classList.remove('p1-wins', 'p2-wins', 'tie');
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

  const body = document.querySelector('body')

  const gameEnded = () => {
    let winner;
    let player;

    if(players.player1.scores === players.player2.scores) {
      console.log("It's a Tie");
      nextButton.classList.add('hidden');
      restartButton.classList.add('restart');
      setTimeout(() => {
        body.classList.add('tie')
      }, 1000)
      return;
    }else {
      if(players.player1.scores > players.player2.scores) {
        winner = players.player1;
        player = 1;
        setTimeout(() => {
          body.classList.add('p1-wins')
        }, 1000)
      }else{
        winner = players.player2;
        player = 2;
        setTimeout(() => {
          body.classList.add('p2-wins')
        }, 1000)
      }
    }

    if(winner.isHuman) {
      console.log(`Player ${player} Win`)
    }else{
      console.log('AI Win')
    }
    
    nextButton.classList.add('hidden');
    restartButton.classList.add('restart');
  }

  const manageRound = (restartGame = false) => {
    if(restartGame) {
      rounds = 1;
      roundText.textContent = rounds;
      players.player1.scores = 0;
      players.player2.scores = 0;
      player1Life.forEach(life => {
        life.classList.remove('loss');
      })
      player2Life.forEach(life => {
        life.classList.remove('loss');
      })
    }else{
      if(rounds > 3) {
        return;
      }else{  
        roundText.textContent = rounds;
      }
    }
    
    reset();
  }

  const addingMarker = (x, y, marker) => {
    const dataset = x + ',' + y;
    let getGrid;

    grids.forEach(grid => {
      if(grid.dataset.grid === dataset){
        getGrid = grid;
      }
    })
    const cloneMarker = markerTemplate.cloneNode(true);
    getGrid.innerHTML = '';
    if(marker === marker1){
      cloneMarker.querySelector('.marker').classList.add('marker-1');
      getGrid.appendChild(cloneMarker);
    }
    else if(marker === marker2){
      cloneMarker.querySelector('.marker').classList.add('marker-2');
      getGrid.appendChild(cloneMarker);
    }
    getGrid.classList.add('marked');
  }
  
  return {
    player: (player, marker, isHuman, name) => {
      if(players[player]){
        players[player] = createPlayer(marker, name, isHuman);
      }
      console.log(players);
    },
    playerInfo: () => ({
      marker: getCurrentMarker(),
      isHuman: players[currentPlayer].isHuman,
      playerName: players[currentPlayer].name
    }),
    move: (x, y) => {
      if(board[x][y] === null && round){
        const currentMarker = getCurrentMarker();
        board[x][y] = currentMarker;

        addingMarker(x, y, currentMarker)

        if(gameLogic(x, y, currentMarker)){
          roundEnd();
        }else if(isItTie()){
          roundEnd();
        }else{
          switchPlayer();
        }

        return true;
      }else if(!round){
        console.log('Round Ended')
        return false;
      }
    },
    getScores: () => ({
        player1: players['player1'].scores,
        player2: players['player2'].scores
    }),
    manageRound: manageRound
  };
})();

const marker1 = '#'
const marker2 = '*'

const player1Life = document.querySelectorAll('.player1-section .player-life > div')
const player2Life = document.querySelectorAll('.player2-section .player-life > div')

GameBoard.player('player1', marker1, true, 'John Doe');
GameBoard.player('player2', marker2, false, 'Jane Doe');

const move = (x, y) => {
  console.log(x, y)
  console.log(GameBoard.playerInfo().isHuman);

  const marker = GameBoard.playerInfo().marker;
  console.log(marker);

  if(GameBoard.playerInfo().isHuman){
    GameBoard.move(x, y);
  }
}

function highlightGrids(highlighted, getAllGrid) {
  for (let i = 0; i < highlighted.length; i++) {
    const highlightString = highlighted[i].join(',');
    
    getAllGrid.forEach(grid => {
      const markerWrapper = grid.querySelector('.marker-wrapper');
      
      if (highlightString === grid.dataset.grid && markerWrapper) {
        markerWrapper.style.animation = `highlighted .5s ease ${i * .25}s forwards`;
        grid.classList.add('highlighted');
      }
    });
  }
}

const nextButton = document.querySelector('.next-button');
const restartButton = document.querySelector('.restart-button');

const next = (restart = false) => {
  GameBoard.manageRound(restart)
  
  reset();
}

const reset = () => {
  gameContainer.parentElement.classList.remove('winner', 'tie');
  nextButton.classList.remove('hidden');
  restartButton.classList.remove('restart');
  grids.forEach(grid => {
    grid.classList.remove('highlighted', 'marked');
    grid.innerHTML = '';
  })
}

// UI
const gameContainer = document.querySelector('.game-container');
const getAllGrid = gameContainer.querySelectorAll('.grid');
const markerTemplate = document.querySelector('#marker').content;
const menu = document.querySelector('.menu');

const moveHandler = (e) => {
  console.log('here')
  const getGrid = e.target.closest('.game-container > div');
  const gridPosition = getGrid.dataset.grid;
  const [x, y] = gridPosition.split(',');

  move(x, y);
}

const showMarker = (e) => {
  const getGrid = e.target.closest('.game-container > div');

  if(getGrid.classList.contains('marked')){
    return;
  }

  const marker = GameBoard.playerInfo().marker;

  const cloneMarker = markerTemplate.cloneNode(true);
  cloneMarker.querySelector('.marker-wrapper').style.opacity = '.5';
  if(marker === marker1){
    cloneMarker.querySelector('.marker').classList.add('marker-1');
    getGrid.appendChild(cloneMarker);
  }
  else if(marker === marker2){
    cloneMarker.querySelector('.marker').classList.add('marker-2');
    getGrid.appendChild(cloneMarker);
  }
}

const removeMarker = (e) => {
  const getGrid = e.target.closest('.game-container > div');
  if(getGrid.classList.contains('marked')){
    return;
  }
  
  getGrid.innerHTML = '';
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
  }else if(e.target.closest('.game-container > div')){
    moveHandler(e);
  }else if(e.target.closest('.menu-button') || e.target.closest('.menu .close-button')) {
    menu.classList.toggle('show');
  }else if(e.target.closest('.next-button')) {
    next();
  }else if(e.target.closest('.restart-button')) {
    next(true);
    menu.classList.remove('show');
  }else if(e.target.closest('.settings-button') || e.target.closest('.close-settings')) {
    menu.classList.toggle('settings');
  }
})

const grids = document.querySelectorAll('.grid');

grids.forEach(grid => {
  grid.addEventListener('mouseenter', (e) => {
    showMarker(e);
  })

  grid.addEventListener('mouseleave', (e) => {
    removeMarker(e);
  })
})