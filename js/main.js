const player = {};
const gameConstants = {};

function init() {
  gameConstants.mainLoopInterval = 100;
  gameConstants.stats = ["Strength", "Stamina", "Agility"]
  gameConstants.numberOfStats = gameConstants.stats.length;
  const baseMaleCritter = new Critter([10, 5 ,8]);
  const baseFemaleCritter = new Critter([10, 5 ,8]);
  
  player.breed = {};
  player.breed.male = baseMaleCritter;
  player.breed.female = baseFemaleCritter;
  player.breed.maxFactor = 1.1;
  player.breed.minFactor = 0.9;
  player.breed.currentProgress = 0;
  player.breed.targetProgress = 5000;
  player.breed.malePool = [];
  player.breed.femalePool = [];
  player.breed.maxPoolSize = 2;
  player.time = Date.now();
  
  displayInit();
}

function BreedLoop() {
  let now = Date.now();
  let diff = (now - player.time);
  player.time = now;
  
  player.breed.currentProgress += diff;
  if(player.breed.currentProgress >= player.breed.targetProgress && breedPossible()) {
    breed();
    player.breed.currentProgress -= player.breed.targetProgress
  }
  updateBreedProgress()
  
  setTimeout(BreedLoop, gameConstants.mainLoopInterval);
};

function start() {
  init();
  updateBreederDisplay();
  BreedLoop();
}


$(document).ready(start);


