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
  
  let highlight = {
    horizontal: [],
    vertical: [],
    diagonal: []
  };

  let highlighted = {};

  let rounds = 1;
  let currentPlayer = 'player1';
  let round = true;

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

      if(isMainDiagonal || isAntiDiagonal) {
        if(isMainDiagonal) {
          const mainDiagonal = board[0][0] === mark && board[1][1] === mark && board[2][2] === mark;
          if(mainDiagonal) {
            diagonal = true;
            addHighlight('diagonal', [0, 0]);
            addHighlight('diagonal', [1, 1]);
            addHighlight('diagonal', [2, 2]);
          }
        }

        if(isAntiDiagonal){
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
      if(horizontal){
        renderHighlight('horizontal');
      }else if(vertical){
        renderHighlight('vertical');
      }else if( diagonal) {
        renderHighlight('diagonal');
      }

      // Adding Scores;
      players[currentPlayer].scores++;

      DOMController.playerHealthHandler(currentPlayer);

      DOMController.roundHandler('winner')
      
      return true;
    }

    return false;
  }

  // Highlight
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
      DOMController.highlightGrids(highlighted);
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

    DOMController.ComMove(random, randomIndex);
  }

  const switchPlayer = () => {
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';

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

    DOMController.roundHandler('tie');
    return true;
  }

  // Reset
  const reset = () => {
    board = Array.from({length: 3}, () => Array(3).fill(null));
    round = true;
    currentPlayer = 'player1';
    highlighted = {};
    resetHighlight();

    if(!players[currentPlayer].isHuman){
      comHandler();
    }
  }
  
  // Round End Check
  const roundEnd = () => {
    round = false;

    rounds++;
    
    if(rounds > 3){
      gameEnded();
    }
  }

  // Game Ended
  const gameEnded = () => {
    if(players.player1.scores === players.player2.scores) {
      DOMController.gameEndedHandler();
      setTimeout(() => {
        DOMController.outcomeHandler('tie');
      }, 1000)
      return;
    }else {
      if(players.player1.scores > players.player2.scores) {
        setTimeout(() => {
          DOMController.outcomeHandler('p1-wins')
        }, 1000)
      }else{
        setTimeout(() => {
          DOMController.outcomeHandler('p2-wins')
        }, 1000)
      }
    }
    
    DOMController.gameEndedHandler();
  }

  // Managing Round (Next or Restart)
  const manageRound = (restartGame = false) => {
    if(restartGame) {
      rounds = 1;
      players.player1.scores = 0;
      players.player2.scores = 0;
      
    }else{
      if(rounds > 3) {
        return;
      }
    }
    
    reset();
  }

  const getCurrentRound = () => {
    return rounds;
  }

  // Edit Player
  const player1InputName = document.querySelector('#name1');
  const player2InputName = document.querySelector('#name2');

  const player1InputStatus = document.querySelectorAll('.menu .player-1 .player-status input');
  const player2InputStatus = document.querySelectorAll('.menu .player-2 .player-status input');

  const getPlayerStatus = () => {
    const p1 = {
      name: players.player1.name,
      isHuman: players.player1.isHuman
    }
    const p2 = {
      name: players.player2.name,
      isHuman: players.player2.isHuman
    }

    DOMController.playerDOMHandler(p1, p2);

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

      if(player === 'player2'){
        getPlayerStatus();
      }
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

        DOMController.addingMarker(x, y, currentMarker)

        if(gameLogic(x, y, currentMarker)){
          roundEnd();
        }else if(isItTie()){
          roundEnd();
        }else{
          switchPlayer();
        }

        return true;
      }else if(!round){
        return false;
      }
    },
    getScores: () => ({
        player1: players['player1'].scores,
        player2: players['player2'].scores
    }),
    manageRound: manageRound,
    getCurrentRound: getCurrentRound
  };
})();

const DOMController = (() => {
  const menu = document.querySelector('.menu');
  const alert = document.querySelector('.alert');
  const start = document.querySelector('.start');
  const nextButton = document.querySelector('.next-button');
  const restartButton = document.querySelector('.restart-button');
  const getAllGrid = document.querySelectorAll('.grid');
  const player1Marker = document.querySelector('.player1-section .player-marker');
  const player2Marker = document.querySelector('.player2-section .player-marker');
  const body = document.querySelector('body');
  const grids = document.querySelectorAll('.grid');

  const player1Life = document.querySelectorAll('.player1-section .player-life > div');
  const player2Life = document.querySelectorAll('.player2-section .player-life > div');
  const markerTemplate = document.querySelector('#marker').content;

  const roundText = document.querySelector('.hero .round');
  const gameContainer = document.querySelector('.game-container');

  const player1Name = document.querySelectorAll('.player1name');
  const player2Name = document.querySelectorAll('.player2name');
  const player1Status = document.querySelector('.player1-section .player-status');
  const player2Status = document.querySelector('.player2-section .player-status');
  const player1InputName = document.querySelector('#name1');
  const player2InputName = document.querySelector('#name2');

  const player1InputStatus = document.querySelectorAll('.menu .player-1 .player-status input');
  const player2InputStatus = document.querySelectorAll('.menu .player-2 .player-status input');

  // Get Grid and Grid Position
  const moveHandler = (e) => {
    const getGrid = e.target.closest('.game-container > div');
    const gridPosition = getGrid.dataset.grid;
    const [x, y] = gridPosition.split(',');
  
    move(x, y);
  }

  // Handle COM Move
  const ComMove = (random, randomIndex) => {
    const x = random[randomIndex][0];
    const y = random[randomIndex][1];

    setTimeout(() =>{
      gameContainer.style.pointerEvents = 'initial';
      GameBoard.move(x, y);
    }, 500)

    gameContainer.style.pointerEvents = 'none';
  }

  // Highlighting Grid
  function highlightGrids(highlighted) {
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

  // Life Handler
  const playerHealthHandler = (currentPlayer) => {
    if(currentPlayer === 'player1'){
      player2Life[GameBoard.getScores().player1 - 1].classList.add('loss')
    }else{
      player1Life[GameBoard.getScores().player2 - 1].classList.add('loss')
    }
  }

  // Round Outcome Handler
  const roundHandler = (status) => {
    gameContainer.parentElement.classList.add(status);
  }
  
  // Reset
  const reset = () => {
    roundText.textContent = GameBoard.getCurrentRound();
    nextButton.classList.remove('hidden');
    restartButton.classList.remove('restart');
    gameContainer.parentElement.classList.remove('winner', 'tie');
    grids.forEach(grid => {
      grid.classList.remove('highlighted', 'marked');
      grid.innerHTML = '';
    })
  }

  // Restart handler
  const restartHandler = () => {
    body.classList.remove('p1-wins', 'p2-wins', 'tie');

    player1Life.forEach(life => {
      life.classList.remove('loss');
    })
    player2Life.forEach(life => {
      life.classList.remove('loss');
    })
  }
  
  // Next Button Handler
  const next = (restart = false) => {
    if(restart){
      restartHandler();
    }
    GameBoard.manageRound(restart);
    
    reset();
  }

  // Adding Restart UI
  const gameEndedHandler = () => {
    nextButton.classList.add('hidden');
    restartButton.classList.add('restart');
  }

  // Game Outcome Handler
  const outcomeHandler = (className) => {
    body.classList.add(className)
  }

  // AppendMarker
  const appendMarker = (marker, getGrid, cloneMarker) => {
    if(!cloneMarker){
      cloneMarker = markerTemplate.cloneNode(true);
    }
    
    if(marker === '#'){
      cloneMarker.querySelector('.marker').classList.add('marker-1');
      getGrid.appendChild(cloneMarker);
    }
    else if(marker === '*'){
      cloneMarker.querySelector('.marker').classList.add('marker-2');
      getGrid.appendChild(cloneMarker);
    }
  }

  // Adding Marker
  const addingMarker = (x, y, marker) => {
    const dataset = x + ',' + y;
    let getGrid;

    grids.forEach(grid => {
      if(grid.dataset.grid === dataset){
        getGrid = grid;
      }
    });

    getGrid.innerHTML = '';

    appendMarker(marker, getGrid)
    getGrid.classList.add('marked');
  }
  
  // Hover Effects
  const showMarker = (e) => {
    const getGrid = e.target.closest('.game-container > div');
  
    if(getGrid.classList.contains('marked')){
      return;
    }
  
    const marker = GameBoard.playerInfo().marker;
    const cloneMarker = markerTemplate.cloneNode(true);
    cloneMarker.querySelector('.marker-wrapper').style.opacity = '.5';

    appendMarker(marker, getGrid, cloneMarker);
  }
  
  const removeMarker = (e) => {
    const getGrid = e.target.closest('.game-container > div');
    if(getGrid.classList.contains('marked')){
      return;
    }
    
    getGrid.innerHTML = '';
  }

  // Edit Player DOM
  const playerDOMHandler = (p1, p2) => {
    player1Name.forEach((name) => {
      name.textContent = p1.name;
    })
  
    player2Name.forEach((name) => {
      name.textContent = p2.name;
    })

    player1InputName.value = p1.name;
    player2InputName.value = p2.name;

    player1Status.textContent = p1.isHuman ? 'Human' : 'COM';
    player2Status.textContent = p2.isHuman ? 'Human' : 'COM';

    player1InputStatus.forEach((radio) =>{
      if(p1.isHuman.toString() === radio.value) {
        radio.checked = true;
      }
    })

    player2InputStatus.forEach((radio) =>{
      if(p2.isHuman.toString() === radio.value) {
        radio.checked = true;
      }
    })
  }

  // Set Player Marker Each Player Section
  const playerMarkerHandler = (player1, player2) => {
    if (player1Marker.childElementCount === 0) {
      const cloneMarker1 = markerTemplate.cloneNode(true);
      if(player1 === '#'){
        cloneMarker1.querySelector('.marker').classList.add('marker-1');
      } else {
        cloneMarker1.querySelector('.marker').classList.add('marker-2');
      }
      player1Marker.appendChild(cloneMarker1);
    }

    if (player2Marker.childElementCount === 0) {
      const cloneMarker2 = markerTemplate.cloneNode(true);
      if(player2 === '*'){
        cloneMarker2.querySelector('.marker').classList.add('marker-2');
      } else {
        cloneMarker2.querySelector('.marker').classList.add('marker-1');
      }
      player2Marker.appendChild(cloneMarker2);
    }
  }
  
  // Input Handler
  const getPlayerInfo = (playerNumber) => {
    const playerNameInput = document.querySelector(`#input-name-p${playerNumber}`);
    
    const playerRadio = document.querySelector(`.start .player-${playerNumber} input[type="radio"]:checked`);
  
    if (!playerRadio) {
      return null;
    }
  
    if(!playerNameInput.reportValidity()){
      return;
    }
  
    const playerName = playerNameInput.value;
  
    const playerMarker = document.querySelector(`.start .player-${playerNumber} .marker-wrapper.active`);
  
    if (!playerName || !playerMarker) {
      return null;
    }
    
    const playerStatus = playerRadio ? playerRadio.value === 'true' : false;
    const marker = playerMarker ? playerMarker.dataset.marker : '';
  
    return { playerName, playerStatus, marker };
  }
  
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
  
    GameBoard.player('player1', player1.marker, player1.playerStatus, player1.playerName);
    GameBoard.player('player2', player2.marker, player2.playerStatus, player2.playerName);

    playerMarkerHandler(player1.marker, player2.marker)
  
    start.classList.add('hide');

    roundText.textContent = GameBoard.getCurrentRound();
  }
  
  // Click
  document.addEventListener('click', (e) => {
    const target = e.target;
    if(target.closest('.game-container > div')){
      moveHandler(e);
    }else if(target.closest('.menu-button') || target.closest('.menu .close-button')) {
      menu.classList.toggle('show');
    }else if(target.closest('.next-button')) {
      next();
    }else if(target.closest('.restart-button')) {
      next(true);
      menu.classList.remove('show');
    }else if(target.closest('.settings-button') || target.closest('.close-settings')) {
      menu.classList.toggle('settings');
    }else if(target.closest('.begin .start-button')){
      startGame();
    }else if(target.closest('.start-button')) {
      start.classList.add('begin')
    }else if(target.closest('.start .human-button') || target.closest('.start .com-button')){
      const player = target.closest('.player-1, .player-2');
  
      player.classList.add('status');
    }else if(target.closest('.start .marker-select .marker-wrapper')){
      const player = target.closest('.player-1, .player-2');
  
      const playerMarker = player.querySelectorAll('.marker-wrapper');
      playerMarker.forEach(marker => {
        marker.classList.remove('active');
        marker.classList.add('hide');
      })
      target.closest('.marker-wrapper').classList.add('active');
      target.closest('.marker-wrapper').classList.remove('hide');
    }else if(target.closest('.start .back-button')){
      const player = target.closest('.player-1, .player-2');
      player.classList.remove('status');
      const playerMarker = player.querySelectorAll('.marker-wrapper');
      playerMarker.forEach(marker => {
        marker.classList.remove('active');
        marker.classList.remove('hide');
      })
    }else if(target.closest('.alert .close-button')){
      alert.classList.remove('trigger');
    }
  })
  
  // Hover Effects
  grids.forEach(grid => {
    grid.addEventListener('mouseenter', (e) => {
      showMarker(e);
    })
  
    grid.addEventListener('mouseleave', (e) => {
      removeMarker(e);
    })
  })

  return {
    highlightGrids,
    addingMarker,
    gameEndedHandler,
    outcomeHandler,
    playerHealthHandler,
    roundHandler,
    ComMove,
    playerDOMHandler
  }
})()

const move = (x, y) => {
  if(GameBoard.playerInfo().isHuman){
    GameBoard.move(x, y);
  }
}