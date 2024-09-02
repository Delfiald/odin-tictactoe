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

  const comHandler = () => {
    let random = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === null) {
          random.push([i, j]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * random.length);

    if(random.length === 0){
      return;
    }

    const x = random[randomIndex][0];
    const y = random[randomIndex][1];

    console.log(x, y);

    setTimeout(() =>{
      gameContainer.style.pointerEvents = 'initial';
      GameBoard.move(x, y);
    }, 500)

    gameContainer.style.pointerEvents = 'none';
  }

  const switchPlayer = () => {
    console.log('switch player');
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';

    console.log('player selanjutnya: '+players[currentPlayer].isHuman);

    if(!players[currentPlayer].isHuman){
      comHandler();
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

    if(!players[currentPlayer].isHuman){
      comHandler();
    }
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

  const player1Name = document.querySelectorAll('.player1name');
  const player2Name = document.querySelectorAll('.player2name');
  const player1Marker = document.querySelector('.player1-section .player-marker');
  const player2Marker = document.querySelector('.player2-section .player-marker');
  const player1Status = document.querySelector('.player1-section .player-status')
  const player2Status = document.querySelector('.player2-section .player-status')
  const player1InputName = document.querySelector('#name1');
  const player2InputName = document.querySelector('#name2');

  const player1InputStatus = document.querySelectorAll('.menu .player-1 .player-status input')
  const player2InputStatus = document.querySelectorAll('.menu .player-2 .player-status input')

  const getPlayerStatus = () => {
    player1Name.forEach((name) => {
      name.textContent = players.player1.name;
      console.log(name);
    })
  
    player2Name.forEach((name) => {
      name.textContent = players.player2.name;
    })

    if (player1Marker.childElementCount === 0) {
      const cloneMarker1 = markerTemplate.cloneNode(true);
      if(players.player1.marker === '#'){
        cloneMarker1.querySelector('.marker').classList.add('marker-1');
      } else {
        cloneMarker1.querySelector('.marker').classList.add('marker-2');
      }
      player1Marker.appendChild(cloneMarker1);
    }

    if (player2Marker.childElementCount === 0) {
        const cloneMarker2 = markerTemplate.cloneNode(true);
        if(players.player2.marker === '*'){
          cloneMarker2.querySelector('.marker').classList.add('marker-2');
        } else {
          cloneMarker2.querySelector('.marker').classList.add('marker-1');
        }
        player2Marker.appendChild(cloneMarker2);
    }

    player1InputName.value = players.player1.name;
    player2InputName.value = players.player2.name;

    player1Status.textContent = players.player1.isHuman ? 'Human' : 'COM';
    player2Status.textContent = players.player2.isHuman ? 'Human' : 'COM';

    player1InputStatus.forEach((radio) =>{
      if(players.player1.isHuman.toString() === radio.value) {
        radio.checked = true;
      }
    })

    player2InputStatus.forEach((radio) =>{
      if(players.player2.isHuman.toString() === radio.value) {
        radio.checked = true;
      }
    })

    if(!players[currentPlayer].isHuman){
      comHandler();
    }
  }

  player1InputName.addEventListener('change', (e) => {
    players.player1.name = player1InputName.value;
    getPlayerStatus();
  })

  player2InputName.addEventListener('change', (e) => {
    players.player2.name = player2InputName.value;
    getPlayerStatus();
  })

  player1InputStatus.forEach((radioInput) => {
    radioInput.addEventListener('change', (e) => {
      if(radioInput.value === 'true'){
        players.player1.isHuman = true; 
      }else{
        players.player1.isHuman = false;  
      }
      getPlayerStatus();
    })
  })

  player2InputStatus.forEach((radioInput) => {
    radioInput.addEventListener('change', (e) => {
      if(radioInput.value === 'true'){
        players.player2.isHuman = true; 
      }else{
        players.player2.isHuman = false;  
      }
      getPlayerStatus();
    })
  })
  
  return {
    player: (player, marker, isHuman, name) => {
      if(players[player]){
        players[player] = createPlayer(marker, name, isHuman);
      }
      getPlayerStatus();
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

const getPlayerInfo = (playerNumber) => {
  const playerNameInput = document.querySelector(`#input-name-p${playerNumber}`);
  
  const playerRadio = document.querySelector(`.start .player-${playerNumber} input[type="radio"]:checked`);

  if (!playerRadio) {
    console.log("gak jalan")
    return null;
  }

  if(!playerNameInput.reportValidity()){
    return;
  }

  const playerName = playerNameInput.value;

  const playerMarker = document.querySelector(`.start .player-${playerNumber} .marker-wrapper.active`);

  if (!playerName || !playerMarker) {
    console.log("gak jalan")
    return null;
  }
  
  const playerStatus = playerRadio ? playerRadio.value === 'true' : false;
  const marker = playerMarker ? playerMarker.dataset.marker : '';

  return { playerName, playerStatus, marker };
}

const alert = document.querySelector('.alert');

const startGame = () => {
  const player1 = getPlayerInfo(1);
  const player2 = getPlayerInfo(2);
  
  if(!player1 || !player2){
    return;
  }
  
  if(player1.marker === player2.marker){
    alert.classList.add('trigger');
    return;
  }

  console.log(player1.playerName);
  console.log(player1.playerStatus);
  console.log(player1.marker);

  console.log(player2.playerName);
  console.log(player2.playerStatus);
  console.log(player2.marker);

  GameBoard.player('player1', player1.marker, player1.playerStatus, player1.playerName);
  GameBoard.player('player2', player2.marker, player2.playerStatus, player2.playerName);

  start.classList.add('hide');
}

const start = document.querySelector('.start');

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
  }else if(e.target.closest('.begin .start-button')){
    startGame();
  }else if(e.target.closest('.start-button')) {
    start.classList.add('begin')
  }else if(e.target.closest('.start .human-button') || e.target.closest('.start .com-button')){
    const player = e.target.closest('.player-1, .player-2');

    player.classList.add('status');
  }else if(e.target.closest('.start .marker-select .marker-wrapper')){
    const player = e.target.closest('.player-1, .player-2');

    const playerMarker = player.querySelectorAll('.marker-wrapper');
    playerMarker.forEach(marker => {
      marker.classList.remove('active');
      marker.classList.add('hide');
    })
    e.target.closest('.marker-wrapper').classList.add('active');
    e.target.closest('.marker-wrapper').classList.remove('hide');
  }else if(e.target.closest('.start .back-button')){
    const player = e.target.closest('.player-1, .player-2');
    player.classList.remove('status');
    const playerMarker = player.querySelectorAll('.marker-wrapper');
    playerMarker.forEach(marker => {
      marker.classList.remove('active');
      marker.classList.remove('hide');
    })
  }else if(e.target.closest('.alert .close-button')){
    alert.classList.remove('trigger');
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