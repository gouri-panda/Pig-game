/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he wishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

function generatePlayerList() {
    let playersWindow = document.getElementById('players-window');
    playersWindow.innerHTML = '';
    for(let i = 0; i < scores.length; i++) {
        let playerItem = document.createElement('div');
        if(i == 0) {
            playerItem.setAttribute('class', 'player-item active');
        }else{
            playerItem.setAttribute('class', 'player-item');
        }
        playerItem.setAttribute('id', 'player-' + i);
        let playerName = document.createElement('div');
        playerName.setAttribute('class', 'player-name');
        playerName.innerHTML = 'Player ' + (i+1);
        playerItem.appendChild(playerName);
        let playerScore = document.createElement('div');
        playerScore.setAttribute('class', 'player-score');
        playerScore.setAttribute('id', 'score-' + i);
        playerScore.innerHTML = '0';
        playerItem.appendChild(playerScore);
        playersWindow.appendChild(playerItem);
    }
}

console.log("start");
let scores = [0, 0];
let activeScores = 0;
let activePlayer = 0; //index for scores
let doubleSix = false;
let highestScore = 0;
let goal = 100;
generatePlayerList();

// console.log(dice)
let activeScoreDom = document.getElementById('current-player-score');
let currentScoreDom = document.getElementById('current-player-temp-score');
let newGame = document.querySelector('.btn-new');

let highestScoreEl = document.querySelector('.highest-score span');
document.querySelector('.dice').style.display = 'none';
let bottomRoll = document.querySelector('.btn-roll');


bottomRoll.addEventListener('click', function () {
    if (!document.getElementById('score-goal-box').readOnly) {
        document.getElementById('score-goal-box').readOnly = true;
        goal = parseInt(document.getElementById('score-goal-box').value);
    }

    var dice = Math.floor(Math.random() * 6 + 1);
    var diceDom = document.querySelector('.dice');
    diceDom.style.display = 'block';
    diceDom.src = "images/dice-" + dice + ".png";
    diceDom.alt = "You rolled :" + dice;


    if (dice == 1) {
        console.log("1 rolled");
        nextPlayer();
    } else {
        if (dice == 6){
            if (doubleSix){
                looseScore();
            }
            doubleSix = true
        }
        doubleSix = false;
        activeScores += dice;
        currentScoreDom.textContent = activeScores;
    }

});
let buttonHold = document.querySelector('.btn-hold');
buttonHold.addEventListener('click', function () {
    scores[activePlayer] += activeScores;
    updateHighestScore(scores[activePlayer]);
    checkWinner();
    activeScores = 0;
    nextPlayer();
});

newGame.addEventListener('click', function () {
    let playerCount = Number(document.getElementById('player-count').value);
    if (isNaN(playerCount) || playerCount < 2 ) {
        playerCount = 2;
    }
    scores = new Array(playerCount).fill(0);
    activeScores = 0;
    activePlayer = 0;
    highestScore = 0;
    highestScoreEl.textContent = '0';
    activeScoreDom.textContent = '0';
    currentScoreDom.textContent = '0';
    generatePlayerList();
    document.querySelector('.dice').style.display = 'none';
    document.getElementById('score-goal-box').readOnly = false;
});


function nextPlayer() {
    document.getElementById('score-' + activePlayer).textContent = scores[activePlayer].toString();
    if(activePlayer >= scores.length - 1){
        //switch player
        activePlayer = 0; 
    }else{
        //switch player
        activePlayer++;
    }
    activeScoreDom.textContent = scores[activePlayer].toString();
    activeScores = 0;
    currentScoreDom.textContent = '0';
    document.getElementById('current-player-name').textContent = 'Player ' + (activePlayer + 1);
    //switch active state
    changeActiveState(activePlayer);
}

function checkWinner() {
    if(scores[activePlayer] >= 100) {
        document.getElementById('player-' + activePlayer).classList.add('winner');
    }
}

function changeActiveState(playerIndex) {
    if(playerIndex == 0){
        document.getElementById('player-' + (scores.length - 1)).classList.remove('active');
    }else{
        document.getElementById('player-' + (playerIndex - 1)).classList.remove('active');
    }
    document.getElementById('player-' + playerIndex).classList.add('active');
    document.querySelector('.dice').style.display = 'none';
}

function looseScore() {
    console.log('loosing score');
    activeScores = 0;
    scores[activePlayer] = 0;
    activeScoreDom.textContent = scores[activePlayer].toString();
    currentScoreDom.textContent = '0';
}


function changeTheme(checked) {
    document.querySelector('body').classList.toggle('dark-theme');
}
function updateHighestScore(score) {
    if (score > highestScore) highestScore = score;
    highestScoreEl.textContent = highestScore;
}

function toggleRulesModal() {
    document.querySelector('.wrapper').classList.toggle('blur');
    document.querySelector('.modal.rules').classList.toggle('hidden');
}