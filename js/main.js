let player = {};
let gameConstants = {};

function initProduction(productionType) {
  let product = player.mount.production[productionType] = {};
  product.unlocked = false;
  product.quantity = 0;
  product.maxSize = 0;
  product.pool = [];
  product.progress = 0;
  product.target = 1000;
}

function init() {
  gameConstants.mainLoopInterval = 100;
  gameConstants.stats = ["Strength", "Stamina", "Agility"]
  gameConstants.numberOfStats = gameConstants.stats.length;
  gameConstants.baseFood = 4;
  gameConstants.exploreString = "explore";
  let baseMaleCritter = new Critter([10, 10 ,10]);
  let baseFemaleCritter = new Critter([10, 10 ,10]);
  
  player.version = "0.01"
  
  player.breed = {};
  player.breed.time = Date.now();
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
  player.mount.time = Date.now();
  player.mount.unlocked = false;
  player.mount.building = {};
  player.mount.building.purchased = new Set([]);
  player.mount.production = {};
  initProduction("food");
  initProduction("dirt");
  initProduction("wood");
  initProduction("stone");
  
  player.mount.production.food.quantity = 4;

  
  player.upgrade = {};
  player.upgrade.rna = 10;
  player.upgrade.dna = 10;
  player.upgrade.purchased = new Set([]);
  
  player.explore = {};
  player.explore.time = Date.now();
  player.explore.pool = [];
  player.explore.maxPoolSize = 0;
  player.explore.unlocked = false;
  player.explore.activeMap = [];
  player.explore.sizeX = 0;
  player.explore.sizeY = 0;
  player.explore.difficulty = 0;
  player.explore.availableDifficulties = [1,2,3,4,5];
  player.explore.currentProgress = 0;
  player.explore.targetProgress = 5000;
  
  player.battle = {};
  player.battle.difficulty = 0;
  player.battle.sizeX = 0;
  player.battle.sizeY = 0;
  player.battle.unlocked = false;
  
  player.selectors = {};
  player.selectors.malePool = {};
  player.selectors.femalePool = {};
  
  initUpgrades();
  initMount();
  
  displayInitTabs();
  displayInitHatchery();
  updateUpgradeScreen();
  updateMountScreen();
}

function save() {
  const playerString = JSON.stringify(player);
  const upgradeSetString = JSON.stringify(Array.from(player.upgrade.purchased));
  const buildingSetString = JSON.stringify(Array.from(player.mount.building.purchased));
  localStorage.setItem('playerData', playerString);
  localStorage.setItem('upgradeData', upgradeSetString);
  localStorage.setItem('buildingData', buildingSetString);
}

function load() {
  const playerString = localStorage.getItem('playerData');
  player = JSON.parse(playerString);
  player.time = Date.now(); // For now no offline progress
  
  const upgradeSetArray = JSON.parse(localStorage.getItem('upgradeData'));
  player.upgrade.purchased = new Set(upgradeSetArray);
  
  const buildingSetArray = JSON.parse(localStorage.getItem('buildingData'));
  player.mount.building.purchased = new Set(buildingSetArray);
  
  updateUpgradePurchasedFromPlayer();
  updateBuildingPurchasedFromPlayer();
  updateBreederDisplay();
  updatePoolDisplay();
  fullUpdateExploreScreen();
}

function breedLoop() {
  let now = Date.now();
  let diff = (now - player.breed.time);
  player.breed.time = now;
  
  progressBreed(diff);
  updateBreedProgress();
  
  setTimeout(breedLoop, gameConstants.mainLoopInterval);
};

function productionLoop() {
  let now = Date.now();
  let diff = (now - player.mount.time);
  player.mount.time = now;
  
  progressProduction(diff);
  updateMountScreen();
  
  setTimeout(productionLoop, gameConstants.mainLoopInterval);
}

function exploreAndBattleLoop() {
  let now = Date.now();
  let diff = (now - player.explore.time);
  player.explore.time = now;
  
  progressExplore(diff);
  
  setTimeout(exploreAndBattleLoop, gameConstants.mainLoopInterval);
  
}

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
  breedLoop();
  productionLoop();
  exploreAndBattleLoop();
}


$(document).ready(start);


