var Kahoot = require("kahoot.js-updated");
var clients = [];
var currentBotCount = 0;
var gamePin = null;
var botName = "Something Broke";
var joinSpeed = "100";
var amountOfBotsToJoin = 100; //amount of bots that join (dont do more than 2000)
var currentStatus = "\n" + document.getElementById("status").innerHTML;
var toldToStop = false;
var selectedBotNamingOption = null;
var quizName = document.getElementById("quiz-name");
var questionAmount = document.getElementById("question-amount");
var currentQuestion = document.getElementById("current-question");

function stop() {
  // Stops the bot joining process
  toldToStop = true;
  status(
    "bot spawner murdered; a grand total of " +
      currentBotCount +
      " bots joined, however a couple more might have slipped through."
  );
}

function openNav() {
  // Displays the side navigation panel
  document.getElementById("sidenav").style.width = "250px";
}

function closeNav() {
  // Closes the side navigation panel
  document.getElementById("sidenav").style.width = "0";
}

function toggleShow() {
  // Displays/Hides the program status text area
  var x = document.getElementById("status");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

async function leave() {
  // Make all bots leave the game instance
  for (client in clients) {
    await clients[client].leave();
  }
}

function openSettings() {
  // Displays/Hides the advanced settings panel
  var x = document.getElementById("settings");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  document.location.href = "#settings";
}

function scrollTop() {
  // Scrolls to the top of the application
  var x = document.getElementById("settings");
  x.style.display = "none";
  document.location.href = "#top";
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

// Add event listeners for different buttons
document.getElementById("randomize-btn").addEventListener("click", random);
document
  .getElementById("input-names-btn")
  .addEventListener("click", inputNames);
document.getElementById("save-form-btn").addEventListener("click", scrollTop);
document
  .getElementById("open-settings-btn")
  .addEventListener("click", openSettings);
document.getElementById("leave-btn").addEventListener("click", leave);
document.getElementById("stop-btn").addEventListener("click", stop);
document.getElementById("open-nav-btn").addEventListener("click", openNav);
document.getElementById("close-nav-btn").addEventListener("click", closeNav);
document
  .getElementById("toggle-show-btn")
  .addEventListener("click", toggleShow);
document.getElementById("todo-form").addEventListener("submit", evt => {
  // prevent default refresh functionality of forms
  evt.preventDefault();

  // input on the form
  botName = evt.target[0].value;
  gamePin = evt.target[1].value;
  amountOfBotsToJoin = evt.target[2].value;
  joinSpeed = evt.target[3].value;
  toldToStop = false;
  timer(gamePin, botName, amountOfBotsToJoin, joinSpeed);
  status("recived instructions for bots");
});

function status(update) {
  // Update the status in the program status text area
  currentStatus = "\n" + document.getElementById("status").innerHTML;
  document.getElementById("status").innerHTML = update + currentStatus;
}

status("No bots currently; no kahoots yeeted.");

function disableNameInput(disable) {
  // Disables or enables the name input
  let nameInput = document.getElementById("name-input");
  disable == true
    ? (nameInput.value =
        "You chose to enter a list of names. You can leave this blank.")
    : (nameInput.value = nameInput.value);
  nameInput.disabled = disable;
}

document.getElementById("settings-form").addEventListener("submit", evt => {
  // Prevent default refresh functionality of forms
  evt.preventDefault();

  // If list naming option is selected disable name input
  selectedBotNamingOption = document.querySelector(
    "input[name=add-input]:checked"
  ).id;
  if (evt.target[2].checked) {
    disableNameInput(true);
  } else {
    disableNameInput(false);
  }
  //unfinished code TODO, take the values of these and put them in use for when the user presses yeet and earlier on in the code where they join hopefully that makes sense
});

function chooseBotNamingOption(name, currentBotCount, times) {
  // See which input is checked and then choose the corresponding bot naming procedure
  if (
    selectedBotNamingOption == "prefix-number" ||
    selectedBotNamingOption == null
  ) {
    let bot = simpleBotName(name, currentBotCount);
    return bot;
  } else if (selectedBotNamingOption == "number-suffix") {
    let bot = simpleBotName(currentBotCount, name);
    return bot;
  } else {
    let bot = botNameFromList(currentBotCount - 1, times);
    return bot;
  }
}

function simpleBotName(prefix, suffix) {
  // Add prefix + name or suffix + name
  return prefix + suffix;
}

function botNameFromList(index, times) {
  // Take the value of the textarea, convert to array of string,
  // and then return names in order
  // Will loop over the name as many times as requested in the "number of bots" field
  var botNameList = document.getElementById("bot-name-list").value;
  botNameList = botNameList.split("\n");
  index >= botNameList.length - 1
    ? (currentBotCount = 0)
    : (currentBotCount = currentBotCount);
  if (times > 1) {
    return botNameList[index] + times;
  } else {
    return botNameList[index];
  }
}

function timer(gamePin, name, numberOfBotsToJoin, joinSpeed) {
  currentBotCount = 0;
  // Added times currentBotCount to count how many times the program went over the specified list of names
  var times = 0;
  var timer = setInterval(function() {
    currentBotCount == 0 ? (times += 1) : (times = times);
    currentBotCount++;
    // Do the check before the join function so that it stops at the right moment
    if (selectedBotNamingOption == "name-list") {
      if (times > numberOfBotsToJoin || toldToStop == true) {
        clearInterval(timer);
        return;
      }
    } else if (currentBotCount - 1 >= numberOfBotsToJoin) {
      clearInterval(timer);
      return;
    }
    let botName = chooseBotNamingOption(name, currentBotCount, times);
    status("Bot (" + botName + ") recived instructions to join.");
    joinKahoot(gamePin, botName);
  }, joinSpeed); //joinSpeed goes here please don't do less than 75
}

function joinKahoot(gamePin, name) {
  const client = new Kahoot();
  client.setMaxListeners(Number.POSITIVE_INFINITY);
  client.join(gamePin /* Or any other kahoot game gamePin */, name);
  client.on("joined", () => {
    //status("Bot ("+name+" "+currentBotCount+") joined.");
  });
  client.on("quizStart", Quiz => {
    status("[" + name + "] Quiz has started!");
    quizName.innerHTML = Quiz.name;
    questionAmount.innerHTML = Quiz.questionCount + " questions";
    currentQuestion.innerHTML = "no questions yet";
  });
  client.on("questionStart", question => {
    var answ = Math.floor(Math.random() * Math.floor(4));
    status("[" + name + "] answering opt" + answ);
    question.answer(answ);
  });

  client.on("question", currentQuestion => {
    currentQuestion.innerHTML = "question#" + currentQuestion.number;
  });
  client.on("questionEnd", question => {
    status("[" + name + "] correct?=" + question.correct);
  });
  client.on("quizEnd", () => {
    status("[" + name + "] quiz ended");
  });
  client.on("disconnect", () => {
    status("[" + name + "] disconnected");
  });

  clients.push(client);
}
