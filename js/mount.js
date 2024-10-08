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
  buildings.push(new Building("Scout Tower", "b03", [10,0,0], function() { return hasBuilding("b02"); }));
  buildings.push(new Building("Barrack", "b04", [10,0,0], function() { return hasBuilding("b02"); }));
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
  if(hasBuilding("b03")) {
    player.explore.unlocked = true;
    player.explore.maxPoolSize = 1;
    fullUpdateExploreScreen();
  }
  if(hasBuilding("b04")) {
    player.battle.unlocked = true;
  }
  displayInitTabs();
}

function updateFood() {
  let food = getResource("food");
  let foodCalculation = gameConstants.baseFood;
  
  let foodFromFarm = 0;
  food.pool.forEach(critter => {
    foodFromFarm += critter.production("food");
  });
  foodCalculation += Math.sqrt(foodFromFarm);
  
  if(hasBuilding("b02")) {
    foodCalculation += 1;
  }
  food.quantity = Math.floor(foodCalculation);
  
}

function addCritterToProduction(critter) {
  
  let assigned = false;
  resourceMapping.forEach(resourceName => {
    if(assigned) return;
    if(betterThanResourcePool(critter, resourceName)) {
      addToMountPool(critter, resourceName);
      assigned = true;
    }
  })

  updateMountScreen();
}

function betterThanResourcePool(newCritter, type) {
  let resource = getResource(type);
  return betterThanPool(newCritter, type, resource.pool, resource.maxSize);
}

function addToMountPool(newCritter, type) {
  let resource = getResource(type);
  addToPool(newCritter, type, resource.pool, resource.maxSize);
}

function getResource(type) {
  return player.mount.production[type];
}

function getResourceQuantity(type) {
  return player.mount.production[type].quantity;
}

function progressProduction(diff) {
  
  calculateResourceProgress(diff, "dirt");
  updateResource(getResource("dirt"));
}

function calculateResourceProgress(diff, type) {
  let resource = getResource(type);
  let power = resource.pool.reduce((acc, obj) => acc + obj.production(type), 0);
  resource.progress += (diff * power / 1000);
}

function updateResource(resource) {
  if(resource.progress > resource.target) {
    let quantity = Math.floor(resource.progress / resource.target)
    resource.quantity += quantity;
    resource.progress = resource.progress % resource.target;
  }
}