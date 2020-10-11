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

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
console.log("start");
let scores = [0, 0];
let activeScores = 0;
let activePlayer = 0;
let doubleSix = false;
let highestScore = 0;
let goal = 100;

let score0 = document.getElementById('score-0');
let score1 = document.getElementById('score-1');
let current0 = document.getElementById('current-0');
let current1 = document.getElementById('current-1');

let highestScoreEl = document.querySelector('.highest-score span');
let x = document.querySelector('#current-' + activePlayer).textContent;
console.log('x is ' + x);
document.querySelector('.dice').style.display = 'none';

checkTheme();

document.querySelector('.btn-roll').addEventListener('click', roll);

document.querySelector('.btn-hold').addEventListener('click', hold);

document.querySelector('.btn-new').addEventListener('click', newGame);

// Key pressing handler
document.querySelector('body').addEventListener('keydown', function (e) {
    switch(e.code) {
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
    scores = [0, 0];
    activeScores = 0;
    activePlayer = 0;
    score0.textContent = '0';
    score1.textContent = '0';
    current0.textContent = '0';
    current1.textContent = '0';
    r = confirm('Would you like to change the name of players?');
    if (r == true) {
        person0 = prompt('Please enter your name', player0);
        document.getElementById('name-0').innerHTML = person0;
        
        person1 = prompt('Please enter your name', player1);
        document.getElementById('name-1').innerHTML = person1;
    }
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.dice').style.display = 'none'
}

function hold() {
    scores[activePlayer] += activeScores;
    updateHighestScore(scores[activePlayer]);
    checkWinner();
    activeScores = 0;
    if (activePlayer === 0) {
        score0.textContent = scores[0].toString();
        current0.textContent = '0'
    } else {
        score1.textContent = scores[1].toString();
        current1.textContent = '0'
    }
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
        if (dice === 6){
            if (doubleSix){
                looseScore()
            }
            doubleSix = true
        }
        doubleSix = false;
        activeScores += dice;

        if (activePlayer === 0) {
            current0.textContent = activeScores;
        } else {
            current1.textContent = activeScores;
        }

    }

}


newGame.addEventListener('click', function () {
    scores = [0, 0];
    activeScores = 0;
    activePlayer = 0;
    score0.textContent = '0';
    score1.textContent = '0';
    current0.textContent = '0';
    current1.textContent = '0';
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.dice').style.display = 'none'
    document.getElementById('score-goal-box').readOnly = false;
});


function nextPlayer() {
    if (activePlayer === 0) {
        score0.textContent = scores[0].toString();
        activeScores = 0;
        current0.textContent = '0';
        //switch player
        activePlayer = 1;
        //switch active state
        changeActiveState();
    } else {
        score1.textContent = scores[1].toString();
        activeScores = 0;
        current1.textContent = '0';
        //switch player
        activePlayer = 0;
        //switch active state
        changeActiveState()
    }
}

function checkWinner() {
    if (scores[0] >= goal) {
        document.querySelector('.player-0-panel').classList.add('winner');
        document.querySelector('.player-0-panel').classList.add('active');
        alert("Player 1 is winner")
    } else if (scores[1] >= goal) {
        document.querySelector('.player-1-panel').classList.add('winner');
        document.querySelector('.player-1-panel').classList.add('active');
        alert('Player 2 is winner')
    }
}

function changeActiveState() {
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.querySelector('.dice').style.display = 'none'
}

function looseScore() {
    console.log('loosing score');
    activeScores = 0;
    if (activePlayer === 0) {
        scores[0] = 0;
        score0.textContent = scores[0].toString();
        current0.textContent = '0';
    } else {
        scores[1] = 0;
        score1.textContent = scores[1].toString();
        current1.textContent = '0';
    }
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
