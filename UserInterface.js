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

function disableNameInput(disable) {
  // Disables or enables the name input
  let nameInput = document.getElementById("name-input");
  disable == true
    ? (nameInput.value =
        "You chose to enter a list of names. You can leave this blank.")
    : (nameInput.value = nameInput.value);
  nameInput.disabled = disable;
}

module.exports = {
  openNav: openNav,
  closeNav: closeNav,
  toggleShow: toggleShow,
  openSettings: openSettings,
  disableNameInput: disableNameInput
};
