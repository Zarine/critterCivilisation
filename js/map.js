class MapTile {
  constructor(difficulty, special) {
    this.discovered = false;
    this.scouted = false;
    this.difficulty = difficulty;
    if(special) {
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
  
  let startingSpot = getStartingPosition(sizeX, sizeY);
  
  for(let i = 0; i < sizeY; i++) {
    let line = [];
    for(let j = 0; j < sizeX; j++) {
      let special = getSpecial(j, i, startingSpot);
      line.push(new MapTile(difficulty, special))
    }
    player.explore.activeMap.push(line);
  }
  fullUpdateExploreScreen();
}

function getSpecial(posX, posY, startingSpot) {
  let special = {};
  if(startingSpot.x == posX && startingSpot.y == posY) {
    special.id = "start";
    special.additionalDifficulty = 0;
    return special;
  }
  return undefined;
}

function getStartingPosition(sizeX, sizeY) {
  let startingArea = getRandomArbitraryInt(0,3);
  let position = {};
  let rangeX = getRange(sizeX);
  let rangeY = getRange(sizeY);
  
  switch(startingArea) {
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
  return position;
}

function getRange(size) {
  return 2 * Math.log2(size/5);
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
}

