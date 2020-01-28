var Kahoot = require("kahoot.js-updated");
var clients = [];
var n = 0;
var variable = 0;
var pin = null;
var botName = 'Something Broke';
var speed = '100';
var amountworkplease = 100; //amount of bots that join (dont do more than 2000)
var currentStatus = "\n" + document.getElementById("status").innerHTML;
var toldtostop = false;

var quizName = document.getElementById('quizName');
var questionAmount = document.getElementById('questionAmount');
var currentQuestionWork = document.getElementById('currentQ');
var botAmount = document.getElementById('botA');

var settingsWindow = null;

function stop() {
  toldtostop = true;
  status('bot spawner murdered; a grand total of ' + variable + ' bots joined, however a couple more might have slipped through.');
}


function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function toggleShow() {
  var x = document.getElementById("status");
  if (x.className === "console") {
    x.className = "console hidden";
  } else {
    x.className = "console";
  }
}

async function leave(){
  for (client in clients) {
    await clients[client].leave()
  }
}

function openSettings(){
  settingsWindow = window.open('./settings.html');
}

function getSettingsData(){
  //do stuff
}


document.getElementById("opensettings").addEventListener("click", openSettings);
document.getElementById("leave").addEventListener("click", leave);
document.getElementById("stop").addEventListener("click", stop);
document.getElementById("open-nav").addEventListener("click", openNav);
document.getElementById("close-nav").addEventListener("click", closeNav);
document.getElementById("toggle-show").addEventListener("click", toggleShow);

function status(update) {
  currentStatus = "\n" + document.getElementById("status").innerHTML;
  document.getElementById("status").innerHTML = update + currentStatus;
}

status("No bots currently; no kahoots yeeted.");

document.getElementById('todoForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault();

  // input on the form
  const name = evt.target[0];
  const pinthing = evt.target[1];
  const amnt = evt.target[2];
  const lgtnmqen = evt.target[3];
  botName = name.value;
  pin = pinthing.value;
  amountworkplease = amnt.value;
  speed = lgtnmqen.value;
  console.log(botName);
  toldtostop = false;
  timer(pin, botName, amountworkplease, speed);
  status('recived instructions for bots');
});


document.getElementById('settingsForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault();

  // get input on the form

  //close
  settingsWindow.close()
});


function timer(pin, name, amountb, sped) {
  variable = 0;
  var timer = setInterval(function() {
    console.log(++variable);
    status("Bot (" + name + " " + variable + ") recived instructions to join.");
    if (variable >= amountb || toldtostop == true) clearInterval(timer);
    joinKahoot(pin, name);
  }, sped); //speed goes here please don't do less than 75
}

function joinKahoot(pin, name) {
  const client = new Kahoot;
  client.setMaxListeners(Number.POSITIVE_INFINITY);
  client.join(pin /* Or any other kahoot game pin */ , name + variable);
  client.on("joined", () => {
    //status("Bot ("+name+" "+variable+") joined.");
  });
  var myID = variable;
  client.on("quizStart", Quiz => {
    status("[" + name + myID + "] Quiz has started!");
    quizName.innerHTML = Quiz.name;
    questionAmount.innerHTML = Quiz.questionCount + " questions";
    currentQuestionWork.innerHTML = 'no questions yet';
  });
  client.on("questionStart", question => {
    var answ = Math.floor(Math.random() * Math.floor(4));
    status("[" + name + myID + "] answering opt" + answ);
    question.answer(answ);
  });

  client.on("question", currentQuestion => {
    currentQuestionWork.innerHTML = "question#" + currentQuestion.number;
  });
  client.on("questionEnd", question => {
    status("[" + name + myID + "] correct?=" + question.correct);
  });
  client.on("quizEnd", () => {
    status("[" + name + myID + "] quiz ended");
  });
  client.on("disconnect", () => {
    status("[" + name + myID + "] disconnected");
  });

  clients.push(client);
}