let player = {};
let gameConstants = {};

function init() {
  gameConstants.mainLoopInterval = 100;
  gameConstants.stats = ["Strength", "Stamina", "Agility"]
  gameConstants.numberOfStats = gameConstants.stats.length;
  let baseMaleCritter = new Critter([10, 10 ,10]);
  let baseFemaleCritter = new Critter([10, 10 ,10]);
  
  player.version = "0.01"
  
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
  
  player.mount = {};
  player.mount.unlocked = false;
  player.mount.resources = {};
  player.mount.resources.food = 100;
  
  player.upgrade = {};
  player.upgrade.rna = 0;
  player.upgrade.dna = 0;
  player.upgrade.purchased = new Set([]);
  
  player.selectors = {};
  player.selectors.malePool = {};
  player.selectors.femalePool = {};
  
  player.time = Date.now();
  
  initUpgrades();
  updateUpgradeList();
  displayInitTabs();
  displayInitHatchery();
}

function save() {
  const playerString = JSON.stringify(player);
  const upgradeSetString = JSON.stringify(Array.from(player.upgrade.purchased));
  localStorage.setItem('playerData', playerString);
  localStorage.setItem('upgradeData', upgradeSetString);
}

function load() {
  const playerString = localStorage.getItem('playerData');
  player = JSON.parse(playerString);
  player.time = Date.now(); // For now no offline progress
  
  const upgradeSetArray = JSON.parse(localStorage.getItem('upgradeData'));
  player.upgrade.purchased = new Set(upgradeSetArray);
  
  updateUpgradePurchasedFromPlayer();
  updateBreederDisplay();
  updatePoolDisplay();
}

function BreedLoop() {
  let now = Date.now();
  let diff = (now - player.time);
  player.time = now;
  
  progressBreed(diff);
  updateBreedProgress();
  
  setTimeout(BreedLoop, gameConstants.mainLoopInterval);
};

function progressBreed(diff) {
  player.breed.currentProgress += diff;
  if(!breedPossible()) {
    player.breed.currentProgress = Math.min(player.breed.targetProgress, player.breed.currentProgress);
    return;
  }
  if(player.breed.currentProgress >= player.breed.targetProgress) {
    breed();
    player.breed.currentProgress -= player.breed.targetProgress
  }
}

function start() {
  init();
  updateBreederDisplay();
  BreedLoop();
}


$(document).ready(start);


