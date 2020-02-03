var Kahoot = require("kahoot.js-updated");
var clients = [];
var n = 0;
var variable = 0;
var pin = null;
var botName = "Something Broke";
var speed = "100";
var amountworkplease = 100; //amount of bots that join (dont do more than 2000)
var currentStatus = "\n" + document.getElementById("status").innerHTML;
var toldtostop = false;
var selectedOption = null;
var quizName = document.getElementById("quiz-name");
var questionAmount = document.getElementById("question-amount");
var currentQuestionWork = document.getElementById("current-question");
var botAmount = document.getElementById("bot-amount");

function stop() {
  toldtostop = true;
  status(
    "bot spawner murdered; a grand total of " +
      variable +
      " bots joined, however a couple more might have slipped through."
  );
}

function openNav() {
  document.getElementById("sidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("sidenav").style.width = "0";
}

function toggleShow() {
  var x = document.getElementById("status");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

async function leave() {
  for (client in clients) {
    await clients[client].leave();
  }
}

function openSettings() {
  var x = document.getElementById("settings");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  document.location.href = "#settings";
}

function scrollTop() {
  var x = document.getElementById("settings");
  x.style.display = "none";
  document.location.href = "#top";
}

function inputNames() {
  fetch("./names.txt")
    .then(response => response.text())
    .then(data => {
      document.getElementById("bot-name-list").value = data;
    });
}

function shuffle(array) {
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
  var numbers = document.getElementById("bot-name-list").value.split("\n");
  var shuffledNumbers = shuffle(numbers);
  //var output = document.getElementById("output");
  var output = "";
  shuffledNumbers.forEach(function(currentNumber) {
    output += currentNumber + "\n";
  });
  document.getElementById("bot-name-list").value = output;
}

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

function status(update) {
  currentStatus = "\n" + document.getElementById("status").innerHTML;
  document.getElementById("status").innerHTML = update + currentStatus;
}

status("No bots currently; no kahoots yeeted.");

document.getElementById("todo-form").addEventListener("submit", evt => {
  // prevent default refresh functionality of forms
  evt.preventDefault();

  // input on the form
  const name = evt.target[0];
  const pinthing = evt.target[1];
  const amnt = evt.target[2];
  const earlyspeed = evt.target[3];
  botName = name.value;
  pin = pinthing.value;
  amountworkplease = amnt.value;
  speed = earlyspeed.value;
  console.log(botName);
  toldtostop = false;
  timer(pin, botName, amountworkplease, speed);
  status("recived instructions for bots");
});

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
  // prevent default refresh functionality of forms
  evt.preventDefault();

  // If list naming option is selected disable name input
  selectedOption = document.querySelector("input[name=add-input]:checked").id;
  if (evt.target[2].checked) {
    disableNameInput(true);
  } else {
    disableNameInput(false);
  }
  console.log(evt.target[0].checked);
  console.log(evt.target[1].checked);
  console.log(evt.target[2].checked);
  //unfinished code TODO, take the values of these and put them in use for when the user presses yeet and earlier on in the code where they join hopefully that makes sense
});

function chooseBotNamingOption(name, variable, times) {
  // See which input is checked and then choose the corresponding bot naming procedure
  if (selectedOption == "prefix-number" || selectedOption == null) {
    let bot = simpleBotName(name, variable);
    return bot;
  } else if (selectedOption == "number-suffix") {
    let bot = simpleBotName(variable, name);
    return bot;
  } else {
    let bot = botNameFromList(variable - 1, times);
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
  index >= botNameList.length - 1 ? (variable = 0) : (variable = variable);
  if (times > 1) {
    return botNameList[index] + times;
  } else {
    return botNameList[index];
  }
}

function timer(pin, name, amountb, sped) {
  variable = 0;
  // Added times variable to count how many times the program went over the specified list of names
  var times = 0;
  var timer = setInterval(function() {
    variable == 0 ? (times += 1) : (times = times);
    console.log(++variable);
    // Do the check before the join function so that it stops at the right moment
    if (selectedOption == "name-list") {
      if (times > amountb || toldtostop == true) {
        clearInterval(timer);
        return;
      }
    } else if (variable - 1 >= amountb) {
      clearInterval(timer);
      return;
    }
    let botName = chooseBotNamingOption(name, variable, times);
    status("Bot (" + botName + ") recived instructions to join.");
    joinKahoot(pin, botName);
  }, sped); //speed goes here please don't do less than 75
}

function joinKahoot(pin, name) {
  const client = new Kahoot();
  client.setMaxListeners(Number.POSITIVE_INFINITY);
  client.join(pin /* Or any other kahoot game pin */, name);
  client.on("joined", () => {
    //status("Bot ("+name+" "+variable+") joined.");
  });
  client.on("quizStart", Quiz => {
    status("[" + name + "] Quiz has started!");
    quizName.innerHTML = Quiz.name;
    questionAmount.innerHTML = Quiz.questionCount + " questions";
    currentQuestionWork.innerHTML = "no questions yet";
  });
  client.on("questionStart", question => {
    var answ = Math.floor(Math.random() * Math.floor(4));
    status("[" + name + "] answering opt" + answ);
    question.answer(answ);
  });

  client.on("question", currentQuestion => {
    currentQuestionWork.innerHTML = "question#" + currentQuestion.number;
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
