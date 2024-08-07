function displayInit() {
  updateBreederDisplay();
  updatePoolDisplay($("#malePool"), player.breed.malePool);
  updatePoolDisplay($("#femalePool"), player.breed.femalePool);
  
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
  updateCritterTableDisplay($("#malePool"), player.breed.malePool, true);
  updateCritterTableDisplay($("#femalePool"), player.breed.femalePool, true);
}

function updateCritterTableDisplay(table, critterArray, selectable) {
  let statsLines = [];
  statsLines.push(getCritterHeader());
  critterArray.forEach((critter) => {
    statsLines.push('<tr class="breederStats">');
    let stats = critter.stats;
    
    addCellToArray(statsLines, critter.score, compareScore(critter.score, table.attr("breeder")));
    stats.forEach((stat, statIndex) => {
      let compareClass = compareStat(stat, statIndex, table.attr("breeder"));
      addCellToArray(statsLines, stat, compareClass);
    });
    statsLines.push('</tr>');
  });
  table.html(statsLines.join(""));
  
  if(!selectable) return;
  
  table.find("tr").not(":first").click(addClickSelector);
  addBackSelected(table);
}

function addClickSelector() {
  let table = $(this).parent();
  let rows = table.find("tr");
  let selected = "selected";
  let currentlySelected = $(this).hasClass(selected);
  
  rows.removeClass(selected);
  if(currentlySelected) {
    player.selectors[table.attr("selector")] = {};
    return;
  }
  
  $(this).addClass(selected);
  
  let index = $(this).index() - 1; //We must remove the header from the index to get the right critter
  player.selectors[table.attr("selector")].index = index;
}

function addBackSelected(table) {
  let selector = player.selectors[table.attr("selector")];
  if(selector.index === undefined) return;
  
  let rows = table.find("tr");
  rows.eq(selector.index + 1).addClass('selected'); //We must add the header from the index to get the right critter
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