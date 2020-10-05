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
/* Initialising the parameters to be used in the project.
    1) scores is an array of two elements used to hold scores of [player1, player2]
    2) activeScores holds the current active score of an active player
    3) activePlayer is a binary that will hold player who is active at this point of time
    4) doubleSix is a boolean variable that will initiate a function looseScore
    5) highestScore is just a variable that will check and update the highest score of current player by comparing with the old highest

*/

// console.log("start");
let scores = [0, 0];
let activeScores = 0;
let activePlayer = 0;
let doubleSix = false;
let highestScore = 0;

// console.log(dice)
// document.querySelector("#current-" + activePlayer).textContent = dice
// document.querySelector('#current-'+ activePlayer).innerHTML = '<em>' + dice + '</em>';
// Getting initial values of all parameters from the HTML through DOM
let score0 = document.getElementById('score-0');
let score1 = document.getElementById('score-1');
let current0 = document.getElementById('current-0');
let current1 = document.getElementById('current-1');
let newGame = document.querySelector('.btn-new');

let highestScoreEl = document.querySelector('.highest-score span');
let x = document.querySelector('#current-' + activePlayer).textContent;
console.log('x is ' + x);
document.querySelector('.dice').style.display = 'none';
let bottomRoll = document.querySelector('.btn-roll');
console.log(bottomRoll);

checkTheme();

// We trigger this event of clicking of dice by adding an 'click' event on it.
// Whenever we click on the dice this function is called due to event handler.

bottomRoll.addEventListener('click', function () {
    //generate a random number between 1 and 6
    var dice = Math.floor(Math.random() * 6 + 1);
    //formatting of the dice
    var diceDom = document.querySelector('.dice');
    diceDom.style.display = 'block';
    diceDom.src = "images/dice-" + dice + ".png";
    diceDom.alt = "You rolled :" + dice;

    // if the dice roll leads into a 1, according to rules of the game, his round score is lost 
    //and the nextplayer gets a chance
    if (dice == 1) {
        console.log("1 rolled");
        nextPlayer();
    } else { 
        // if the user lands a double six and the doubleSix flag is activated, an intial state is triggered by resetting
        // the scores by calling looseScore();
        if (dice == 6){
            if (doubleSix){
                looseScore()
            }
            // activating the flag
            doubleSix = true
        }
        // if none of the above conditions were true, teh activeScore of that player should be updated by number 
        // on the 'dice' roll
        doubleSix = false;
        activeScores += dice;

        // update the scores on the HTML
        if (activePlayer == 0) {
            current0.textContent = activeScores;
        } else {
            current1.textContent = activeScores;
        }

    }

});

// adding an event for 'Hold' button
let buttonHold = document.querySelector('.btn-hold');
// This event handler will be called everytime the current user presses on 'Hold'
buttonHold.addEventListener('click', function () {
    // If user chooses to 'Hold' for the current chance, then his current score will be added
    // to his global score. 
    scores[activePlayer] += activeScores;
    // Update the highest score in the top of the page to highlight the star player
    updateHighestScore(scores[activePlayer]);
    checkWinner();
    activeScores = 0;
    // Update the HTML accordingly and reset the scores.
    if (activePlayer == 0) {
        score0.textContent = scores[0].toString();
        current0.textContent = '0'
    } else {
        score1.textContent = scores[1].toString();
        current1.textContent = '0'
    }
    // Navigate to the nextplayer after the current players details get updated on the DOM
    nextPlayer()
});

// When the 'New Game' button is clicked, reset all the details related to the game as it is at state 0 now.
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
});

// This function updates the scores for a current user, updates the HTML for that user and then toggles
// between the players. For eg: if activePlayer = 0, it is made as 1 and vice versa.
// After doing this, it changes the activeState by calling changeActiveState() function.
function nextPlayer() {
    if (activePlayer == 0) {

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

// This function is responsible for checking the winner.
// It checks the current score for the players and if the score for any player is 100 or more, then that
// player is refelected as the winner in the HTML by adding 'winner' class & 'active' class styles to it.
function checkWinner() {
    if (scores[0] >= 100) {

        document.querySelector('.player-0-panel').classList.add('winner');
        document.querySelector('.player-0-panel').classList.add('active')
    } else if (scores[1] >= 100) {

        document.querySelector('.player-1-panel').classList.add('winner');
        document.querySelector('.player-1-panel').classList.add('active')
    }
}

// This function is just responsible for toggling between the active states for panels of the players.
// It makes the style slightly different by adding a class 'active' to the active player.
function changeActiveState() {
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.querySelector('.dice').style.display = 'none'
}
// This function resets the content of the html and the scores after the function is triggered due to doubleSix flag
function looseScore() {
    console.log('loosing score');
    activeScores = 0;
    // For active player, reset the score to 0 and reflect the same in it's HTML 
    if (activePlayer == 0) {
        scores[0] = 0;
        score0.textContent = scores[0].toString();
        current0.textContent = '0';
    } else {
        scores[1] = 0;
        score1.textContent = scores[1].toString();
        current1.textContent = '0';
    }
}

// This is a function that maintains the current active theme of the page
// The below conditions only work if the theme is currently present in the localStorage of the browser as called by checkTheme()
// It works on a toggle mechanism, if the theme is not dark, it adds the theme as a class to the DOM elements.
// if the theme is dark, then it removes the dark theme from the list of classes of the DOM element.

function checkTheme() {
    if (window.localStorage) {
        let body = document.querySelector('body');
        let toogle = document.querySelector('#toggle');
        let darkTheme = localStorage.getItem('dark-theme');

        if (darkTheme) {
            if (darkTheme === "on") {
                body.classList.add("dark-theme");
                toogle.checked = true;
            } else {
                body.classList.remove("dark-theme");
                toogle.checked = false;
            }
        }
    }
}

// This function is just used to store the dark-theme status in the localStorage for faster retieval.
function changeTheme() {
    let body = document.querySelector('body');
    body.classList.toggle('dark-theme');
    
    // Storing the status of the dark-theme in the localStorage
    if (body.classList.contains("dark-theme")) {
        localStorage.setItem("dark-theme", "on");
    } else {
        localStorage.setItem("dark-theme", "off");
    }
}

// This function will update the 'score' as the highest score in the top of the page by checking if
// 'score' is greater than the highest score
function updateHighestScore(score) {
    if (score > highestScore) highestScore = score;
    highestScoreEl.textContent = highestScore;
}
