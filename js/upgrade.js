const upgrades = [];
const upgradeCostMapping = [];

class Upgrade {
  constructor(name, id, cost, available) {
    this.name = name;
    this.id = id;
    this.available = available;
    this.cost = cost;
    this.purchased = false;
    this.canBuy = (function () { return player.upgrade.rna >= this.cost[0] && player.upgrade.dna >= this.cost[1]; });
  }
}

function initUpgrades() {
  upgradeCostMapping.push("RNA");
  upgradeCostMapping.push("DNA");
  
  upgrades.push(new Upgrade("Mount", "u01", [2,1], function() { return player.upgrade.rna > 0; }));
}

function updateUpgradeScreen() {
  updateUpgradeResources();
  updateUpgradeList();
}

function addUpgradeResources(rna, dna) {
  player.upgrade.rna += rna;
  player.upgrade.dna += dna;
  updateUpgradeScreen();
}

function getUpgrade(id) {
  return upgrades.find(obj => obj.id === id);
}

function buyUpgrade(id) {
  let upgrade = getUpgrade(id);
  if(!upgrade) return;
  if(!upgrade.available()) return;
  if(upgrade.purchased) return;
  if(!upgrade.canBuy()) return;
  
  player.upgrade.rna -= upgrade.cost[0];
  player.upgrade.dna -= upgrade.cost[1];
  upgrade.purchased = true;
  player.upgrade.purchased.add(upgrade.id);

  applyUpgradeEffect();
  updateUpgradeScreen();
}

function updateUpgradePurchasedFromPlayer() {
  upgrades.forEach((upgrade) => {
    if(!player.upgrade.purchased.has(upgrade.id)) return;
    upgrade.purchased = true;
  });
  applyUpgradeEffect();
  updateUpgradeScreen();
  displayInitTabs();
}

function hasUpgrade(id) {
  return player.upgrade.purchased.has(id);
}

function applyUpgradeEffect() {
  if(hasUpgrade("u01")) { 
    player.mount.unlocked = true;
    displayInitTabs();
  }
}