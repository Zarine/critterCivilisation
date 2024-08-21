const buildings = [];
const resourceMapping = ["food", "dirt", "wood", "stone"];
const buildingCostMapping = resourceMapping.slice(1);


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
    let result = true;
    this.cost.forEach((value, index) => {
      if(value > getResourceQuantity(buildingCostMapping[index])) result = false;
    });
    return result;
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
  updateFood();
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
  
  building.cost.forEach((cost, index) => {
    getResource(buildingCostMapping[index]).quantity -= cost;
  });
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
    let dirt = getResource("dirt");
    dirt.unlocked = true;
    dirt.maxSize = 1;
    displayArea("dirtProduction");
    displayArea("maleToProd");
    displayArea("femaleToProd");
  }
  if(hasBuilding("b02")) {
    let food = getResource("food");
    food.unlocked = true;
    food.maxSize = 1;
    displayArea("foodProduction");
  }
}

function updateFood() {
  let food = getResource("food");
  food.quantity = 4;
  food.pool.forEach(critter => {
    food.quantity += critter.production("food");
  });
  food.quantity = Math.floor(food.quantity);
  
}

function addCritterToProduction(critter) {
  
  let assigned = false;
  resourceMapping.forEach(resourceName => {
    if(assigned) return;
    if(betterThanPool(critter, resourceName)) {
      addToMountPool(critter, resourceName);
      assigned = true;
    }
  })

  updateMountScreen();
}

function betterThanPool(newCritter, type) {
  let resource = getResource(type);
  if(resource.pool.length < resource.maxSize) return true;
  for(let i = 0 ; i < resource.pool.length; i++) {
    let oldCritter = resource.pool[i];
    if(betterThanCritter(oldCritter, newCritter, type)) return true;
  }
  return false;
}

function betterThanCritter(oldCritter, newCritter, type) {
  if(oldCritter.production(type) < newCritter.production(type)) return true;
  return false;
}

function addToMountPool(newCritter, type) {
  let resource = getResource(type);
  if(resource.pool.length < resource.maxSize) {
    resource.pool.push(newCritter);
    return;
  }
  for(let i = 0 ; i < resource.pool.length; i++) {
    let oldCritter = resource.pool[i];
    if(betterThanCritter(oldCritter, newCritter, type)) oldCritter.update(newCritter.stats);
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