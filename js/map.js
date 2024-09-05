class MapTile {
  constructor(difficulty, special, discovered, scouted, posX, posY) {
    this.discovered = discovered;
    this.scouted = scouted;
    this.difficulty = difficulty;
    this.x = posX;
    this.y = posY;
    if(isEmpty(special)) {
      this.isSpecial = true;
      this.special = special;
    }
    else {
      this.isSpecial = false;
    }
  }
}

function initMap(sizeX, sizeY, difficulty) {
  player.explore.activeMap = [];
  player.explore.sizeX = sizeX;
  player.explore.sizeY = sizeY;
  
  let startingSpot = getStartingPosition(sizeX, sizeY);
  let targetSpot = getTargetSpot(sizeX, sizeY, startingSpot);
  
  for(let i = 0; i < sizeY; i++) {
    let line = [];
    for(let j = 0; j < sizeX; j++) {
      let special = getSpecial(j, i, startingSpot, targetSpot);
      let state = getState(j, i, startingSpot);
      let tileDifficulty = getDifficulty(j, i, startingSpot, targetSpot, difficulty);
      if(isEmpty(special)) {
        tileDifficulty += special.additionalDifficulty;
      }
      line.push(new MapTile(tileDifficulty, special, state.discovered, state.scouted, j, i))
    }
    player.explore.activeMap.push(line);
  }
  fullUpdateExploreScreen();
}

function getSpecial(posX, posY, startingSpot, targetSpot) {
  let special = {};
  if(startingSpot.x == posX && startingSpot.y == posY) {
    special.id = "start";
    special.additionalDifficulty = 0;
    return special;
  }
  if(targetSpot.x == posX && targetSpot.y == posY) {
    special.id = "target";
    special.additionalDifficulty = 2;
    return special;
  }
  return special;
}

function getState(posX, posY, startingSpot) {
  let state = { discovered: false, scouted: false };
  if(startingSpot.x == posX && startingSpot.y == posY)
  {
    state = { discovered: true, scouted: true };
  }
  else if(calculateDistance({ x: posX, y: posY }, startingSpot) == 1) {
    state = { discovered: true, scouted: false };
  }
  
  return state;
}

function getStartingPosition(sizeX, sizeY) {
  let startingArea = getRandomArbitraryInt(0,3);
  let position = {};
  position.area = startingArea;
  setAreaPosition(sizeX, sizeY, position);
  return position;
}

function getTargetSpot(sizeX, sizeY, startingPosition) {
  let position = {};
  position.area = 3 - startingPosition.area;
  
  setAreaPosition(sizeX, sizeY, position);
  return position;
}

function setAreaPosition(sizeX, sizeY, position) {
  let rangeX = getRange(sizeX);
  let rangeY = getRange(sizeY);
  
  switch(position.area) {
    case 0:
      position.x = 1 + getRandomArbitraryInt(0,rangeX);
      position.y = 1 + getRandomArbitraryInt(0,rangeY);
      break;
    case 1:
      position.x = sizeX - 2 - getRandomArbitraryInt(0,rangeX);
      position.y = 1 + getRandomArbitraryInt(0,rangeY);
      break;
    case 2:
      position.x = 1 + getRandomArbitraryInt(0,rangeX);
      position.y = sizeY - 2 - getRandomArbitraryInt(0,rangeY);
      break;
    case 3:
      position.x = sizeX - 2 - getRandomArbitraryInt(0,rangeX);
      position.y = sizeY - 2 - getRandomArbitraryInt(0,rangeY);
      break;
  }
}

function getRange(size) {
  return 2 * Math.log2(size/5);
}

function getDifficulty(posX, posY, startingSpot, targetSpot, difficulty) {
  let DistanceToStart = calculateDistance({ x: posX, y: posY }, startingSpot);
  let DistanceToTarget = calculateDistance({ x: posX, y: posY }, targetSpot);
  let maxValue = difficulty * 10;
  let minValue = maxValue - 10;
  return Math.floor(minValue + (maxValue - minValue) * (DistanceToStart / (DistanceToTarget + DistanceToStart))) + getRandomArbitraryInt(-1,2);
}

function fullUpdateExploreScreen() {
  updateExploreLeftScreen();
  displayMap();
}

function addCritterToExplore(critter) {
  if(betterThanPool(critter, gameConstants.exploreString, player.explore.pool, player.explore.maxPoolSize)) {
    addToExplorePool(critter);
  }    

  updateExploreLeftScreen();
}

function addToExplorePool(newCritter) {
  addToPool(newCritter, gameConstants.exploreString, player.explore.pool, player.explore.maxPoolSize);
}

function selectDifficulty() {
  let selectedValue = $('#difficultySelect').val();
  player.explore.difficulty = selectedValue;
  initMap(10, 10, selectedValue);
}

function progressExplore(diff) {
  
  calculateExploreProgress(diff);
  updateExploration();
}

function calculateExploreProgress(diff) {
  let power = player.explore.pool.reduce((acc, obj) => acc + obj.production("explore"), 0);
  player.explore.currentProgress += (diff * power / 1000);
}

function updateExploration() {
  if(player.explore.currentProgress < player.explore.targetProgress) {
    return;    
  }
  let flatMap = player.explore.activeMap.flat();
  let discoveredUnscoutedTiles = flatMap.filter(tile => (tile.discovered === true && tile.scouted === false));
  if(discoveredUnscoutedTiles.length === 0) {
    return;
  }
  let randomIndex = Math.floor(Math.random() * discoveredUnscoutedTiles.length);
  player.explore.currentProgress = 0;
  discoveredUnscoutedTiles[randomIndex].scouted = true;
  fullUpdateExploreScreen();
}

function updateBattleWon(posX, posY) {
  if(posX > 0) {
    player.explore.activeMap[posY][posX - 1].discovered = true
  }
  if(posY > 0) {
    player.explore.activeMap[posY - 1][posX].discovered = true
  }
  if(posX < player.explore.sizeX - 1) {
    player.explore.activeMap[posY][posX + 1].discovered = true
  }
  if(posY < player.explore.sizeY - 1) {
    player.explore.activeMap[posY + 1][posX].discovered = true
  }
  fullUpdateExploreScreen();
}