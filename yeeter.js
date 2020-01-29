var Kahoot = require("kahoot.js-updated");
var clients = [];
var botCount = 0;
var gamePin = null;
var botName = "Something Broke";
var botJoinSpeed = "100";
var botsToJoin = 100; //amount of bots that join (dont do more than 2000)
var stopBots = false;

var currentStatus = "\n" + document.getElementById("status").innerHTML;
var quizName = document.getElementById("quiz-name");
var questionsAmount = document.getElementById("questions-amount");
var currentQuestionWork = document.getElementById("current-question");


function stop() {
  stopBots = true;
  status(
    "bot spawner murdered; a grand total of " +
      botCount +
      " bots joined, however a couple more might have slipped through."
  );
}

function openNav() {
  document.getElementById("my-sidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("my-sidenav").style.width = "0";
}

function toggleShow() {
  var x = document.getElementById("status");
  x.style.display === "none"
    ? (x.style.display = "block")
    : (x.style.display = "none");
}

async function leave() {
  for (client in clients) {
    await client.leave(); //.then(status("Bot left"));
  }
}

function openSettings(){
  var x = document.getElementById("settings");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

document.getElementById("settings-btn").addEventListener("click", openSettings);
document.getElementById("leave-btn").addEventListener("click", leave);
document.getElementById("stop-btn").addEventListener("click", stop);
document.getElementById("open-nav-btn").addEventListener("click", openNav);
document.getElementById("close-nav-btn").addEventListener("click", closeNav);
document
  .getElementById("toggle-show-btn")
  .addEventListener("click", toggleShow);


function status(update) {
  currentStatus = "\n" + document.getElementById("status").innerHTML;
  document.getElementById("status").innerHTML = latestStatus + currentStatus;
}

status("No bots currently; no kahoots yeeted.");

document.getElementById("todoForm").addEventListener("submit", evt => {
  // prevent default refresh functionality of forms
  evt.preventDefault();

  // input on the form
  botName = evt.target[0].value;
  gamePin = evt.target[1].value;
  botsToJoin = evt.target[2].value;
  botJoinSpeed = evt.target[3].value;
  console.log(botName);
  timer(gamePin, botName, botsToJoin, botJoinSpeed);
  status("recived instructions for bots");
});

function timer(gamePin, botName, botsToJoin, botJoinSpeed) {
  botCount = 0;
  var joinTimer = setInterval(function() {
    console.log(++botCount);
    status(
      "Bot (" + botName + " " + botCount + ") recived instructions to join."
    );
    if (botCount >= botsToJoin || stopBots == true) clearInterval(joinTimer);
    joinKahoot(gamePin, botName);
  }, botJoinSpeed); //speed goes here please don't do less than 75
  
document.getElementById('settingsForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault();

  console.log(evt.target[0].checked);
  console.log(evt.target[1].checked);
  console.log(evt.target[2].checked);
//unfinished code TODO, take the values of these and put them in use for when the user presses yeet and earlier on in the code where they join hopefully that makes sense
});

}

function joinKahoot(gamePin, botName) {
  const client = new Kahoot();
  client.setMaxListeners(Number.POSITIVE_INFINITY);
  client.join(gamePin /* Or any other kahoot game pin */, botName + botCount);
  client.on("joined", () => {
    //status("Bot ("+botName+" "+botCount+") joined.");
  });
  var botID = botCount;
  client.on("quizStart", quiz => {
    status("[" + botName + botID + "] Quiz has started!");
    quizName.innerHTML = quiz.name;
    questionsAmount.innerHTML = quiz.questionCount + " questions";
    currentQuestionWork.innerHTML = "no questions yet";
  });
  client.on("questionStart", question => {
    var answ = Math.floor(Math.random() * 4);
    status("[" + botName + botID + "] answering opt" + answ);
    question.answer(answ);
  });
  client.on("question", currentQuestion => {
    currentQuestionWork.innerHTML = "question#" + currentQuestion.number;
  });
  client.on("questionEnd", question => {
    status("[" + botName + botID + "] correct?=" + question.correct);
  });
  client.on("quizEnd", () => {
    status("[" + botName + botID + "] quiz ended");
  });
  client.on("disconnect", () => {
    status("[" + botName + botID + "] disconnected");
  });

  clients.push(client);
}
