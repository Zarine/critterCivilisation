
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
  return true;
}

function breed() {
  let maleStats = player.breed.male.stats;
  let femaleStats = player.breed.female.stats;
  
  let babyStats = [];
  for(let i = 0; i < gameConstants.numberOfStats; i++) {
    let min = Math.min(maleStats[i], femaleStats[i]);
    let max = Math.max(maleStats[i], femaleStats[i]);
    let babyStat = getRandomArbitrary(min * player.breed.minFactor, max * player.breed.maxFactor);
    babyStats.push(babyStat);
  }

  const newCritter = new Critter(babyStats);
  addToPool(newCritter);
};

function promoteMale() {
  let promoted = player.breed.malePool.pop();
  promote(promoted, player.breed.male)
}

function promoteFemale() {
  let promoted = player.breed.femalePool.pop();
  promote(promoted, player.breed.female)
}

function promote(promoted, breader) {
  breader.update(promoted.stats);
  updateBreederDisplay();
  updatePoolDisplay();
}

function trashMale() {
  player.breed.malePool.pop();
  updatePoolDisplay();
}

function trashFemale() {
  player.breed.femalePool.pop();
  updatePoolDisplay();
}

function addToPool(critter) {
  let pool;
  if(Math.random() < 0.5) {
    pool = player.breed.malePool;
  }
  else {
    pool = player.breed.femalePool;
  }
  
  if(pool.length >= player.breed.maxPoolSize) return;
  
  pool.push(critter);
  updatePoolDisplay();
}

function updateBreedProgress() {
  $("#breedProgress").attr("value", player.breed.currentProgress);
  $("#breedProgress").attr("max", player.breed.targetProgress);
}

function updateBreederDisplay() {
  updateCritterTableDisplay($("#maleBreader"), [player.breed.male]);
  updateCritterTableDisplay($("#femaleBreader"), [player.breed.female]);
};

function updatePoolDisplay() {
  updateCritterTableDisplay($("#malePool"), player.breed.malePool);
  updateCritterTableDisplay($("#femalePool"), player.breed.femalePool);
}

function updateCritterTableDisplay(table, critterArray) {
  let statsLines = [];
  statsLines.push(getCritterHeader());
  critterArray.forEach((critter) => {
    statsLines.push('<tr class="breederStats">');
    let stats = critter.stats;
    
    addCellToArray(statsLines, critter.score);
    stats.forEach((stat) => {
      addCellToArray(statsLines, stat);
    });
    statsLines.push('</tr>');
  });
  table.html(statsLines.join(""));
}

function getCritterHeader() {
  let statsHeader = [];
  statsHeader.push("<tr><th>Score</th>");
  gameConstants.stats.forEach((stat) => {
    statsHeader.push("<th>"+ stat + "</th>");
  });
  statsHeader.push("</tr>");
  return statsHeader.join("");
}