const upgrades = [];
const costMapping = [];

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

function addUpgradeResources(rna, dna) {
  player.upgrade.rna += rna;
  player.upgrade.dna += dna;
  updateUpgradeResources();
  updateUpgradeList();
}

function initUpgrades() {
  costMapping.push("RNA");
  costMapping.push("DNA");
  
  upgrades.push(new Upgrade("Mount", "u01", [2,0], function() { return player.upgrade.rna > 0; }));
}

function buyUpgrade(index) {
  let upgrade = upgrades[index];
  if(!upgrade.available()) return;
  if(upgrade.purchased) return;
  if(upgrade.cost[0] > player.upgrade.rna && upgrade.cost[1] > player.upgrade.dna) return;
  
  player.upgrade.rna -= upgrade.cost[0];
  player.upgrade.dna -= upgrade.cost[1];
  upgrade.purchased = true;
  player.upgrade.purchased.add(upgrade.id);
  
  applyUpgradeEffect();
  updateUpgradeResources();
  updateUpgradeList();
  displayInitTabs();
}

function updateUpgradePurchasedFromPlayer() {
  upgrades.forEach((upgrade) => {
    if(!player.upgrade.purchased.has(upgrade.id)) return;
    upgrade.purchased = true;
  });
  applyUpgradeEffect();
  updateUpgradeList();
  displayInitTabs();
}

function applyUpgradeEffect() {
  if(player.upgrade.purchased.has("u01")) player.mount.unlocked = true;
}