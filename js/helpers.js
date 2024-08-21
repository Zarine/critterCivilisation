function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
};

function getRandomArbitraryInt(min, max) {
  return Math.round(getRandomArbitrary(min, max));
};

function addCellToArray(array, value, tdClass) {
  let html = []
  if(tdClass) {
    html.push('<td class="');
    html.push(tdClass);
    html.push('">');
  }
  else {
    html.push("<td>");
  }
  html.push(formatNumber(value));
  html.push("</td>");
  array.push(html.join(""));
}

function compareStat(stat, statIndex, breeder) {
  if(!breeder) return;
  let currentCritter = player.breed[breeder];
  return compareToText(stat, currentCritter.stats[statIndex]);
}

function compareScore(score, breeder) {
  if(!breeder) return;
  let currentCritter = player.breed[breeder];
  return compareToText(score, currentCritter.score);
}

function compareToText(lhs, rhs) {
  if(lhs == rhs) return "same";
  if(lhs > rhs) return "better";
  return "worse";
}

function formatNumber(number) {
  if(number === '') return '';
  if(number % 1 === 0) return number;
  if(number >= 1000) {
    return number.toFixed(0);
  }
  return number.toFixed(1);
}



