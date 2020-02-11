function status(update) {
  // Update the status in the program status text area
  var currentStatus = "\n" + document.getElementById("status").innerHTML;
  document.getElementById("status").innerHTML = update + currentStatus;
}

function random() {
  // Shuffle the list of names from the bot names list
  var botNames = document.getElementById("bot-name-list").value.split("\n");
  var shuffledNames = shuffle(botNames);
  //var output = document.getElementById("output");
  var output = "";
  shuffledNames.forEach(function(currentNumber) {
    output += currentNumber + "\n";
  });
  document.getElementById("bot-name-list").value = output;
}

function inputNames() {
  // Retrieves a list of generic names from the names.txt file and
  // inputs the values retrieved in the bot names list in the advanced settings panel
  fetch("./names.txt")
    .then(response => response.text())
    .then(data => {
      document.getElementById("bot-name-list").value = data;
    });
}

function shuffle(array) {
  // Array shuffle function implementation
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function simpleBotName(prefix, suffix) {
  // Add prefix + name or suffix + name
  return prefix + suffix;
}

module.exports = {
  status: status,
  random: random,
  inputNames: inputNames,
  shuffle: shuffle,
  simpleBotName: simpleBotName
};
