
# kahoot-gui

A GUI for a simple Kahoot spammer. Not affiliated with Kahoot.
### Screenshot
![](https://i.imgur.com/w6smmnz.png)
## How it works

Uses `Electron` to interface with `kahoot.js-updated`. 

## How to run
### Prebuilt
Download the ZIP file, extract it and open kahoot-gui.exe
### Run it yourself

run `git clone https://github.com/JeffaloBob/kahoot-gui` 

Inside of the cloned repo, run `npm i`
## How to use
Consult the tables below.

### Inputs

|Input|Meaning|
|--|--|
| name | this will be the base name that the bots will join with |
| pin | the pin that the bots will join |
| number of bots | amount of bots to join (or if a specific name list is chosen in the advanced settings, the amount of times each name joins) |
| join delay | millisecond delay between each bot joining (minimum 50) |

### Buttons

|Button|What it does|
|--|--|
| yeet | starts making the bots join |
| toggle advanced settings menu | opens the advanced settings menu (see below) |
| console: toggle show| shows the console |
| show quiz infos | opens some quiz info that will be shown on the right side of the screen (WIP) |
| kill bot spawner | stops bots from spawning |
| make all bots leave | makes all the currently joined bots leave |

### Advanced settings

| option | Meaning |
|--|--|
| prefix+number | Makes all bots join using the format (where prefix is the bot's name) |
| number+suffix | Makes all bots join using the format (where prefix is the bot's name) |
| from list | Disables the normal name input and all bots will join using a name from there. If the amount value is 1, then every bot on the list will join, if it's 2 every bot will join twice |
| Save | saves |