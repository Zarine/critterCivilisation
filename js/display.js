function displayInitTabs() {
  checkAndDisplayTab(player.mount, $("#MountTab"));
  checkAndDisplayTab(player.explore, $("#ExploreTab"))
  checkAndDisplayTab(player.battle, $("#BattleTab"))
}

function checkAndDisplayTab(data, html) {
  if(data.unlocked) {
    html.removeClass("hidden");
  }
  else {
    html.addClass("hidden");
  }
}

function displayInitHatchery() {
  updateBreederDisplay();
  updatePoolDisplay($("#malePool"), player.breed.malePool);
  updatePoolDisplay($("#femalePool"), player.breed.femalePool);
}

function updateBreedProgress() {
  $("#breedProgress").attr("value", player.breed.currentProgress);
  $("#breedProgress").attr("max", player.breed.targetProgress);
}

function updateProductionProgress() {
  $("#dirtProgress").attr("value", player.mount.production.dirt.progress);
  $("#dirtProgress").attr("max", player.mount.production.dirt.target);
}

function updateBreederDisplay() {
  updateCritterTableDisplay($("#maleBreader"), [player.breed.male]);
  updateCritterTableDisplay($("#femaleBreader"), [player.breed.female]);
};

function updatePoolDisplay() {
  updateCritterTableDisplay($("#malePool"), player.breed.malePool, true);
  updateCritterTableDisplay($("#femalePool"), player.breed.femalePool, true);
}

function pushCritterStats(statsLines, stats, score, table) {
    statsLines.push('<tr class="critterStats">');
    
    addCellToArray(statsLines, score, compareScore(score, table.attr("breeder")));
    stats.forEach((stat, statIndex) => {
      let compareClass = compareStat(stat, statIndex, table.attr("breeder"));
      addCellToArray(statsLines, stat, compareClass);
    });
    statsLines.push('</tr>');
}

function updateCritterTableDisplay(table, critterArray, selectable, displaySize) {
  let statsLines = [];
  statsLines.push(getCritterHeader());
  
  critterArray.forEach((critter) => {
    let stats = critter.stats;
    pushCritterStats(statsLines, stats, critter.score, table);
  });
  if(critterArray.length < displaySize) {
    let emptyStats = [];
    for (let i = 0; i < gameConstants.numberOfStats; i++) {
      emptyStats.push('');
    }
    pushCritterStats(statsLines, emptyStats, '', table);
  }
  
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
    player.selectors[table.attr("selector")].index = undefined;
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

function updateUpgradeResources() {
  $("#rnaValue").text(formatNumber(player.upgrade.rna));
  $("#dnaValue").text(formatNumber(player.upgrade.dna));
}

function upgradeTemplate(upgrade) {
  let upgradeHtml = [];
  upgradeHtml.push('<div class="upgrade');
  if(upgrade.canBuy()) {
    upgradeHtml.push(` buyable" onClick="buyUpgrade('`);
    upgradeHtml.push(upgrade.id);
    upgradeHtml.push(`')`);
  }
  upgradeHtml.push('"><div>');
  upgradeHtml.push(upgrade.name);
  upgradeHtml.push('</div>');
  
  upgrade.cost.forEach((value, index) => {
    if(!value) return;
    upgradeHtml.push('<div>');
    upgradeHtml.push(value);
    upgradeHtml.push(' ');
    upgradeHtml.push(upgradeCostMapping[index]);
    upgradeHtml.push('</div>');
  });
  upgradeHtml.push('</div>');
  return upgradeHtml.join("");
}

function updateUpgradeList() {
  let upgradeList = $("#upgrades");
  let upgradesHtml = [];
  upgrades.forEach((upgrade) => {
    if(!upgrade.available()) return;
    if(upgrade.purchased) return;
    upgradesHtml.push(upgradeTemplate(upgrade));
  });
  upgradeList.html(upgradesHtml.join(""));
  
}

function buildingTemplate(building) {
  let buildingHtml = [];
  buildingHtml.push('<div class="building');
  if(building.canBuy()) {
    buildingHtml.push(` buyable" onClick="buyBuilding('`);
    buildingHtml.push(building.id);
    buildingHtml.push(`')`);
  }
  buildingHtml.push('"><div>');
  buildingHtml.push(building.name);
  buildingHtml.push('</div>');
  
  building.cost.forEach((value, index) => {
    if(!value) return;
    buildingHtml.push('<div>');
    buildingHtml.push(value);
    buildingHtml.push(' ');
    buildingHtml.push(buildingCostMapping[index]);
    buildingHtml.push('</div>');
  });
  buildingHtml.push('</div>');
  return buildingHtml.join("");
}

function updateBuildingList() {
  if(!hasBuildingListChanged()) return;
  
  let buildingList = $("#buildings");
  let buildingsHtml = [];
  buildings.forEach((building) => {
    if(!building.available()) return;
    if(building.purchased) return;
    buildingsHtml.push(buildingTemplate(building));
  });
  buildingList.html(buildingsHtml.join(""));
  
}

function updateMountResources() {
  $("#foodValue").text(formatNumber(getTotalCritter()));
  $("#maxFoodValue").text(formatNumber(getResourceQuantity("food")));
  $("#dirtValue").text(formatNumber(getResourceQuantity("dirt")));
  $("#woodValue").text(formatNumber(getResourceQuantity("wood")));
  $("#stoneValue").text(formatNumber(getResourceQuantity("stone")));
}

function purchasedBuildingTemplate(building) {
  let buildingHtml = [];
  buildingHtml.push('<li><div>');
  buildingHtml.push(building.name);
  buildingHtml.push('</div></li>');
  return buildingHtml.join("");
}

function updatePurchasedBuildings() {
  let purchasedBuilding = $("#purchasedBuildings");
  purchasedBuildingHtml = [];
  buildings.forEach((building) => {
    if(!building.purchased) return;
    purchasedBuildingHtml.push(purchasedBuildingTemplate(building));
  });
  
  purchasedBuilding.html(purchasedBuildingHtml.join(""));
}

function displayArea(name) {
  $("#" + name).removeClass("hidden");
}

function updateEntireProductions() {
  updateCritterTab("dirt");
  updateCritterTab("food");
}

function updateCritterTab(type) {
  let resource = getResource(type);
  updateCritterTableDisplay($("#" + type + "Pool"), resource.pool, undefined, resource.maxSize);
}

function updateExploreLeftScreen() {
  updateExplorationCritterList();
  updateDifficultyArea();
}

function updateExplorationCritterList() {
  updateCritterTableDisplay($("#explorePool"), player.explore.pool, undefined, player.explore.maxPoolSize);
}

function updateDifficultyArea() {
  let selectElement = $('#difficultySelect');
  selectElement.empty();
  $.each(player.explore.availableDifficulties, function(index, value) {
    selectElement.append($('<option></option>').attr('value', value).text(value));
  });
  
  if(player.explore.difficulty) {
    $("#selectedDifficulty").html(player.explore.difficulty);
    $("#displayDifficulty").removeClass("hidden");
    $('#difficultySelect').val(player.explore.difficulty);
  }
  else {
    $("#displayDifficulty").addClass("hidden");
  }  
}

function displayMap() {
  let map = player.explore.activeMap;
  let htmlMapContainer = $("#map");
  
  let htmlMap = [];
  for(let i = 0; i < map.length; i++) {
    let line = map[i];
    htmlMap.push('<tr class="mapLine">');
    for(let j = 0; j < line.length; j++) {
      htmlMap.push('<td class="mapCell ');
      if(!map[i][j].discovered) {
        htmlMap.push('undiscovered"></td>');
      }
      else if(!map[i][j].scouted) {
        htmlMap.push('"></td>');
      }
      else {
        if(map[i][j].isSpecial) {
          htmlMap.push(map[i][j].special.id);
        }
        htmlMap.push('">' + map[i][j].difficulty + '</td>');
      }
      
      
    }
    htmlMap.push('</tr>');
  }
  htmlMapContainer.html(htmlMap.join(""));
}
