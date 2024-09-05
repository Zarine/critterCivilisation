function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
};

function getRandomArbitraryInt(min, max) {
  return Math.floor(getRandomArbitrary(min, max + 1));
};

function calculateDistance(point1, point2) {
  let distanceX = point2.x - point1.x;
  let distanceY = point2.y - point1.y;
  return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
}

function isEmpty(object) {
  return (object && Object.keys(object).length !== 0)
}

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



