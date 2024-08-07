function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
};

function calculateScore(array) {
  if (array.length == 0) {
    return 0;
  }
  const sum = array.reduce((acc, val) => acc + val, 0);
  return sum / array.length;
}

function addCellToArray(array, value) {
  array.push("<td>" + displayNumber(value) + "</td>");
}

function displayNumber(number) {
  if(number >= 1000) {
    return number.toFixed(0);
  }
  return number.toFixed(1);
}

function displayInit() {
  updateBreederDisplay();
  updatePoolDisplay($("#malePool"), player.breed.malePool);
  updatePoolDisplay($("#femalePool"), player.breed.femalePool);
  
}