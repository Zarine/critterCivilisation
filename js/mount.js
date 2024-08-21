const buildings = [];
const buildingCostMapping = [];

class Building {
  constructor(name, id, cost, available) {
    this.name = name;
    this.id = id;
    this.available = available;
    this.cost = cost;
    this.purchased = false;
    this.check = {};
    this.check.purchased = false;
    this.check.available = false;
    this.check.canBuy = false;
  }
  
  canBuy() {
    return getResourceQuantity("dirt") >= this.cost[0] 
          && getResourceQuantity("wood") >= this.cost[1]
          && getResourceQuantity("stone") >= this.cost[2]; 
  }
  
  hasChanged() {
    let result = false;
    result |= (this.check.purchased != this.purchased);
    this.check.purchased = this.purchased;
    
    let currentAvailable = this.available();
    result |= (this.check.available != currentAvailable);
    this.check.available = currentAvailable;
    
    let currentCanBuy = this.canBuy();
    result |= (this.check.canBuy != this.canBuy());
    this.check.canBuy = currentCanBuy;
    
    return result;
  }
}

function initMount() {
  buildingCostMapping.push("Dirt");
  buildingCostMapping.push("Wood");
  buildingCostMapping.push("Stone");
  
  buildings.push(new Building("Dirt Area", "b01", [0,0,0], function() { return true; }));
  buildings.push(new Building("Farm", "b02", [10,0,0], function() { return hasBuilding("b01"); }));
}

function hasBuildingListChanged() {
  let result = false;
  buildings.forEach(building => {
    if(building.hasChanged()) result = true;
  });
  return result;
}

function updateMountScreen() {
  updateMountResources();
  updateBuildingList();
  updatePurchasedBuildings();
  updateProductionProgress();
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
  
  getResource("dirt").quantity -= building.cost[0];
  getResource("wood").quantity -= building.cost[1];
  getResource("stone").quantity -= building.cost[2];
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
    getResource("food").quantity = 6;
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

function getResource(type) {
  return player.mount.production[type];
}

function getResourceQuantity(type) {
  return player.mount.production[type].quantity;
}

function progressProduction(diff) {
  
  calculateDirtProgress(diff);
  updateResource(getResource("dirt"));
}

function calculateDirtProgress(diff) {
  let dirt = getResource("dirt");
  let dirtPower = dirt.pool.reduce((acc, obj) => acc + obj.dirtProduction(), 0);
  dirt.progress += (diff * dirtPower / 1000);
}

function updateResource(resource) {
  if(resource.progress > resource.target) {
    let quantity = Math.floor(resource.progress / resource.target)
    resource.quantity += quantity;
    resource.progress = resource.progress % resource.target;
  }
}