
class Critter {
  constructor(stats) {
    this.stats = stats;
    this.score = calculateScore(stats);
    if(stats.length > gameConstants.numberOfStats) console.warn("Too many stats for critter");
  }
  
  update(newStats) {
    this.stats = newStats;
    this.score = calculateScore(newStats);
  }
}

function breedPossible() {
  return (player.breed.malePool.length < player.breed.maxPoolSize || player.breed.femalePool.length < player.breed.maxPoolSize);
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
  let critterIndex = player.selectors.malePool.index ? player.selectors.malePool.index : 0;
  player.breed.malePool.splice(critterIndex, 1);
  player.selectors.malePool = {};

  updatePoolDisplay();
}

function trashFemale() {
  if(player.breed.femalePool.length == 0) return;
  let critterIndex = player.selectors.femalePool.index ? player.selectors.femalePool.index : 0;
  player.breed.femalePool.splice(critterIndex, 1);
  player.selectors.femalePool = {};
  
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
  updatePoolDisplay();
}
