const buildings = [];
const buildingCostMapping = [];

class Building {
  constructor(name, id, cost, available) {
    this.name = name;
    this.id = id;
    this.available = available;
    this.cost = cost;
    this.purchased = false;
    this.canBuy = (function () { 
      return player.mount.resources.dirt >= this.cost[0] 
          && player.mount.resources.wood >= this.cost[1]
          && player.mount.resources.stone >= this.cost[2]; 
    });
  }
}

function initMount() {
  buildingCostMapping.push("Dirt");
  buildingCostMapping.push("Wood");
  buildingCostMapping.push("Stone");
  
  buildings.push(new Building("Dirt Area", "b01", [0,0,0], function() { return true; }));
  buildings.push(new Building("Farm", "b02", [10,0,0], function() { return hasBuilding("b01"); }));
}

function updateMountScreen() {
  updateMountResources();
  updateBuildingList();
  updatePurchasedBuildings();
  updateEntireProductions();
}

function getBuilding(id) {
  return buildings.find(obj => obj.id === id);
}

function hasBuilding(id) {
  return player.mount.building.purchased.has(id);
}

function buyBuilding(id) {
  let building = getBuilding(id);
  if(!building) return;
  if(!building.available()) return;
  if(building.purchased) return;
  if(!building.canBuy()) return;
  
  player.mount.resources.wood -= building.cost[0];
  player.mount.resources.stone -= building.cost[1];
  building.purchased = true;
  player.mount.building.purchased.add(building.id);

  applyBuildingEffect();
  updateMountScreen();
}

function updateBuildingPurchasedFromPlayer() {
  buildings.forEach((building) => {
    if(!player.mount.building.purchased(building.id)) return;
    building.purchased = true;
  });

  applyBuildingEffect();
  updateMountScreen();
  displayInitTabs();
}

function hasBuilding(id) {
  return player.mount.building.purchased.has(id);
}

function applyBuildingEffect() {
  if(hasBuilding("b01")) {
    player.mount.production.dirt.unlocked = true;
    player.mount.production.dirt.maxSize = 1;
    displayArea("dirtProduction");
    displayArea("maleToProd");
    displayArea("femaleToProd");
  }
  if(hasBuilding("b02")) {
    player.mount.resources.food = 6;
  }
}

function addCritterToProduction(critter) {
  
  if(betterThanDirtPool(critter))
  {
    addToDirtPool(critter);
  }
  
  updateMountScreen();
}

function betterThanDirtPool(newCritter) {
  if(player.mount.production.dirt.pool.length < player.mount.production.dirt.maxSize) return true;
  for(let i = 0 ; i < player.mount.production.dirt.pool.length; i++) {
    let oldCritter = player.mount.production.dirt.pool[i];
    if(betterThanDirtCritter(oldCritter, newCritter)) return true;
  }
  return false;
}

function betterThanDirtCritter(oldCritter, newCritter) {
  if(oldCritter.dirtProduction() < newCritter.dirtProduction()) return true;
  return false;
}

function addToDirtPool(newCritter) {
  if(player.mount.production.dirt.pool.length < player.mount.production.dirt.maxSize) {
    player.mount.production.dirt.pool.push(newCritter);
    return;
  }
  for(let i = 0 ; i < player.mount.production.dirt.pool.length; i++) {
    let oldCritter = player.mount.production.dirt.pool[i];
    if(betterThanDirtCritter(oldCritter, newCritter)) oldCritter.update(newCritter.stats);
  }
}

function progressProduction(diff) {
  
  calculateDirtProgress(diff);
  if(player.mount.production.dirt.progress > player.mount.production.dirt.target) {
    let quantity = Math.floor(player.mount.production.dirt.progress / player.mount.production.dirt.target)
    player.mount.resources.dirt += quantity;
    player.mount.production.dirt.progress = player.mount.production.dirt.progress % player.mount.production.dirt.target;
  }
}

function calculateDirtProgress(diff) {
  let dirtPower = player.mount.production.dirt.pool.reduce((acc, obj) => acc + obj.dirtProduction(), 0);
  player.mount.production.dirt.progress += (diff * dirtPower / 1000);
}