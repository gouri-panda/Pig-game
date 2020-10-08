/*
MIT License

Copyright (c) 2020 Gourishankar panda

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

GAME RULES:

- The game has 2(+) players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    getName() {
        return this.name;
    }

    getScore() {
        return this.score;
    }

    setScore(score) {
        this.score = score;
    }

    addScore(addedScore) {
        this.score += addedScore;
        return this.score;
    }

    toString() {
        return "Player (score: " + this.score + ")";
    }
}

console.log("start");

let urlParams = new URLSearchParams(window.location.search);
let playersParam = parseInt(urlParams.get('players'));
let numPlayers = playersParam >= 2 && playersParam <= 6 ? playersParam : 2;
let players = [];
let uiElements = [];


function createPlayerPanel(i) {
    let playerPanel = document.createElement("div")
    playerPanel.setAttribute("class", `player-panel player-${i}-panel`);

    let playerNameElement = document.createElement("div");
    playerNameElement.setAttribute("class", "player-name")
    playerNameElement.innerHTML = `Player ${i + 1}`;

    let playerScoreElement = document.createElement("div");
    playerScoreElement.setAttribute("class", "player-score")
    playerScoreElement.innerHTML = `0`;

    let playerBoxElement = document.createElement("div")
    playerBoxElement.setAttribute("class", `player-current-box`);


    let playerCurrentLabelElement = document.createElement("div")
    playerCurrentLabelElement.setAttribute("class", `player-current-label`);
    playerCurrentLabelElement.innerText = "Current";

    let playerCurrentScoreElement = document.createElement("div")
    playerCurrentScoreElement.setAttribute("class", `player-current-score`);
    playerCurrentScoreElement.innerText = "0";


    playerBoxElement.appendChild(playerCurrentLabelElement);
    playerBoxElement.appendChild(playerCurrentScoreElement);

    playerPanel.appendChild(playerNameElement);
    playerPanel.appendChild(playerScoreElement);
    playerPanel.appendChild(playerBoxElement);

    return {
        panel: playerPanel,
        current: playerCurrentScoreElement,
        score: playerScoreElement
    }
}

createPlayerPanel();

let playerParentContainer = document.getElementById("player-panel-container");
for (let i = 0; i < numPlayers; i++) {
    players.push(new Player(`Player ${i + 1}`));
    let elements = createPlayerPanel(i);
    uiElements.push({
        "current": elements.current,
        "total": elements.score,
        "winnerPanel": elements.panel
    });
    playerParentContainer.appendChild(elements.panel);

}

let activeScores = 0;
let activePlayer = 0;
let doubleSix = false;
let highestScore = 0;
let goal = 100;

let highestScoreEl = document.querySelector('.highest-score span');
document.querySelector('.dice').style.display = 'none';

checkTheme();

document.querySelector('.btn-roll').addEventListener('click', roll);

document.querySelector('.btn-hold').addEventListener('click', hold);

document.querySelector('.btn-new').addEventListener('click', newGame);

// Key pressing handler
document.querySelector('body').addEventListener('keydown', function (e) {
    switch (e.code) {
        case "Space":
            roll();
            break;
        case "Enter":
            hold();
            break;
        case "KeyN":
            newGame();
            break;
    }
});


function newGame() {
    activeScores = 0;
    activePlayer = 0;
    uiElements.forEach((playerUIElements, index) => {
        playerUIElements.current.textContent = '0';
        playerUIElements.total.textContent = '0';
    })

    document.querySelectorAll('.player-panel').forEach(e => e.classList.remove('active'));
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.dice').style.display = 'none'
    document.getElementById('score-goal-box').readOnly = false;
}

function hold() {
    let newScore = players[activePlayer].addScore(activeScores);
    updateHighestScore(newScore);
    checkWinner();
    activeScores = 0;

    uiElements[activePlayer].total.textContent = newScore.toString();
    uiElements[activePlayer].current.textContent = '0';

    nextPlayer()
}

function roll() {
    if (!document.getElementById('score-goal-box').readOnly) {
        document.getElementById('score-goal-box').readOnly = true;
        goal = parseInt(document.getElementById('score-goal-box').value);
    }

    let dice = Math.floor(Math.random() * 6 + 1);
    let diceDom = document.querySelector('.dice');

    diceDom.style.display = 'block';
    diceDom.src = "images/dice-" + dice + ".png";
    diceDom.alt = "You rolled :" + dice;


    if (dice === 1) {
        console.log("1 rolled");
        nextPlayer();
    } else {
        if (dice == 6) {
            if (doubleSix) {
                looseScore()
            }
            doubleSix = true
        }
        doubleSix = false;
        activeScores += dice;

        uiElements[activePlayer].current.textContent = activeScores;

    }

}

function nextPlayer() {

    let score = players[activePlayer].getScore();
    uiElements[activePlayer].total.textContent = score.toString();
    activeScores = 0;

    uiElements[activePlayer].current.textContent = '0';
    //switch player
    activePlayer = (activePlayer + 1) % numPlayers;
    //switch active state
    changeActiveState()
}

function checkWinner() {
    for (let i = 0; i < numPlayers; i++) {
        let player = players[i];
        let score = player.getScore();
        if (score >= goal) {
            console.log("we have a winner: " + player.getName())
            uiElements[i].winnerPanel.classList.add('winner');
            uiElements[i].winnerPanel.classList.add('active');
        }
    }
}

function changeActiveState() {
    document.querySelectorAll('.player-panel').forEach(e => e.classList.remove('active'));
    document.querySelector(`.player-${activePlayer}-panel`).classList.add('active');
    // document.querySelector('.dice').style.display = 'none'
}

function looseScore() {
    console.log('loosing score');
    activeScores = 0;
    players[activePlayer].setScore(0)
    uiElements[activePlayer].total.textContent = players[activePlayer].getScore().toString();
    uiElements[activePlayer].current.textContent = '0';
}

function checkTheme() {
    if (window.localStorage) {
        let body = document.querySelector('body');
        let toggle = document.querySelector('#toggle');
        let darkTheme = localStorage.getItem('dark-theme');

        if (darkTheme) {
            if (darkTheme === "on") {
                body.classList.add("dark-theme");
                toggle.checked = true;
            } else {
                body.classList.remove("dark-theme");
                toggle.checked = false;
            }
        }
    }
}

function changeTheme() {
    let body = document.querySelector('body');
    body.classList.toggle('dark-theme');

    if (body.classList.contains("dark-theme")) {
        localStorage.setItem("dark-theme", "on");
    } else {
        localStorage.setItem("dark-theme", "off");
    }
}

function updateHighestScore(score) {
    if (score > highestScore) highestScore = score;
    highestScoreEl.textContent = highestScore;
}

newGame();
