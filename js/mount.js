const buildings = [];
const buildingCostMapping = [];

class Building {
  constructor(name, id, cost, available) {
    this.name = name;
    this.id = id;
    this.available = available;
    this.cost = cost;
    this.purchased = false;
    this.canBuy = (function () { return player.mount.resources.wood >= this.cost[0] && player.mount.resources.stone >= this.cost[1]; });
  }
}

function initMount() {
  buildingCostMapping.push("Wood");
  buildingCostMapping.push("Stone");
  
  buildings.push(new Upgrade("Farm", "b01", [0,0], function() { return true; }));
}

function getBuilding(id) {
  return buildings.find(obj => obj.id === id);
}

function buyBuilding(id) {
  let building = getBuilding(id);
  if(!building) return;
  if(!building.available()) return;
  if(building.purchased) return;
  if(building.cost[0] > player.mount.resources.wood && building.cost[1] > player.mount.resources.stone) return;
  
  player.mount.resources.wood -= building.cost[0];
  player.mount.resources.stone -= building.cost[1];
  building.purchased = true;
  player.mount.building.purchased.add(building.id);

  applyBuildingEffect();
  updateBuildingList();
}

function updateBuildingPurchasedFromPlayer() {
  buildings.forEach((building) => {
    if(!player.mount.building.purchased(building.id)) return;
    building.purchased = true;
  });

  applyBuildingEffect();
  updateBuildingList();
  displayInitTabs();
}

function hasBuilding(id) {
  return player.mount.building.purchased.has(id);
}

function applyBuildingEffect() {
  if(hasBuilding("b01")) {
    player.mount.resources.food = 6;
  }
}