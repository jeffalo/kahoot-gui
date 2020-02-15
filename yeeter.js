var Kahoot = require("kahoot.js-updated");
const UserInterface = require("./UserInterface.js");
const Functions = require("./Functions.js");
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
var useHydraMode = null;
var hydraAmount = 0;

function stop() {
  // Stops the bot joining process
  toldToStop = true;
  Functions.status(
    "bot spawner murdered; a grand total of " +
      currentBotCount +
      " bots joined, however a couple more might have slipped through."
  );
}

async function leave() {
  // Make all bots leave the game instance
  for (client in clients) {
    await clients[client].leave();
  }
}

function scrollTop() {
  // Scrolls to the top of the application
  var x = document.getElementById("settings");
  x.style.display = "none";
  document.location.href = "#top";
}

function chooseBotNamingOption(name, currentBotCount, times) {
  // See which input is checked and then choose the corresponding bot naming procedure
  if (
    selectedBotNamingOption == "prefix-number" ||
    selectedBotNamingOption == null
  ) {
    let bot = Functions.simpleBotName(name, currentBotCount);
    return bot;
  } else if (selectedBotNamingOption == "number-suffix") {
    let bot = Functions.simpleBotName(currentBotCount, name);
    return bot;
  } else {
    let bot = botNameFromList(currentBotCount - 1, times);
    return bot;
  }
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
    } else if (
      currentBotCount - 1 >= numberOfBotsToJoin ||
      toldToStop == true
    ) {
      clearInterval(timer);
      return;
    }
    let botName = chooseBotNamingOption(name, currentBotCount, times);
    Functions.status("Bot (" + botName + ") recived instructions to join.");
    joinKahoot(gamePin, botName);
  }, joinSpeed); //joinSpeed goes here please don't do less than 75
}

function joinKahoot(gamePin, name) {
  const client = new Kahoot();
  client.setMaxListeners(Number.POSITIVE_INFINITY);
  client.join(gamePin /* Or any other kahoot game gamePin */, name);
  client.on("joined", () => {
    //Functions.status("Bot ("+name+" "+currentBotCount+") joined.");
  });
  client.on("quizStart", Quiz => {
    Functions.status("[" + name + "] Quiz has started!");
    quizName.innerHTML = Quiz.name;
    questionAmount.innerHTML = Quiz.questionCount + " questions";
    currentQuestion.innerHTML = "no questions yet";
  });
  client.on("questionStart", question => {
    var answ = Math.floor(Math.random() * Math.floor(4));
    Functions.status("[" + name + "] answering opt" + answ);
    question.answer(answ);
  });

  client.on("question", currentQuestion => {
    currentQuestion.innerHTML = "question#" + currentQuestion.number;
  });
  client.on("questionEnd", question => {
    Functions.status("[" + name + "] correct?=" + question.correct);
  });
  client.on("quizEnd", () => {
    Functions.status("[" + name + "] quiz ended");
  });
  client.on("disconnect", () => {
    Functions.status("[" + name + "] disconnected");
    if (useHydraMode == true){
      var hydraCounter = 0
      while (hydraCounter < hydraAmount){
        joinKahoot(gamePin, name+"'s revenge"+hydraCounter)
        hydraCounter++  
      }

    }
  });

  clients.push(client);
}

// Add event listeners for different buttons
document
  .getElementById("randomize-btn")
  .addEventListener("click", Functions.random);
document
  .getElementById("input-names-btn")
  .addEventListener("click", Functions.inputNames);
document.getElementById("save-form-btn").addEventListener("click", scrollTop);
document
  .getElementById("open-settings-btn")
  .addEventListener("click", UserInterface.openSettings);
document.getElementById("leave-btn").addEventListener("click", leave);
document.getElementById("stop-btn").addEventListener("click", stop);
document
  .getElementById("open-nav-btn")
  .addEventListener("click", UserInterface.openNav);
document
  .getElementById("close-nav-btn")
  .addEventListener("click", UserInterface.closeNav);
document
  .getElementById("toggle-show-btn")
  .addEventListener("click", UserInterface.toggleShow);
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
  Functions.status("recived instructions for bots");
});
document.getElementById("settings-form").addEventListener("submit", evt => {
  // Prevent default refresh functionality of forms
  evt.preventDefault();

  // If list naming option is selected disable name input
  selectedBotNamingOption = document.querySelector(
    "input[name=add-input]:checked"
  ).id;
  if (evt.target[2].checked) {
    UserInterface.disableNameInput(true);
  } else {
    UserInterface.disableNameInput(false);
  }

  console.log(evt.target[6].value)
  if(evt.target[6].value == 0){
    useHydraMode = false
  } else{
    useHydraMode = true
    hydraAmount = evt.target[6].value
  }
  
});
Functions.status("No bots currently; no kahoots yeeted.");
