
class Critter {
  constructor(stats) {
    for(let i = 0; i < stats.length; i++) {
      stats[i] = Math.max(stats[i], 6); //To avoid locked stat at 5 because of formula, min is 6
    }
    this.stats = stats;
    this.score = this.calculateScore();
    
    if(stats.length > gameConstants.numberOfStats) console.warn("Too many stats for critter");
  }
  
  update(newStats) {
    this.stats = newStats;
    this.score = this.calculateScore();
  }
  
  calculateScore() {
    if (this.stats.length == 0) {
      return 0;
    }
    const sum = this.stats.reduce((acc, val) => acc + val, 0);
    return sum / this.stats.length;
  }
  
  dirtProduction() {
    return this.stats[0] + this.stats[1];
  }
  
  production(type) {
    switch (type) {
      case "dirt":
        return this.stats[0] + this.stats[1];
      case "food":
        return (0.5 * this.stats[1] + 1.5 * this.stats[2]) / 10;
      default:
        return this.score;
    }
  }
}

function breedPossible() {
  let freeMaleSpot = player.breed.malePool.length < player.breed.maxPoolSize;
  let freeFemaleSpot = player.breed.femalePool.length < player.breed.maxPoolSize;
  let foodAvailable = getTotalCritter() < getResourceQuantity("food");
  return foodAvailable && (freeMaleSpot || freeFemaleSpot);
}

function breed() {
  let maleStats = player.breed.male.stats;
  let femaleStats = player.breed.female.stats;
  
  let babyStats = [];
  for(let i = 0; i < gameConstants.numberOfStats; i++) {
    let min = Math.min(maleStats[i], femaleStats[i]);
    let max = Math.max(maleStats[i], femaleStats[i]);
    let babyStat = getRandomArbitraryInt(min * player.breed.minFactor, max * player.breed.maxFactor);
    babyStats.push(babyStat);
  }

  const newCritter = new Critter(babyStats);
  addToPool(newCritter);
};

function promoteMale() {
  if(player.breed.malePool.length == 0) return;
  let critterIndex = player.selectors.malePool.index ? player.selectors.malePool.index : 0;
  player.selectors.malePool = {};
  
  promote(player.breed.malePool, critterIndex, player.breed.male)
}

function promoteFemale() {
  if(player.breed.femalePool.length == 0) return;
  let critterIndex = player.selectors.femalePool.index ? player.selectors.femalePool.index : 0;
  player.selectors.femalePool = {};
  
  promote(player.breed.femalePool, critterIndex, player.breed.female)
}

function promote(pool, index, breeder) {
  let promoted = pool[index];
  breeder.update(promoted.stats);
  
  pool.splice(index, 1);
  
  updateBreederDisplay();
  updatePoolDisplay();
}


function trashMale() {
  if(player.breed.malePool.length == 0) return;
  trash(player.breed.malePool, player.selectors.malePool)
}

function trashFemale() {
  if(player.breed.femalePool.length == 0) return;
  trash(player.breed.femalePool, player.selectors.femalePool)
}

function trash(pool, selector) {
  let critterIndex = selector.index ? selector.index : 0;
  let trashedScore = pool[critterIndex].score;
  pool.splice(critterIndex, 1);
  selector.index = undefined
  
  addUpgradeResources(trashedScore / 10, 0);
  
  updatePoolDisplay();
}



function addToPool(critter) {
  let malePossible = player.breed.malePool.length < player.breed.maxPoolSize;
  let femalePossible = player.breed.femalePool.length < player.breed.maxPoolSize;
  
  if(!malePossible && !femalePossible) return;
  
  let pool;
  if(malePossible && (!femalePossible || Math.random() < 0.5)) {
    pool = player.breed.malePool;
  }
  else {
    pool = player.breed.femalePool;
  }
    
  pool.push(critter);
  updateMountResources();
  updatePoolDisplay();
}

function productionMale() {
  if(player.breed.malePool.length == 0) return;
  let critterIndex = player.selectors.malePool.index ? player.selectors.malePool.index : 0;
  player.selectors.malePool = {};
  
  toProduction(player.breed.malePool, critterIndex, player.breed.male)
}

function productionFemale() {
  if(player.breed.femalePool.length == 0) return;
  let critterIndex = player.selectors.femalePool.index ? player.selectors.femalePool.index : 0;
  player.selectors.femalePool = {};
  
  toProduction(player.breed.femalePool, critterIndex, player.breed.female)
}

function toProduction(pool, index, breeder) {
  let transfered = pool[index];
  addCritterToProduction(transfered);
  
  pool.splice(index, 1);

  updatePoolDisplay();
}

function getTotalCritter() {
  return 2 + player.breed.malePool.length + player.breed.femalePool.length + player.mount.production.dirt.pool.length;
}